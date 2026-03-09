import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Pusher from "pusher-js";
import { addNotification } from "@/store/slices/notificationsSlice";

/**
 * WebSocket Soketi üçün konfiqurasiya.
 *
 * Server tərəfində Nginx-də /ws/ location block lazımdır:
 *   location /ws/ {
 *       proxy_pass http://127.0.0.1:8080/;
 *       proxy_http_version 1.1;
 *       proxy_set_header Upgrade $http_upgrade;
 *       proxy_set_header Connection "upgrade";
 *       proxy_set_header Host $host;
 *       proxy_read_timeout 3600;
 *       proxy_send_timeout 3600;
 *   }
 *
 *   Bax: nginx-ws-proxy.conf
 */
const WS_HOST = "api.smartlife.az";
const WS_PORT = 443;
const WS_PATH = "/ws";
const AUTH_ENDPOINT = "https://api.smartlife.az/api/broadcasting/auth";
const APP_KEY = "rv_k8Xp2mNqL5vRtY9wZjH3sBcD";
const FORCE_TLS = true;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Connects via Pusher.js to the Soketi-compatible server and listens for
 * `notification.sent` events on the user's private channel.
 *
 * @param {Object|null} user           – Redux auth user ({ id, is_resident })
 * @param {Function}    onNotification – called with the parsed notif payload
 * @param {Function}    onConnected    – called once after successful channel subscription
 */
export function useNotificationsSocket(user, onNotification, onConnected) {
  const dispatch = useDispatch();
  const pusherRef = useRef(null);
  const onNotificationRef = useRef(onNotification);
  const onConnectedRef = useRef(onConnected);
  onNotificationRef.current = onNotification;
  onConnectedRef.current = onConnected;

  useEffect(() => {
    if (!user?.id) return;

    const token = getCookie("smartlife_token");
    if (!token) return;

    const accountType = user.is_resident ? "resident" : "user";
    const channelName = `private-notifications.${accountType}.${user.id}`;

    // Initialize Pusher client (Soketi-compatible)
    const pusher = new Pusher(APP_KEY, {
      wsHost: WS_HOST,
      wsPort: WS_PORT,
      wssPort: WS_PORT,
      wsPath: WS_PATH,
      forceTLS: FORCE_TLS,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      cluster: "mt1",
      authEndpoint: AUTH_ENDPOINT,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
      // Reconnect strategiyası
      activityTimeout: 120000,
      pongTimeout: 30000,
    });

    pusherRef.current = pusher;

    // Subscribe to private channel
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      onConnectedRef.current?.();
    });

    channel.bind("pusher:subscription_error", (err) => {
      console.warn("[WS] Subscription error:", err?.status || err);
    });

    channel.bind("notification.sent", (data) => {
      const payload = typeof data === "string" ? JSON.parse(data) : data;
      const notif = {
        title: payload.title || "Bildiriş",
        message: payload.message || "",
        type: payload.type || "info",
        data: payload.data || null,
        receivedAt: new Date().toISOString(),
      };
      dispatch(addNotification(notif));
      onNotificationRef.current?.(notif);
    });

    pusher.connection.bind("error", (err) => {
      console.warn("[WS] Connection error:", err?.error?.data || err);
    });

    pusher.connection.bind("state_change", ({ current }) => {
      if (current === "connected") {
        console.log("[WS] Connected");
      } else if (current === "disconnected" || current === "unavailable") {
        console.warn("[WS] Disconnected, reconnecting...");
      }
    });

    return () => {
      try {
        channel.unbind_all();
        pusher.unsubscribe(channelName);
        pusher.disconnect();
      } catch {}
      pusherRef.current = null;
    };
  }, [user?.id, user?.is_resident]);
}


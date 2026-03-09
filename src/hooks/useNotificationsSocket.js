import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Pusher from "pusher-js";
import { addNotification } from "@/store/slices/notificationsSlice";

/**
 * WS_HOST / WS_PORT:
 *   Currently port 8080 is firewalled from the internet.
 *   To make this work in production, add a Nginx proxy on api.smartlife.az:
 *
 *   location /ws/ {
 *       proxy_pass http://127.0.0.1:8080/;
 *       proxy_http_version 1.1;
 *       proxy_set_header Upgrade $http_upgrade;
 *       proxy_set_header Connection "upgrade";
 *       proxy_set_header Host $host;
 *       proxy_read_timeout 3600;
 *   }
 *
 *   Then change WS_HOST to 'api.smartlife.az', WS_PORT to 80, WS_PATH to '/ws'
 *   and set FORCE_TLS to false (or port 443, FORCE_TLS true for HTTPS).
 */
const WS_HOST = "api.smartlife.az";
const WS_PORT = 8080;
const WS_PATH = "/app";
const AUTH_ENDPOINT = "http://api.smartlife.az/api/broadcasting/auth";
const APP_KEY = "rv_k8Xp2mNqL5vRtY9wZjH3sBcD";
const FORCE_TLS = false;

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
      wsPath: "",
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
    });

    pusherRef.current = pusher;

    // Subscribe to private channel
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      onConnectedRef.current?.();
    });

    channel.bind("pusher:subscription_error", (err) => {
      // Auth failed or server unreachable — silent fail, retry handled by Pusher.js
      console.warn("[WS] Subscription error:", err);
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

    pusher.connection.bind("error", () => {
      // Silently ignore — port not yet exposed via Nginx proxy
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


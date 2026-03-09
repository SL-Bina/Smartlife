import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/slices/notificationsSlice";
import api from "@/services/api";

const WS_URL = "wss://api.smartlife.az:8080/app/rv_k8Xp2mNqL5vRtY9wZjH3sBcD";
const AUTH_URL = "http://api.smartlife.az/api/broadcasting/auth";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Connects to the Pusher-compatible WebSocket server and listens for
 * `notification.sent` events on the user's private channel.
 *
 * @param {Object|null} user           – Redux auth user ({ id, is_resident })
 * @param {Function}    onNotification – called with the parsed notif payload
 * @param {Function}    onConnected    – called once after successful channel subscription
 */
export function useNotificationsSocket(user, onNotification, onConnected) {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
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

    let active = true;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // Pusher will immediately send pusher:connection_established
    };

    ws.onmessage = async (event) => {
      if (!active) return;

      let message;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      // Step 1: connection established → authenticate & subscribe
      if (message.event === "pusher:connection_established") {
        let socketId;
        try {
          socketId = JSON.parse(message.data).socket_id;
        } catch {
          return;
        }

        try {
          const res = await api.post(AUTH_URL, {
            socket_id: socketId,
            channel_name: channelName,
          });
          const auth = res.data?.auth;
          if (!auth || !active) return;

          ws.send(
            JSON.stringify({
              event: "pusher:subscribe",
              data: { channel: channelName, auth },
            })
          );
        } catch (err) {
          console.warn("[WS] Channel auth failed:", err?.message);
        }
      }

      // Step 2: subscription confirmed → fire login toast
      if (message.event === "pusher_internal:subscription_succeeded") {
        onConnectedRef.current?.();
      }

      // Step 2: new notification event
      if (message.event === "notification.sent") {
        let payload;
        try {
          payload =
            typeof message.data === "string"
              ? JSON.parse(message.data)
              : message.data;
        } catch {
          payload = {};
        }

        const notif = {
          title: payload.title || "Bildiriş",
          message: payload.message || "",
          type: payload.type || "info",
          data: payload.data || null,
          receivedAt: new Date().toISOString(),
        };

        dispatch(addNotification(notif));
        onNotificationRef.current?.(notif);
      }
    };

    ws.onerror = () => {
      // WebSocket connection failed (likely port not exposed externally).
      // Backend needs to proxy port 8080 via Nginx for browser access.
    };

    ws.onclose = () => {
      // Intentionally no auto-reconnect — the layout remounts when user changes
    };

    return () => {
      active = false;
      try {
        ws.close();
      } catch {}
      wsRef.current = null;
    };
  }, [user?.id, user?.is_resident]); // reconnect only when the user identity changes
}

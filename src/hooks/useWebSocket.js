import { useEffect, useRef, useState } from "react";

const WS_URL = "wss://echo.websocket.events";

export default function useWebSocket(onMessage, url = WS_URL) {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WS connected");
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log("WS disconnected");
      setIsConnected(false);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (msg) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(msg);
    } else {
      console.warn("WebSocket bağlı deyil");
    }
  };

  return { isConnected, sendMessage };
}
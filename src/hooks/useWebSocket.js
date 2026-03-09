import { useEffect, useRef, useState } from "react";

// WebSocket server URL (əgər backenddə varsa, onu yazın)
const WS_URL = "ws://echo.websocket.org"; // Demo üçün public echo server

export default function useWebSocket(onMessage, url = WS_URL) {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.current = new window.WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = (e) => {
      setIsConnected(false);
      console.error("WebSocket error:", e);
    };

    ws.current.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };

    return () => {
      ws.current && ws.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const sendMessage = (msg) => {
    if (ws.current && isConnected) {
      ws.current.send(msg);
    }
  };

  return { isConnected, sendMessage };
}

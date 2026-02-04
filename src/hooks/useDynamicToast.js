import { useCallback, useState } from "react";

export function useDynamicToast() {
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    duration: 2500,
  });

  const showToast = useCallback((payload) => {
    const { type = "info", title = "", message = "", duration = 2500 } = payload;

    // eyni anda üst-üstə düşməsin deyə əvvəl bağlayıb sonra açırıq
    setToast((p) => ({ ...p, open: false }));
    setTimeout(() => {
      setToast({
        open: true,
        type,
        title,
        message,
        duration,
      });
    }, 40);
  }, []);

  const closeToast = useCallback(() => {
    setToast((p) => ({ ...p, open: false }));
  }, []);

  return { toast, showToast, closeToast };
}

import { useDynamicToast } from "@/hooks/useDynamicToast";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useSelector } from "react-redux";
export default function NotificationListener() {
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useDynamicToast();

  useNotificationsSocket(
    user,
    (notif) => {
      showToast({
        title: notif.title,
        message: notif.message,
        type: notif.type || "info",
      });
    },
    null
  );

  return null;
}

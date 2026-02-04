import React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function AiChatToggleButton({
  setOpenChat,
  isAnyOverlayOpen,
  sidenavPosition = "left",
}) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Mobilde overlay-ə görə gizlətməni söndürürük (çünki çox vaxt "true" qalır)
  const shouldHide = !isMobile && !!isAnyOverlayOpen;

  // ✅ Mobil üçün kənardan məsafələr (safe-area ilə)
  const mobileOffset = 16; // px
  const desktopOffset = 88; // sənin əvvəlki dəyər

  // motion üçün left/right dəyərləri
  const pos = React.useMemo(() => {
    // Mobil: həmişə sağ-alt
    if (isMobile) {
      return {
        left: "auto",
        right: `calc(${mobileOffset}px + env(safe-area-inset-right))`,
      };
    }

    // Desktop: sənin logic
    return {
      left: sidenavPosition === "right" ? desktopOffset : "auto",
      right: sidenavPosition === "right" ? "auto" : desktopOffset,
    };
  }, [isMobile, sidenavPosition]);

  return (
    <motion.div
      initial={false}
      animate={{
        scale: shouldHide ? 0 : 1,
        opacity: shouldHide ? 0 : 1,
        ...pos,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="
        fixed
        z-40
        bottom-4
        sm:bottom-6
        pointer-events-auto
      "
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <IconButton
        variant="gradient"
        size={isMobile ? "md" : "lg"}
        className="
          rounded-full
          shadow-2xl
          bg-gradient-to-r from-blue-700 to-red-700
         
          active:scale-95
          transition
        "
        onClick={() => setOpenChat(true)}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
      </IconButton>
    </motion.div>
  );
}

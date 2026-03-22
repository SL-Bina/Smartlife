import React, { useEffect, useState, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  subscribeToasts,
  getToasts,
  removeToast,
} from "@/utils/toastManager";

const TYPE_META = {
  success: {
    icon: CheckCircleIcon,
    label: "Uğurlu",
    color: "#22c55e",
    bg: "linear-gradient(180deg, rgba(8, 40, 24, 0.96) 0%, rgba(6, 26, 16, 0.98) 100%)",
    soft: "rgba(34, 197, 94, 0.16)",
    border: "rgba(34, 197, 94, 0.35)",
    text: "#86efac",
    glow: "rgba(34, 197, 94, 0.18)",
  },
  error: {
    icon: XCircleIcon,
    label: "Xəta",
    color: "#ef4444",
    bg: "linear-gradient(180deg, rgba(48, 10, 10, 0.96) 0%, rgba(28, 7, 7, 0.98) 100%)",
    soft: "rgba(239, 68, 68, 0.16)",
    border: "rgba(239, 68, 68, 0.35)",
    text: "#fca5a5",
    glow: "rgba(239, 68, 68, 0.18)",
  },
  danger: {
    icon: XCircleIcon,
    label: "Təhlükə",
    color: "#dc2626",
    bg: "linear-gradient(180deg, rgba(58, 9, 9, 0.96) 0%, rgba(35, 6, 6, 0.98) 100%)",
    soft: "rgba(220, 38, 38, 0.16)",
    border: "rgba(220, 38, 38, 0.38)",
    text: "#fda4af",
    glow: "rgba(220, 38, 38, 0.2)",
  },
  warning: {
    icon: ExclamationTriangleIcon,
    label: "Xəbərdarlıq",
    color: "#f59e0b",
    bg: "linear-gradient(180deg, rgba(52, 30, 5, 0.96) 0%, rgba(30, 17, 3, 0.98) 100%)",
    soft: "rgba(245, 158, 11, 0.16)",
    border: "rgba(245, 158, 11, 0.35)",
    text: "#fcd34d",
    glow: "rgba(245, 158, 11, 0.18)",
  },
  info: {
    icon: InformationCircleIcon,
    label: "Məlumat",
    color: "#3b82f6",
    bg: "linear-gradient(180deg, rgba(9, 25, 52, 0.96) 0%, rgba(6, 15, 31, 0.98) 100%)",
    soft: "rgba(59, 130, 246, 0.16)",
    border: "rgba(59, 130, 246, 0.35)",
    text: "#93c5fd",
    glow: "rgba(59, 130, 246, 0.18)",
  },
};

const getMeta = (type) => TYPE_META[type] || TYPE_META.info;

const ProgressBar = memo(function ProgressBar({ duration, color }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 4,
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        style={{
          height: "100%",
          width: "100%",
          transformOrigin: "left",
          background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.95))`,
          boxShadow: `0 0 18px ${color}`,
        }}
      />
    </div>
  );
});

function ToastItem({ toast, index }) {
  const meta = getMeta(toast.type);
  const Icon = meta.icon;

  const handleDismiss = useCallback(() => {
    removeToast(toast.id);
  }, [toast.id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -80, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1 - index * 0.02,
      }}
      exit={{
        opacity: 0,
        y: -40,
        scale: 0.92,
        transition: { duration: 0.22 },
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info) => {
        if (info.offset.y < -50) handleDismiss();
      }}
      whileHover={{ y: -2 }}
      style={{
        width: "min(440px, calc(100vw - 24px))",
        zIndex: 100 - index,
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 22,
          background: meta.bg,
          border: `1px solid ${meta.border}`,
          boxShadow: `
            0 14px 34px rgba(0,0,0,0.32),
            0 6px 14px rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.03),
            0 0 24px ${meta.glow}
          `,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          userSelect: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at top right, ${meta.soft} 0%, transparent 38%),
              linear-gradient(180deg, rgba(255,255,255,0.04), transparent 45%)
            `,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: meta.color,
            boxShadow: `0 0 18px ${meta.color}`,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "15px 16px 18px 16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: meta.soft,
              border: `1px solid ${meta.border}`,
              boxShadow: `0 0 18px ${meta.glow}`,
            }}
          >
            <Icon
              style={{
                width: 23,
                height: 23,
                color: meta.color,
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: meta.text,
                  background: meta.soft,
                  border: `1px solid ${meta.border}`,
                }}
              >
                {meta.label}
              </span>
            </div>

            <div
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 15,
                lineHeight: "20px",
                marginBottom: toast.message ? 5 : 0,
                wordBreak: "break-word",
              }}
            >
              {toast.title || meta.label}
            </div>

            {toast.message && (
              <div
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 13,
                  lineHeight: "18px",
                  wordBreak: "break-word",
                  paddingRight: 8,
                }}
              >
                {toast.message}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Bağla"
            style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <XMarkIcon style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {toast.duration > 0 && (
          <ProgressBar duration={toast.duration} color={meta.color} />
        )}
      </div>
    </motion.div>
  );
}

export default function DynamicToastContainer() {
  const [toasts, setToasts] = useState(getToasts);

  useEffect(() => {
    return subscribeToasts(setToasts);
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast, index) => (
          <ToastItem key={toast.id} toast={toast} index={index} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
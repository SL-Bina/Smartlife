import React, { useEffect, useMemo } from "react";
import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

/**
 * Props:
 * - open: boolean
 * - type: "success" | "error" | "info"
 * - title?: string
 * - message: string
 * - onClose: () => void
 * - duration?: number (ms) default 2500
 */
export default function DynamicToast({
    open,
    type = "info",
    title,
    message,
    onClose,
    duration = 2500,
}) {
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(t);
    }, [open, duration, onClose]);

    const meta = useMemo(() => {
        if (type === "success")
            return {
                ring: "ring-green-600/40",
                bg: "bg-green-900/80",
                iconWrap: "bg-green-600",
                text: "text-white",
                iconColor: "text-white",
                icon: <CheckCircleIcon className="h-5 w-5" />,
            };

        if (type === "error")
            return {
                ring: "ring-red-600/40",
                bg: "bg-red-900/85",
                iconWrap: "bg-red-600",
                text: "text-white",
                iconColor: "text-white",
                icon: <XCircleIcon className="h-5 w-5" />,
            };

        return {
            ring: "ring-sky-600/40",
            bg: "bg-slate-900/90",
            iconWrap: "bg-sky-600",
            text: "text-white",
            iconColor: "text-white",
            icon: <InformationCircleIcon className="h-5 w-5" />,
        };
    }, [type]);


    return (
        <div className="pointer-events-none fixed top-3 left-1/2 z-[9999] -translate-x-1/2">
            <div
                className={[
                    "pointer-events-auto",
                    "transition-all duration-300 ease-out",
                    open
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-4 scale-95",
                ].join(" ")}
            >
                <div
                    className={[
                        "min-w-[280px] max-w-[520px]",
                        "rounded-[22px]",
                        "backdrop-blur-xl",
                        "shadow-2xl shadow-black/30",
                        "ring-1",
                        meta.ring,
                        meta.bg,
                        "border border-white/10",
                        "px-4 py-3",
                        "flex items-center gap-3",
                    ].join(" ")}
                >
                    <div
                        className={[
                            "h-9 w-9 rounded-full flex items-center justify-center",
                            meta.iconWrap,
                            meta.iconColor,
                        ].join(" ")}
                    >
                        {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                        {title ? (
                            <div className="text-white font-semibold text-sm truncate">
                                {title}
                            </div>
                        ) : null}
                        <div className={[meta.text, "text-xs leading-4"].join(" ")}>
                            {message}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full hover:bg-white/10 active:bg-white/15 transition pointer-events-auto flex items-center justify-center text-white/70"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

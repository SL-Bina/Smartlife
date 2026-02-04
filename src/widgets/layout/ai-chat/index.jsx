import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography, IconButton, Input, Button, Spinner } from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  ChevronLeftIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { AiChatToggleButton } from "./components/AiChatToggleButton";

export function AiChat({ sidenavPosition = "left" }) {
  const [openChat, setOpenChat] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // visual viewport (iOS keyboard fix)
  const [vv, setVv] = React.useState({ height: null, offsetTop: 0 });

  // panel ref -> wheel/touch block üçün
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    if (!openChat) return;
    if (!isMobile) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      setVv({
        height: Math.round(viewport.height),
        offsetTop: Math.round(viewport.offsetTop || 0),
      });
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [openChat, isMobile]);

  // ---------- Conversations (history) ----------
  const [chats, setChats] = React.useState([
    {
      id: "support",
      title: "Support Chat",
      subtitle: "Son mesaj: Salam…",
      messages: [{ role: "assistant", content: "Salam 👋 Mən kömək edim. Nə lazımdır?" }],
    },
    {
      id: "helper",
      title: "AI Helper",
      subtitle: "Son mesaj: Fayl göndər…",
      messages: [{ role: "assistant", content: "Salam! Fayl göndərə bilərsən 📎" }],
    },
  ]);

  const [activeChatId, setActiveChatId] = React.useState("support");

  // mobile view state: "list" | "chat"
  const [mobileView, setMobileView] = React.useState("list");

  // composer
  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);

  const listRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  // page scroll restore üçün
  const scrollYRef = React.useRef(0);

  const activeChat = React.useMemo(
    () => chats.find((c) => c.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  // ✅ 1) BODY SCROLL LOCK (desktop + mobile)
  React.useEffect(() => {
    if (!openChat) {
      // unlock
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";

      if (scrollYRef.current) window.scrollTo(0, scrollYRef.current);
      return;
    }

    // lock
    scrollYRef.current = window.scrollY || window.pageYOffset || 0;

    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none"; // mobil üçün də yaxşı olur (body scroll tam dayansın)

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";

      window.scrollTo(0, scrollYRef.current);
    };
  }, [openChat]);

  // ✅ 2) CAPTURE LEVEL: wheel/touchmove blokla (panel daxilində scroll icazəlidir)
  React.useEffect(() => {
    if (!openChat) return;

    const isInsidePanel = (target) => {
      const p = panelRef.current;
      if (!p) return false;
      return p.contains(target);
    };

    const onWheel = (e) => {
      // panelin içindəsə qoy scroll olsun
      if (isInsidePanel(e.target)) return;
      // panelin çölündə body scroll olmasın
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (isInsidePanel(e.target)) return;
      e.preventDefault();
    };

    // capture + passive:false mütləqdir
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, [openChat]);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // open -> mobile default list, desktop default chat
  React.useEffect(() => {
    if (!openChat) return;
    setError(null);
    if (isMobile) setMobileView("list");
    else setMobileView("chat");
  }, [openChat, isMobile]);

  // scroll to bottom (chat view)
  React.useEffect(() => {
    if (!openChat) return;
    if (isMobile && mobileView !== "chat") return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [openChat, isMobile, mobileView, activeChatId, activeChat?.messages?.length, sending]);

  // always focus input when in chat view
  React.useEffect(() => {
    if (!openChat) return;
    if (isMobile && mobileView !== "chat") return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [openChat, isMobile, mobileView, activeChatId]);

  const close = () => {
    setOpenChat(false);
    setError(null);
    setText("");
  };

  /**
   * AI integration point:
   * burada backend-ə request atacaqsan (Groq/OpenAI və s.)
   */
  const callAI = async (nextMessages, newFiles = []) => {
    // DEMO:
    await new Promise((r) => setTimeout(r, 600));
    return "AI cavabı burda olacaq ✅ (inteqrasiya edəndə backend-dən gələcək)";
  };

  const updateActiveChatMessages = (nextMessages) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: nextMessages,
              subtitle: `Son mesaj: ${
                nextMessages[nextMessages.length - 1]?.content?.slice(0, 22) || ""
              }…`,
            }
          : c
      )
    );
  };

  const send = async () => {
    const v = text.trim();
    if (!v || sending) return;

    setError(null);
    setSending(true);

    const next = [...(activeChat?.messages || []), { role: "user", content: v }];
    updateActiveChatMessages(next);
    setText("");

    try {
      const answer = await callAI(next.map((m) => ({ role: m.role, content: m.content })));
      const done = [...next, { role: "assistant", content: answer }];
      updateActiveChatMessages(done);
    } catch (e) {
      setError(e?.message || "Xəta baş verdi");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const selectChat = (id) => {
    setActiveChatId(id);
    setError(null);
    if (isMobile) setMobileView("chat");
  };

  const onPickFile = () => fileRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // eyni faylı təkrar seçmək üçün
    e.target.value = "";

    const url = URL.createObjectURL(file);

    const attachment = {
      type: file.type?.startsWith("image/") ? "image" : "file",
      name: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size,
      url,
      file,
    };

    setError(null);
    setSending(true);

    const prevMessages = activeChat?.messages || [];

    const nextMessages = [
      ...prevMessages,
      {
        role: "user",
        content: text.trim() || "",
        attachments: [attachment],
      },
    ];

    updateActiveChatMessages(nextMessages);
    setText("");

    try {
      const answer = await callAI(
        nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
          attachments: (m.attachments || []).map((a) => ({
            name: a.name,
            mime: a.mime,
          })),
        })),
        [attachment]
      );

      updateActiveChatMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch (err) {
      setError(err?.message || "Xəta baş verdi");
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <>
      <AiChatToggleButton
        setOpenChat={setOpenChat}
        isAnyOverlayOpen={openChat}
        sidenavPosition={sidenavPosition}
      />

      <AnimatePresence>
        {openChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30"
              onClick={() => {
                if (!isMobile) close();
              }}
            />

            {/* Panel */}
            <motion.aside
              ref={panelRef}
              initial={
                isMobile
                  ? { y: "100%", opacity: 1 }
                  : { x: sidenavPosition === "right" ? -720 : 720, opacity: 0 }
              }
              animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
              exit={
                isMobile
                  ? { y: "100%", opacity: 1 }
                  : { x: sidenavPosition === "right" ? -720 : 720, opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={`
                fixed z-50 flex flex-col overflow-hidden shadow-2xl
                bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800
                overscroll-contain
                ${isMobile
                  ? "inset-0 w-full h-full"
                  : `inset-y-0 ${
                      sidenavPosition === "right" ? "left-0 border-r" : "right-0 border-l"
                    } w-[720px]`
                }
              `}
              style={{
                paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : undefined,
                height: isMobile && vv.height ? `${vv.height}px` : undefined,
                transform: isMobile && vv.offsetTop ? `translateY(${vv.offsetTop}px)` : undefined,
              }}
            >
              {/* HEADER */}
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isMobile ? (
                    mobileView === "chat" ? (
                      <IconButton
                        variant="text"
                        onClick={() => setMobileView("list")}
                        className="rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                        title="Chats"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </IconButton>
                    ) : (
                      <span className="w-10" />
                    )
                  ) : (
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}

                  <div className="leading-tight">
                    <Typography variant="h6" className="text-gray-900 dark:text-white">
                      {isMobile
                        ? mobileView === "list"
                          ? "Chats"
                          : activeChat?.title || "Smart Chat"
                        : "Smart Chat"}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs">
                      {isMobile
                        ? mobileView === "list"
                          ? "Tarixçə / söhbətlər"
                          : "Support / assistant panel"
                        : "Support / assistant panel"}
                    </Typography>
                  </div>
                </div>

                <IconButton
                  variant="text"
                  onClick={close}
                  className="rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </IconButton>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-hidden bg-gray-50/60 dark:bg-gray-900/60">
                {/* DESKTOP: split layout */}
                {!isMobile && (
                  <div className="h-full grid grid-cols-[260px_1fr]">
                    {/* LEFT: history */}
                    <div
                      className="border-r border-gray-100 dark:border-gray-800 p-4 overflow-y-auto custom-sidenav-scrollbar overscroll-contain"
                      style={{ WebkitOverflowScrolling: "touch" }}
                    >
                      <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-3 text-xs">
                        Chats
                      </Typography>

                      <div className="space-y-2">
                        {chats.map((c) => {
                          const active = c.id === activeChatId;
                          return (
                            <button
                              key={c.id}
                              onClick={() => selectChat(c.id)}
                              className={`
                                w-full text-left rounded-xl px-3 py-3 border transition
                                ${
                                  active
                                    ? "bg-gray-900 text-white border-gray-800"
                                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-sm truncate">{c.title}</span>
                              </div>
                              <div className={`text-xs mt-1 truncate ${active ? "text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                                {c.subtitle}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT: chat */}
                    <ChatView
                      listRef={listRef}
                      inputRef={inputRef}
                      fileRef={fileRef}
                      messages={activeChat?.messages || []}
                      sending={sending}
                      error={error}
                      text={text}
                      setText={setText}
                      onKeyDown={onKeyDown}
                      onSend={send}
                      onPickFile={onPickFile}
                      onFileSelected={onFileSelected}
                    />
                  </div>
                )}

                {/* MOBILE: list OR chat */}
                {isMobile && (
                  <AnimatePresence mode="wait">
                    {mobileView === "list" ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                        className="h-full p-4 overflow-y-auto custom-sidenav-scrollbar overscroll-contain"
                        style={{ WebkitOverflowScrolling: "touch" }}
                      >
                        <div className="space-y-2">
                          {chats.map((c) => {
                            const active = c.id === activeChatId;
                            return (
                              <button
                                key={c.id}
                                onClick={() => selectChat(c.id)}
                                className={`
                                  w-full text-left rounded-2xl px-4 py-4 border transition
                                  ${
                                    active
                                      ? "bg-gray-900 text-white border-gray-800"
                                      : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }
                                `}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-sm truncate">{c.title}</span>
                                  <Bars3Icon className={`h-5 w-5 ${active ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`} />
                                </div>
                                <div className={`text-xs mt-1 truncate ${active ? "text-gray-300" : "text-gray-500 dark:text-gray-400"}`}>
                                  {c.subtitle}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4 text-[11px] text-gray-500 dark:text-gray-400">
                          Chat seç → mesajlaşma açılacaq
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="h-full"
                      >
                        <ChatView
                          listRef={listRef}
                          inputRef={inputRef}
                          fileRef={fileRef}
                          messages={activeChat?.messages || []}
                          sending={sending}
                          error={error}
                          text={text}
                          setText={setText}
                          onKeyDown={onKeyDown}
                          onSend={send}
                          onPickFile={onPickFile}
                          onFileSelected={onFileSelected}
                          compact
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------- Chat View (messages + composer) -------------------- */
function ChatView({
  listRef,
  inputRef,
  fileRef,
  messages,
  sending,
  error,
  text,
  setText,
  onKeyDown,
  onSend,
  onPickFile,
  onFileSelected,
  compact = false,
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={listRef}
          className={`h-full overflow-y-auto custom-sidenav-scrollbar overscroll-contain ${
            compact ? "px-4 py-4" : "px-6 py-6"
          } space-y-3`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {messages.map((m, idx) => (
            <ChatBubble key={idx} role={m.role} text={m.content} attachments={m.attachments || []} />
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Yazır...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={`${compact ? "px-4" : "px-6"} pt-2`}>
          <div className="p-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
              {error}
            </Typography>
          </div>
        </div>
      )}

      {/* Composer */}
      <div
        className={`
          ${compact ? "px-4" : "px-6"}
          py-3 sm:py-4
          border-t border-gray-100 dark:border-gray-800
          bg-white dark:bg-gray-900
        `}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={onFileSelected}
        />

        <div className="flex items-end gap-2">
          <IconButton
            variant="text"
            onClick={onPickFile}
            className="rounded-xl dark:text-gray-300 dark:hover:bg-gray-800"
            title="Fayl əlavə et"
            disabled={sending}
          >
            <PaperClipIcon className="h-5 w-5" />
          </IconButton>

          <div className="flex-1">
            <Input
              inputRef={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Mesaj yaz… (Enter = göndər)"
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
              disabled={sending}
              autoFocus
            />
          </div>

          <Button
            color="blue"
            onClick={onSend}
            disabled={sending || !text.trim()}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2 rounded-xl"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            Göndər
          </Button>
        </div>

        <Typography variant="small" className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          Shift+Enter: yeni sətir • Fayl: PaperClip ilə • Mesajlar paneldə saxlanır
        </Typography>
      </div>
    </div>
  );
}

/* -------------------- Bubble -------------------- */
function ChatBubble({ role, text, attachments = [] }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm border ${
          isUser
            ? "bg-blue-600 text-white border-blue-700"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2 mb-2">
            {attachments.map((a, i) => {
              const isImage = a?.mime?.startsWith("image/") || a?.type === "image";
              if (isImage) {
                return (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={a.url}
                      alt={a.name || "image"}
                      className="w-full max-h-[260px] object-cover"
                      loading="lazy"
                    />
                    {a.name && (
                      <div className={`px-2 py-1 text-[11px] ${isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                        {a.name}
                      </div>
                    )}
                  </div>
                );
              }

              // non-image file
              return (
                <a
                  key={i}
                  href={a.url}
                  download={a.name}
                  className={`block rounded-xl px-3 py-2 border ${
                    isUser
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-900 dark:text-white"
                  }`}
                >
                  <div className="text-xs font-semibold truncate">{a.name || "Fayl"}</div>
                  <div className={`text-[11px] ${isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                    {a.mime || "file"}
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* text */}
        {text ? <div className="whitespace-pre-wrap">{text}</div> : null}
      </div>
    </div>
  );
}

export default AiChat;

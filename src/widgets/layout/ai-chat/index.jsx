import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography, IconButton, Input, Button, Spinner, Chip } from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  ChevronLeftIcon,
  PaperClipIcon,
  SparklesIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { AiChatToggleButton } from "./components/AiChatToggleButton";

const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (e) {
    console.error(`Error reading cookie ${name}:`, e);
    return null;
  }
};

const setCookie = (name, value, days = 365) => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  } catch (e) {
    console.error(`Error writing cookie ${name}:`, e);
  }
};

const CHAT_HISTORY_COOKIE = "smartchat_history";
const ACTIVE_CHAT_COOKIE = "smartchat_active";

const loadChatHistory = () => {
  try {
    const saved = getCookie(CHAT_HISTORY_COOKIE);
    if (saved) {
      return JSON.parse(decodeURIComponent(saved));
    }
  } catch (e) {
    console.error("Error loading chat history:", e);
  }
  return null;
};

const saveChatHistory = (chats) => {
  try {
    const data = JSON.stringify(chats);
    setCookie(CHAT_HISTORY_COOKIE, encodeURIComponent(data), 365);
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
};

const loadActiveChatId = () => {
  return getCookie(ACTIVE_CHAT_COOKIE) || "support";
};

const saveActiveChatId = (chatId) => {
  setCookie(ACTIVE_CHAT_COOKIE, chatId, 365);
};

export function AiChat({ sidenavPosition = "left" }) {
  const [openChat, setOpenChat] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const [vv, setVv] = React.useState({ height: null, offsetTop: 0 });

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

  const getDefaultChats = () => [
    {
      id: "support",
      title: "SmartChat",
      subtitle: "Son mesaj: SmartLife platforması haqqında kömək",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        role: "assistant",
        content: "Salam! 👋 Mən SmartChat - SmartLife platformasının AI köməkçisiyəm. Sizə platformanın bütün funksionallığı haqqında kömək edə bilərəm.\n\nSmartLife platformasında:\n🏢 MTK, Complex, Buildings, Blocks, Properties idarəetməsi\n💰 Maliyyə modulu (invoices, payments, reports)\n🔔 Bildirişlər və müraciətlər\n📊 Dashboard və hesabatlar\n⚙️ Xidmətlər və cihazlar\n\nNə ilə kömək edə bilərəm? 😊"
      }],
    },
  ];

  const [chats, setChats] = React.useState(() => {
    const saved = loadChatHistory();
    if (saved && saved.length > 0) {
      return saved;
    }
    return getDefaultChats();
  });

  const [activeChatId, setActiveChatId] = React.useState(() => {
    return loadActiveChatId();
  });

  React.useEffect(() => {
    saveChatHistory(chats);
  }, [chats]);

  React.useEffect(() => {
    saveActiveChatId(activeChatId);
  }, [activeChatId]);

  const [mobileView, setMobileView] = React.useState("list");

  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState(null);

  const listRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const scrollYRef = React.useRef(0);

  const activeChat = React.useMemo(
    () => chats.find((c) => c.id === activeChatId) || chats[0],
    [chats, activeChatId]
  );

  React.useEffect(() => {
    if (!openChat) {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";

      if (scrollYRef.current) window.scrollTo(0, scrollYRef.current);
      return;
    }

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

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";

      window.scrollTo(0, scrollYRef.current);
    };
  }, [openChat]);

  React.useEffect(() => {
    if (!openChat) return;

    const isInsidePanel = (target) => {
      const p = panelRef.current;
      if (!p) return false;

      let el = target;
      while (el && el !== document.body) {
        if (el === p || p.contains(el)) return true;
        el = el.parentElement;
      }
      return false;
    };

    const isScrollable = (target) => {
      const el = target;
      const style = window.getComputedStyle(el);
      const isScrollable =
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll' ||
        style.overflow === 'auto' ||
        style.overflow === 'scroll';

      if (isScrollable && el.scrollHeight > el.clientHeight) {
        return true;
      }

      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        const parentScrollable =
          parentStyle.overflowY === 'auto' ||
          parentStyle.overflowY === 'scroll' ||
          parentStyle.overflow === 'auto' ||
          parentStyle.overflow === 'scroll';

        if (parentScrollable && parent.scrollHeight > parent.clientHeight) {
          return true;
        }
        parent = parent.parentElement;
      }

      return false;
    };

    const onWheel = (e) => {
      if (isInsidePanel(e.target) && isScrollable(e.target)) {
        return;
      }
      if (!isInsidePanel(e.target)) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      if (isInsidePanel(e.target) && isScrollable(e.target)) {
        return;
      }
      if (!isInsidePanel(e.target)) {
        e.preventDefault();
      }
    };

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

  React.useEffect(() => {
    if (!openChat) return;
    setError(null);
    if (isMobile) setMobileView("list");
    else setMobileView("chat");
  }, [openChat, isMobile]);

  React.useEffect(() => {
    if (!openChat) return;
    if (isMobile && mobileView !== "chat") return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [openChat, isMobile, mobileView, activeChatId, activeChat?.messages?.length, sending]);

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

  const callAI = async (nextMessages, newFiles = []) => {
    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

      if (!GROQ_API_KEY) {
        throw new Error("Groq API key tapılmadı. Zəhmət olmasa VITE_GROQ_API_KEY environment variable-ını təyin edin.");
      }

      const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

      const systemPrompt = `Sən SmartLife platformasının AI köməkçisidir. SmartLife - müasir, gözoxşayan dizaynı olan, istifadəsi asan property/real estate idarəetmə platformasıdır.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...nextMessages.map((msg) => {
          const groqMsg = {
            role: msg.role,
            content: msg.content || "",
          };

          if (msg.attachments && msg.attachments.length > 0) {
            const attachmentsInfo = msg.attachments
              .map((a) => `[Fayl: ${a.name} (${a.mime})]`)
              .join("\n");
            groqMsg.content = `${groqMsg.content}\n\n${attachmentsInfo}`.trim();
          }

          return groqMsg;
        }),
      ];

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message ||
          `Groq API xətası: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const assistantMessage = data.choices?.[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error("AI-dan cavab alınmadı");
      }

      return assistantMessage;
    } catch (error) {
      console.error("Groq API xətası:", error);
      throw error;
    }
  };

  const updateActiveChatMessages = (nextMessages) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
            ...c,
            messages: nextMessages,
            subtitle: `Son mesaj: ${nextMessages[nextMessages.length - 1]?.content?.slice(0, 30) || ""
              }…`,
            updatedAt: new Date().toISOString(),
          }
          : c
      )
    );
  };

  const createNewChat = () => {
    const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newChat = {
      id: newChatId,
      title: `SmartChat ${chats.length + 1}`,
      subtitle: "Yeni söhbət başladı",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        role: "assistant",
        content: "Salam! 👋 Mən SmartChat - SmartLife platformasının AI köməkçisiyəm. Sizə platformanın bütün funksionallığı haqqında kömək edə bilərəm.\n\nNə ilə kömək edə bilərəm? 😊"
      }],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    if (isMobile) setMobileView("chat");
  };

  const deleteChat = (chatId) => {
    if (chats.length <= 1) {
      const defaultChats = getDefaultChats();
      setChats(defaultChats);
      setActiveChatId(defaultChats[0].id);
      return;
    }

    setChats((prev) => {
      const filtered = prev.filter((c) => c.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0]?.id || "support");
      }
      return filtered;
    });
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
                bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800
                overscroll-contain backdrop-blur-sm
                ${isMobile
                  ? "inset-0 w-full h-full"
                  : `inset-y-0 ${sidenavPosition === "right" ? "left-0 border-r" : "right-0 border-l"
                  } w-[720px]`
                }
              `}
              style={{
                maxHeight: "100vh",
                height: isMobile && vv.height ? `${vv.height}px` : (isMobile ? "100vh" : "100%"),
                paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : undefined,
                transform: isMobile && vv.offsetTop ? `translateY(${vv.offsetTop}px)` : undefined,
              }}
            >
              <div className="relative px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-red-50 via-red-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-500/5 to-red-500/5 dark:from-red-500/10 dark:via-red-500/10 dark:to-red-500/10" />
                <div className="relative flex items-center gap-3">
                  {isMobile ? (
                    mobileView === "chat" ? (
                      <IconButton
                        variant="text"
                        onClick={() => setMobileView("list")}
                        className="rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
                        title="Chats"
                      >
                        <ChevronLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </IconButton>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                        <SparklesIcon className="h-5 w-5 text-white" />
                      </div>
                    )
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div className="leading-tight">
                    <div className="flex items-center gap-2">
                      <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">
                        {isMobile
                          ? mobileView === "list"
                            ? "Chats"
                            : activeChat?.title || "SmartChat"
                          : "SmartChat"}
                      </Typography>
                      <Chip
                        value="AI"
                        size="sm"
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-2 py-0.5 h-5"
                      />
                    </div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
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
                  className="relative rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </IconButton>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                {!isMobile && (
                  <div className="h-full min-h-0 grid grid-cols-[260px_1fr]" style={{ maxHeight: "100%" }}>
                    <div
                      className="border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto custom-sidenav-scrollbar overscroll-contain bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                      style={{
                        WebkitOverflowScrolling: "touch",
                        overflowY: "auto",
                        overscrollBehavior: "contain",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">
                            Chats
                          </Typography>
                          <Chip
                            value={chats.length}
                            size="sm"
                            className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] px-2 py-0.5 h-5"
                          />
                        </div>
                        <IconButton
                          variant="text"
                          size="sm"
                          onClick={createNewChat}
                          className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                          title="Yeni chat"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </IconButton>
                      </div>

                      <div className="space-y-2">
                        {chats.map((c) => {
                          const active = c.id === activeChatId;
                          return (
                            <motion.div
                              key={c.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                relative w-full rounded-2xl border transition-all duration-200 group
                                ${active
                                  ? "bg-gradient-to-br from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-500/30"
                                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md"
                                }
                              `}
                            >
                              <button
                                onClick={() => selectChat(c.id)}
                                className="w-full text-left px-4 py-3.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`font-semibold text-sm truncate ${active ? "text-white" : "text-gray-900 dark:text-white"}`}>
                                    {c.title}
                                  </span>
                                  {active && (
                                    <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                                  )}
                                </div>
                                <div className={`text-xs mt-1.5 truncate ${active ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                  {c.subtitle}
                                </div>
                              </button>
                              {chats.length > 1 && (
                                <IconButton
                                  variant="text"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(c.id);
                                  }}
                                  className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg ${active
                                    ? "text-white/80 hover:bg-white/20"
                                    : "text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    }`}
                                  title="Chat-i sil"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </IconButton>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

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
                        style={{
                          WebkitOverflowScrolling: "touch",
                          overflowY: "auto",
                          overscrollBehavior: "contain",
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider">
                              Chats
                            </Typography>
                            <Chip
                              value={chats.length}
                              size="sm"
                              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] px-2 py-0.5 h-5"
                            />
                          </div>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={createNewChat}
                            className="rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Yeni chat"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </IconButton>
                        </div>

                        <div className="space-y-3">
                          {chats.map((c) => {
                            const active = c.id === activeChatId;
                            return (
                              <motion.div
                                key={c.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                  relative w-full rounded-2xl border transition-all duration-200 group
                                  ${active
                                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                                  }
                                `}
                              >
                                <button
                                  onClick={() => selectChat(c.id)}
                                  className="w-full text-left px-4 py-4"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`font-semibold text-sm truncate ${active ? "text-white" : "text-gray-900 dark:text-white"}`}>
                                      {c.title}
                                    </span>
                                    {active ? (
                                      <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                                    ) : (
                                      <Bars3Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    )}
                                  </div>
                                  <div className={`text-xs mt-1.5 truncate ${active ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                    {c.subtitle}
                                  </div>
                                </button>
                                {chats.length > 1 && (
                                  <IconButton
                                    variant="text"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteChat(c.id);
                                    }}
                                    className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg ${active
                                      ? "text-white/80 hover:bg-white/20"
                                      : "text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      }`}
                                    title="Chat-i sil"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </IconButton>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        <div className="mt-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                          <Typography variant="small" className="text-[11px] text-red-700 dark:text-red-300 text-center">
                            💡 Chat seç → mesajlaşma açılacaq
                          </Typography>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="h-full min-h-0"
                        style={{ maxHeight: "100%" }}
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
    <div className="h-full flex flex-col" style={{ minHeight: 0, maxHeight: "100%" }}>
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0, maxHeight: "100%" }}>
        <div
          ref={listRef}
          className={`h-full w-full overflow-y-auto custom-sidenav-scrollbar overscroll-contain ${compact ? "px-4 py-4" : "px-6 py-6"
            } space-y-3`}
          style={{
            WebkitOverflowScrolling: "touch",
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            minHeight: 0,
            maxHeight: "100%",
          }}
        >
          {messages.map((m, idx) => (
            <ChatBubble key={idx} role={m.role} text={m.content} attachments={m.attachments || []} />
          ))}

          {sending && (
            <div className="flex justify-start">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg border bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 flex items-center gap-3"
              >
                <Spinner className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-gray-700 dark:text-gray-300">Yazır...</span>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${compact ? "px-4" : "px-6"} pt-2`}
        >
          <div className="p-3 rounded-xl border border-red-300 dark:border-red-800 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-900/20 shadow-sm">
            <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs font-medium">
              ⚠️ {error}
            </Typography>
          </div>
        </motion.div>
      )}

      <div
        className={`
          ${compact ? "px-4" : "px-6"}
          py-4 sm:py-5
          border-t border-gray-200 dark:border-gray-800
          bg-gradient-to-t from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900
          backdrop-blur-sm
        `}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={onFileSelected}
        />

        <div className="flex items-end gap-3">
          <IconButton
            variant="text"
            onClick={onPickFile}
            className="rounded-xl hover:bg-red-50 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700"
            title="Fayl əlavə et"
            disabled={sending}
          >
            <PaperClipIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </IconButton>

          <div className="flex-1">
            <Input
              inputRef={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Mesaj yaz… (Enter = göndər)"
              className="dark:text-white !border-gray-300 dark:!border-gray-700 focus:!border-red-500 dark:focus:!border-red-500"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
              disabled={sending}
              autoFocus
            />
          </div>

          <Button
            onClick={onSend}
            disabled={sending || !text.trim()}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center gap-2 rounded-xl shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Göndər</span>
          </Button>
        </div>

        <Typography variant="small" className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 text-center">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">Shift+Enter</kbd>
            yeni sətir •
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">📎</kbd>
            fayl əlavə et
          </span>
        </Typography>
      </div>
    </div>
  );
}

function ChatBubble({ role, text, attachments = [] }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg border ${isUser
          ? "bg-gradient-to-br from-red-600 to-red-700 text-white border-red-500 shadow-red-500/30"
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-900/50"
          }`}
      >
        {attachments.length > 0 && (
          <div className="space-y-2 mb-2">
            {attachments.map((a, i) => {
              const isImage = a?.mime?.startsWith("image/") || a?.type === "image";
              if (isImage) {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl overflow-hidden border shadow-md"
                    style={{
                      borderColor: isUser ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={a.url}
                      alt={a.name || "image"}
                      className="w-full max-h-[260px] object-cover"
                      loading="lazy"
                    />
                    {a.name && (
                      <div className={`px-3 py-1.5 text-[11px] bg-black/20 backdrop-blur-sm ${isUser ? "text-white/90" : "text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80"
                        }`}>
                        {a.name}
                      </div>
                    )}
                  </motion.div>
                );
              }

              return (
                <motion.a
                  key={i}
                  href={a.url}
                  download={a.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`block rounded-xl px-4 py-3 border transition-all shadow-sm hover:shadow-md ${isUser
                    ? "border-white/30 bg-white/15 text-white hover:bg-white/20"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <PaperClipIcon className={`h-4 w-4 ${isUser ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{a.name || "Fayl"}</div>
                      <div className={`text-[11px] mt-0.5 ${isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                        {a.mime || "file"}
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {text ? (
          <div className={`whitespace-pre-wrap leading-relaxed ${isUser ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
            {text}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default AiChat;

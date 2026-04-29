// ═══════════════════════════════════════════════════════════════════════════
// REN — Portfolio Chatbot for Rhenmart Dela Cruz
// Self-contained, no external API. All answers are knowledge-base driven.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageSquare, Minimize2 } from "lucide-react";
import { useAnimationConfig } from "../context/AnimationContext";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: "ren" | "user";
  text: string;
  timestamp: Date;
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────

interface QA {
  patterns: RegExp[];
  answer: string;
}

const KNOWLEDGE_BASE: QA[] = [
  // ── Identity / Who is Rhenmart ──────────────────────────────────────────
  {
    patterns: [/who (is|are) (rhenmart|he|you)/i, /tell me about (rhenmart|him|yourself)/i, /introduce/i, /about rhenmart/i],
    answer:
      "Rhenmart Dela Cruz is a Junior UI/UX Designer and Product Designer based in the Philippines. He's a self-taught designer pursuing a Bachelor of Science in Information Technology (BSIT). With 5+ years of learning through competitions, workshops, and real projects — not just courses — he brings a research-first mindset to every design challenge.",
  },
  // ── Title / Role ────────────────────────────────────────────────────────
  {
    patterns: [/what (does|is) (he|rhenmart) do/i, /job|role|title|position|profession|career/i, /designer/i],
    answer:
      "Rhenmart is a UI/UX Designer and Product Designer. He specializes in UI Design, UX Research, Prototyping, and Design-to-Dev Collaboration. He's currently open to freelance and full-time opportunities.",
  },
  // ── Location ────────────────────────────────────────────────────────────
  {
    patterns: [/where (is|does|lives?|based|from)/i, /location|country|city|philippines/i],
    answer:
      "Rhenmart is based in the Philippines. He's open to remote work and collaborations worldwide.",
  },
  // ── Education ───────────────────────────────────────────────────────────
  {
    patterns: [/education|degree|school|university|college|study|bsit|bachelor/i],
    answer:
      "Rhenmart is pursuing a Bachelor of Science in Information Technology (BSIT). He's largely self-taught in design — most of his skills were built through competitions, workshops, and hands-on projects rather than formal design courses.",
  },
  // ── Experience ──────────────────────────────────────────────────────────
  {
    patterns: [/experience|years|how long|background/i],
    answer:
      "Rhenmart has 5+ years of design experience, gained through competitions, workshops, and real-world projects. He's completed 7+ projects and earned 5+ competition awards — all of which sharpened his ability to work fast under pressure and listen to users.",
  },
  // ── Contact / Email ─────────────────────────────────────────────────────
  {
    patterns: [/contact|email|reach|hire|message|get in touch/i],
    answer:
      "You can reach Rhenmart at Rhenmart978@gmail.com. You can also use the Contact section on this page to send him a message directly — he'll get back to you as soon as possible!",
  },
  // ── Social Links ────────────────────────────────────────────────────────
  {
    patterns: [/social|linkedin|github|instagram|facebook|links/i],
    answer:
      "Here are Rhenmart's social profiles:\n• LinkedIn: linkedin.com/in/rhenmart-delacruz-117858312\n• GitHub: github.com/Shibo326\n• Instagram: @_rhenmart_\n• Facebook: facebook.com/rhenmart1234",
  },
  // ── Services ────────────────────────────────────────────────────────────
  {
    patterns: [/service|offer|provide|what can (he|rhenmart) do/i],
    answer:
      "Rhenmart offers 4 core services:\n1. UI Design — Clean, intentional interfaces built with design systems\n2. UX Research — User interviews, usability testing, and competitive analysis\n3. Prototyping — Interactive prototypes in Figma and Framer\n4. Design-to-Dev Collaboration — Clear handoffs, component specs, and direct dev communication",
  },
  // ── Skills ──────────────────────────────────────────────────────────────
  {
    patterns: [/skill|proficien|good at|strength|expertise|speciali/i],
    answer:
      "Rhenmart's core skills:\n• UI Design — 85%\n• Prototyping — 82%\n• UX Research — 78%\n• AI-Assisted UX — 70%\n\nHe's strongest in creating clean interfaces and research-driven design flows.",
  },
  // ── Tools ───────────────────────────────────────────────────────────────
  {
    patterns: [/tool|software|app|figma|framer|wix|v0|use/i],
    answer:
      "Rhenmart's design toolkit:\n• Figma (PRIMARY) — main design & prototyping tool\n• Framer — interactive prototypes\n• WIX Studio — web design\n• V0 — AI-assisted UI generation\n\nFor AI research tools: ChatGPT, Gemini, Claude, and Loveable.",
  },
  // ── AI Tools ────────────────────────────────────────────────────────────
  {
    patterns: [/ai|chatgpt|gemini|claude|loveable|artificial intelligence/i],
    answer:
      "Rhenmart integrates AI into his UX workflow — but always as an enhancement, not the lead. He uses ChatGPT, Gemini, Claude, and Loveable to enhance research findings and validate design decisions. His philosophy: human research first, AI to amplify.",
  },
  // ── Portfolio / Work ────────────────────────────────────────────────────
  {
    patterns: [/portfolio|project|work|case study|competition|award|achievement/i],
    answer:
      "Rhenmart's portfolio highlights:\n• 🥇 Web Design Champion — 1st Place, UMAK IT Skills Olympics\n• 🥈 Collaboratech 2026 Android Hackathon — 2nd Place (ShopLift app)\n• 🥇 Tagisan ng Talino — 1st Place\n• 🥈 Tagisan ng Talino — 2nd Place\n• 💡 NDC's Breaking Enigma 2025 — SafePath (offline GPS SOS app)\n• 🎓 UXPH Community Seminar — Attendee\n• 🎓 Exploring The Basics of Figma — Teacher/Facilitator\n• 🎓 Beyond UI: Designing User Experiences — Teacher/Facilitator",
  },
  // ── Design Process ──────────────────────────────────────────────────────
  {
    patterns: [/process|workflow|how (does|do) (he|rhenmart|you) work|approach|methodology/i],
    answer:
      "Rhenmart follows a Research-Driven Design Process:\n1. Human Research — Interviews, papers, documents first\n2. AI Enhancement — AI amplifies findings, not leads them\n3. Stakeholder Sync — Align with devs & clients\n4. Figma Design — Prototype & hi-fi UI based on research\n5. Kiro Polish — Optimize & enhance before development\n6. Dev Handoff — Final polished design ready for development",
  },
  // ── Availability / Hire ─────────────────────────────────────────────────
  {
    patterns: [/available|availab|open to work|freelance|full.?time|hire|looking for/i],
    answer:
      "Yes! Rhenmart is currently open to work — both freelance projects and full-time positions. You can reach him at Rhenmart978@gmail.com or use the Contact section on this page.",
  },
  // ── Resume / CV ─────────────────────────────────────────────────────────
  {
    patterns: [/resume|cv|curriculum|download/i],
    answer:
      "You can download Rhenmart's resume directly from this portfolio! Just click the 'DL_RESUME.PDF' button in the About section or the 'DL_CV.PDF' button in the Hero section.",
  },
  // ── Competitions ────────────────────────────────────────────────────────
  {
    patterns: [/competition|award|win|champion|place|hackathon|olymp/i],
    answer:
      "Rhenmart has 5 competition wins:\n• 🥇 1st Place — UMAK IT Skills Olympics (Web Design)\n• 🥇 1st Place — Tagisan ng Talino\n• 🥈 2nd Place — Tagisan ng Talino\n• 🥈 2nd Place — Collaboratech 2026 Android Hackathon (ShopLift app)\n• 💡 NDC's Breaking Enigma 2025 — SafePath concept",
  },
  // ── Teaching / Workshop ─────────────────────────────────────────────────
  {
    patterns: [/teach|workshop|seminar|facilitat|mentor/i],
    answer:
      "Rhenmart has experience as a teacher and facilitator! He led two workshops:\n• 'Exploring The Basics of Figma' — taught Figma fundamentals\n• 'Beyond UI: Designing User Experiences' — taught UX principles\n\nHe also attended the UXPH Community Seminar as a UX learner.",
  },
  // ── Philosophy / Mindset ────────────────────────────────────────────────
  {
    patterns: [/philosophy|mindset|belief|value|principle|think|approach to design/i],
    answer:
      "Rhenmart's design philosophy is human-first. He starts with real user research — interviews, observation, papers — before touching any design tool. AI enhances his findings but never leads the process. He believes 5 competition wins taught him to work fast under pressure, and 8 projects taught him to truly listen to users.",
  },
  // ── Greetings ───────────────────────────────────────────────────────────
  {
    patterns: [/^(hi|hello|hey|sup|yo|good (morning|afternoon|evening)|howdy|hiya)/i],
    answer:
      "Hey there! I'm Ren, Rhenmart's personal assistant. I know everything about him — his skills, projects, experience, and how to get in touch. What would you like to know?",
  },
  // ── Thanks ──────────────────────────────────────────────────────────────
  {
    patterns: [/thank|thanks|appreciate|helpful|great|awesome|cool/i],
    answer:
      "Happy to help! If you have more questions about Rhenmart or want to get in touch with him, just ask. He's always open to new opportunities! 🚀",
  },
  // ── Goodbye ─────────────────────────────────────────────────────────────
  {
    patterns: [/bye|goodbye|see you|later|ciao|take care/i],
    answer:
      "Thanks for stopping by! If you ever want to know more about Rhenmart or collaborate with him, don't hesitate to reach out at Rhenmart978@gmail.com. Have a great day! 👋",
  },
];

const FALLBACK_RESPONSES = [
  "I'm specifically trained to answer questions about Rhenmart Dela Cruz. Try asking about his skills, projects, experience, or how to contact him!",
  "That's outside my knowledge base! I only know about Rhenmart — his work, skills, portfolio, and contact info. What would you like to know about him?",
  "I'm Ren, Rhenmart's personal assistant. I can tell you about his design skills, portfolio, experience, or how to hire him. What are you curious about?",
];

const SUGGESTED_QUESTIONS = [
  "Who is Rhenmart?",
  "What services does he offer?",
  "What tools does he use?",
  "How can I contact him?",
  "Show me his portfolio",
  "Is he available for hire?",
];

// ─── Engine ───────────────────────────────────────────────────────────────────

let fallbackIndex = 0;

function getAnswer(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "Please type a question about Rhenmart!";

  for (const qa of KNOWLEDGE_BASE) {
    if (qa.patterns.some((p) => p.test(trimmed))) {
      return qa.answer;
    }
  }

  // Rotate fallback responses
  const response = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return response;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-[#FF0000]/70"
        />
      ))}
    </div>
  );
});

// ─── Message bubble ───────────────────────────────────────────────────────────

const MessageBubble = memo(function MessageBubble({ msg }: { msg: Message }) {
  const isRen = msg.role === "ren";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2 ${isRen ? "justify-start" : "justify-end"}`}
    >
      {isRen && (
        <div className="flex-shrink-0 w-7 h-7 rounded bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center mt-0.5">
          <span className="text-[9px] font-mono font-black text-[#FF0000]">REN</span>
        </div>
      )}
      <div
        className={`max-w-[82%] px-3 py-2 rounded text-sm leading-relaxed whitespace-pre-line ${
          isRen
            ? "bg-[#0a0a0a] border border-[rgba(255,255,255,0.07)] text-white/85"
            : "bg-[#FF0000]/15 border border-[#FF0000]/30 text-white/90"
        }`}
      >
        {msg.text}
        <div className={`text-[9px] font-mono mt-1 ${isRen ? "text-white/20" : "text-[#FF0000]/40"}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
});

// ─── Main Chatbot Component ───────────────────────────────────────────────────

export const RenChatbot = memo(function RenChatbot() {
  const { isMobile, enableBackdropBlur } = useAnimationConfig();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ren",
      text: "Hey! I'm Ren 👋 — Rhenmart's personal assistant. Ask me anything about him: his skills, projects, experience, or how to get in touch!",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  let msgId = useRef(1);

  // Auto-scroll to bottom
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, open, minimized]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open, minimized]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Add user message
      const userMsg: Message = {
        id: msgId.current++,
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate Ren thinking
      const delay = 600 + Math.random() * 500;
      setTimeout(() => {
        const answer = getAnswer(trimmed);
        const renMsg: Message = {
          id: msgId.current++,
          role: "ren",
          text: answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, renMsg]);
        setIsTyping(false);
        if (!open || minimized) {
          setUnread((n) => n + 1);
        }
      }, delay);
    },
    [open, minimized]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const chatWindow = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="ren-chat"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={minimized ? { opacity: 1, scale: 1, y: 0, height: "auto" } : { opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed z-[200] ${
            isMobile
              ? "inset-x-3 bottom-[5.5rem]"
              : "bottom-[5.5rem] right-6 w-[360px]"
          }`}
          style={{ maxHeight: isMobile ? "calc(100vh - 8rem)" : "560px" }}
        >
          <div
            className="flex flex-col rounded border border-[rgba(255,0,0,0.2)] overflow-hidden"
            style={{
              background: "#050505",
              boxShadow: "0 0 40px rgba(255,0,0,0.12), 0 20px 60px rgba(0,0,0,0.8)",
              ...(enableBackdropBlur ? { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" } : {}),
              height: minimized ? "auto" : isMobile ? "calc(100vh - 8rem)" : "520px",
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-[#080808] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded bg-[#FF0000]/10 border border-[#FF0000]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono font-black text-[#FF0000]">REN</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#4ade80] border border-[#050505]"
                  />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white/90 leading-none">REN_BOT</div>
                  <div className="text-[9px] font-mono text-[#4ade80] mt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#4ade80] inline-block" />
                    ONLINE // RHENMART_ASSISTANT
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMinimize}
                  className="p-1.5 text-white/30 hover:text-white/70 transition-colors rounded hover:bg-white/5"
                  aria-label="Minimize chat"
                >
                  <Minimize2 size={13} />
                </button>
                <button
                  onClick={handleClose}
                  className="p-1.5 text-white/30 hover:text-[#FF0000] transition-colors rounded hover:bg-[#FF0000]/10"
                  aria-label="Close chat"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── Body (hidden when minimized) ── */}
            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0 scrollbar-thin">
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-7 h-7 rounded bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-[9px] font-mono font-black text-[#FF0000]">REN</span>
                        </div>
                        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.07)] rounded">
                          <TypingIndicator />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggested questions */}
                  {messages.length <= 1 && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-[10px] font-mono px-2 py-1 rounded border border-[rgba(255,0,0,0.2)] text-[#FF0000]/70 hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/5 transition-all duration-150"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 px-3 py-2.5 border-t border-[rgba(255,255,255,0.06)] bg-[#080808] flex-shrink-0"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about Rhenmart..."
                      maxLength={200}
                      className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 outline-none font-sans"
                      aria-label="Message Ren"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="p-2 rounded bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Send message"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const triggerButton = (
    <motion.button
      onClick={open ? handleClose : handleOpen}
      whileHover={{ scale: 1.08, boxShadow: "0 0 28px rgba(255,0,0,0.5)" }}
      whileTap={{ scale: 0.93 }}
      className={`fixed z-[200] ${
        isMobile ? "bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6" : "bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-24"
      } w-12 h-12 rounded-full bg-[#FF0000]/15 border border-[#FF0000]/40 text-white flex items-center justify-center hover:bg-[#FF0000] transition-colors duration-200 group`}
      aria-label={open ? "Close Ren chatbot" : "Open Ren chatbot"}
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <X size={20} />
          </motion.span>
        ) : (
          <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <MessageSquare size={20} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Unread badge */}
      <AnimatePresence>
        {unread > 0 && !open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF0000] text-white text-[9px] font-mono font-bold flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-mono text-white/60 bg-[#080808] border border-[rgba(255,255,255,0.08)] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        ASK_REN
      </span>
    </motion.button>
  );

  return createPortal(
    <>
      {chatWindow}
      {triggerButton}
    </>,
    document.body
  );
});

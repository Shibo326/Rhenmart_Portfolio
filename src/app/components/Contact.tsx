import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AtSign, Globe, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { SectionBadge, HudCorners } from "./Hud";
import { useMagneticRef } from "../hooks/useDeviceAnimations";
import { Toast } from "./Toast";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

const inputCls =
  "hud-input w-full bg-[#030303] border text-white font-mono text-sm px-4 py-3 outline-none placeholder:text-[rgba(255,255,255,0.30)]";

function getInputBorderCls(name: string, focused: string | null, filledFields: Set<string>) {
  if (focused === name) return "border-[#FF0000]";
  if (filledFields.has(name)) return "border-[rgba(255,0,0,0.40)]";
  return "border-[rgba(255,255,255,0.08)]";
}

export function Contact() {
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const formRef = useRef<HTMLFormElement>(null);
  const sendRef = useMagneticRef<HTMLButtonElement>(0.2);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setToastVariant("success");
      setShowToast(true);
      formRef.current.reset();
      setFilledFields(new Set());
    } catch {
      setToastVariant("error");
      setShowToast(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-[#050505] overflow-hidden">
      <AnimatePresence>
        {showToast && (
          <Toast
            message={
              toastVariant === "success"
                ? "MSG_DELIVERED // I'll get back to you soon."
                : "TRANSMISSION_FAILED // Try again."
            }
            variant={toastVariant}
            onDismiss={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-grid opacity-20" />
      <div
        className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-orb"
        style={{ background: "rgba(255,0,0,0.10)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <SectionBadge name="CONTACT.EXE" comment="GET_IN_TOUCH" />
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient-white">
            Let's Work Together
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.30)] p-6 md:p-8 transition-colors group"
          >
            <HudCorners />
            <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* HUD header */}
            <div className="font-mono text-[10px] text-[rgba(255,255,255,0.30)] tracking-widest mb-6 pb-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#FF0000]">
                <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse-red" />
                MSG_COMPOSE.exe
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                SECURE
              </span>
            </div>

            <form ref={formRef} onSubmit={submit} className="space-y-4">
              {[
                { name: "from_name",  label: "NAME",             type: "text",  required: true },
                { name: "from_email", label: "EMAIL",            type: "email", required: true },
                { name: "subject",    label: "SUBJECT (OPTIONAL)", type: "text", required: false },
              ].map((f) => (
                <div key={f.name} className="relative">
                  <label
                    className={`block font-mono text-[10px] tracking-widest mb-1.5 transition-colors ${
                      focused === f.name ? "text-[#FF0000]" : "text-[rgba(255,255,255,0.55)]"
                    }`}
                  >
                    // {f.label}{" "}
                    {focused === f.name && <span className="animate-blink">_</span>}
                  </label>
                  <input
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    className={`${inputCls} ${getInputBorderCls(f.name, focused, filledFields)}`}
                    onFocus={() => setFocused(f.name)}
                    onBlur={(e) => {
                      setFocused(null);
                      if (e.target.value.trim()) {
                        setFilledFields((prev) => new Set(prev).add(f.name));
                      } else {
                        setFilledFields((prev) => { const s = new Set(prev); s.delete(f.name); return s; });
                      }
                    }}
                    placeholder={`> Enter ${f.name.replace("from_", "")}...`}
                  />
                </div>
              ))}

              <div className="relative">
                <label
                  className={`block font-mono text-[10px] tracking-widest mb-1.5 transition-colors ${
                    focused === "message" ? "text-[#FF0000]" : "text-[rgba(255,255,255,0.55)]"
                  }`}
                >
                  // MESSAGE{" "}
                  {focused === "message" && <span className="animate-blink">_</span>}
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className={`${inputCls} ${getInputBorderCls("message", focused, filledFields)}`}
                  onFocus={() => setFocused("message")}
                  onBlur={(e) => {
                    setFocused(null);
                    if (e.target.value.trim()) {
                      setFilledFields((prev) => new Set(prev).add("message"));
                    } else {
                      setFilledFields((prev) => { const s = new Set(prev); s.delete("message"); return s; });
                    }
                  }}
                  placeholder="> Type your message..."
                />
              </div>

              <button
                ref={sendRef}
                type="submit"
                disabled={sending}
                className="group/btn relative w-full bg-[#FF0000] hover:bg-[#FF4444] disabled:opacity-50 text-white font-mono text-xs tracking-widest py-3.5 flex items-center justify-center gap-2 transition-colors red-glow-strong overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-[#CC0000] via-[#FF4444] to-[#CC0000]" />
                <span className="relative w-1.5 h-1.5 bg-white rounded-full animate-blink" />
                <span className="relative">{sending ? "TRANSMITTING..." : "SEND_MSG"}</span>
                <Send size={14} className="relative group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { Icon: AtSign, label: "EMAIL",    value: "Rhenmart978@gmail.com", href: "mailto:Rhenmart978@gmail.com", tag: "DIRECT_LINE" },
              { Icon: Globe,  label: "LOCATION", value: "Philippines",           href: undefined,                      tag: "PH_SECTOR_01" },
            ].map((c) => (
              <motion.a
                key={c.label}
                href={c.href}
                whileHover={{ x: 4 }}
                className="group relative block bg-[#030303] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,0,0,0.60)] p-5 transition-all overflow-hidden"
              >
                <HudCorners />
                {/* Top red accent line on hover */}
                <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Scan sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

                <div className="flex items-center gap-4 relative">
                  {/* Icon — minimal border style, no red fill */}
                  <div className="relative w-11 h-11 flex items-center justify-center border border-[rgba(255,0,0,0.40)] group-hover:border-[#FF0000] transition-colors">
                    <c.Icon size={18} className="text-[#FF0000] group-hover:scale-110 transition-transform" />
                    {/* Corner accents */}
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF0000]" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF0000]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[9px] text-[rgba(255,255,255,0.30)] tracking-widest">// {c.label}</span>
                      <span className="font-mono text-[8px] text-[#FF0000] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{c.tag}</span>
                    </div>
                    <div className="font-mono text-sm text-white group-hover:text-[#FF0000] transition-colors truncate">{c.value}</div>
                  </div>

                  {/* Arrow indicator */}
                  <span className="font-mono text-[#FF0000] text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </motion.a>
            ))}

            {/* Availability */}
            <div className="relative bg-[#030303] border border-green-500/30 p-6 overflow-hidden">
              <HudCorners color="#22c55e" />
              <div className="flex items-center gap-3 relative">
                <span className="relative w-3 h-3 bg-green-400 rounded-full">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ripple" />
                </span>
                <div>
                  <div className="font-mono text-[10px] text-green-400 tracking-widest">// AVAILABILITY</div>
                  <div className="font-mono text-sm text-white">Available for freelance</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

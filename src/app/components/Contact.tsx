import { motion, AnimatePresence } from "motion/react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useAnimationConfig } from "../context/AnimationContext";
import { MagneticButton } from "./MagneticButton";
import { Toast } from "./Toast";

// ─── EmailJS Configuration ─────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_6r1ytvj";
const EMAILJS_TEMPLATE_ID = "template_pwo3l8a";
const EMAILJS_PUBLIC_KEY = "3WXrUwoLmtApet7xn";
// ───────────────────────────────────────────────────────────────────────────

const contactInfo = [
  { icon: Mail, label: "Email", value: "Rhenmart978@gmail.com", href: "mailto:Rhenmart978@gmail.com" },
  { icon: Phone, label: "Phone", value: "0967 221 2791", href: "tel:+639672212791" },
  { icon: MapPin, label: "Location", value: "Philippines", href: "#" },
];

export function Contact() {
  const { isMobile, isSafari } = useAnimationConfig();
  const reduceEffects = isMobile || isSafari;
  const [focused, setFocused] = useState<string | null>(null);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const [shakeError, setShakeError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleBlur = (id: string, value: string) => {
    setFocused(null);
    setFilledFields(prev => {
      const next = new Set(prev);
      if (value.trim()) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const getBorderColor = (id: string) => {
    if (focused === id) return '#FF0000';
    if (filledFields.has(id)) return 'rgba(255,0,0,0.4)';
    return 'rgba(255,255,255,0.1)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const message = messageRef.current?.value.trim() || "";

    // Inline validation
    const errors: Record<string, string> = {};
    if (!name) errors.name = "NAME_REQUIRED";
    if (!email) errors.email = "EMAIL_REQUIRED";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "INVALID_EMAIL_FORMAT";
    if (!message) errors.message = "MESSAGE_REQUIRED";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    setFieldErrors({});
    setSending(true);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setToastVariant('success');
      setShowToast(true);
      formRef.current?.reset();
      setFilledFields(new Set());
    } catch {
      setToastVariant('error');
      setShowToast(true);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="pt-20 pb-24 bg-[#050505] relative overflow-hidden">
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={
              toastVariant === 'success'
                ? "Message sent! I'll get back to you soon."
                : "Failed to send. Please try again."
            }
            variant={toastVariant}
            onDismiss={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      {/* Bg orb — desktop non-Safari only */}
      {!reduceEffects && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 200px 100px rgba(255,0,0,0.05)", background: "transparent" }}
        />
      )}

      {/* Floating dots — desktop non-Safari only */}
      {!reduceEffects && [0, 1, 2, 3, 4].map((i) => (
        <motion.div key={i}
          aria-hidden="true"
          animate={{ y: [0, -18, 0], opacity: [0, 0.35, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
          className="absolute w-1 h-1 bg-[#FF0000] rounded-full pointer-events-none"
          style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 25}%` }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-[#FF0000]/20 rounded font-mono mb-2"
          >
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#FF0000] rounded-full" />
            <span className="text-[#FF0000] text-[10px] font-bold uppercase tracking-[0.2em]">CONTACT.EXE</span>
            <span className="text-white/20 text-[10px] font-mono">// GET_IN_TOUCH</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Contact Me
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-xl mx-auto text-sm sm:text-base"
          >
            Let's build something impactful together.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ originX: 0.5 }}
            className="w-16 h-1 bg-[#FF0000] mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* Contact Info Cards */}
          <div className="flex flex-col gap-4">
            {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 6, scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#FF0000]/40 hover:bg-white/8 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-3 bg-[#FF0000]/10 rounded-xl group-hover:bg-[#FF0000]/20 transition-colors"
                >
                  <Icon size={18} className="text-[#FF0000]" />
                </motion.div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              </motion.a>
            ))}

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ delay: 0.15 }}
              className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl mt-2"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-green-400 rounded-full"
                />
                <div>
                  <p className="text-green-400 text-sm font-semibold">Available for work</p>
                  <p className="text-white/40 text-xs">Open to freelance & full-time</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10px" }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-black/40 border border-white/[0.08] rounded p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0000]/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0000]/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF0000]/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF0000]/40" />
            {/* HUD label */}
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
              <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
              <span className="text-[#FF0000] text-[9px] font-mono font-bold uppercase tracking-[0.2em]">MSG_COMPOSE.exe</span>
              <span className="ml-auto text-white/15 text-[9px] font-mono">ENCRYPTED_CHANNEL</span>
            </div>

            <form
              ref={formRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              onSubmit={handleSubmit}
            >
              {[
                { id: "name", label: "Your Name", type: "text", placeholder: "John Doe", col: 1, ref: nameRef, name: "from_name", autoComplete: "name", required: true },
                { id: "email", label: "Your Email", type: "email", placeholder: "john@example.com", col: 1, ref: emailRef, name: "from_email", autoComplete: "email", required: true },
                { id: "subject", label: "Subject (optional)", type: "text", placeholder: "Project Inquiry", col: 2, ref: subjectRef, name: "subject", autoComplete: "off", required: false },
              ].map(({ id, label, type, placeholder, col, ref, name, autoComplete, required }) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  className={`space-y-2 ${col === 2 ? "sm:col-span-2" : ""}`}
                >
                  <label htmlFor={id} className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    {label}
                  </label>
                  <motion.input
                    ref={ref as React.RefObject<HTMLInputElement>}
                    type={type}
                    id={id}
                    name={name}
                    autoComplete={autoComplete}
                    onFocus={() => { setFocused(id); setFieldErrors(prev => ({ ...prev, [id]: "" })); }}
                    onBlur={(e) => handleBlur(id, e.target.value)}
                    animate={{ borderColor: fieldErrors[id] ? '#FF0000' : getBorderColor(id) }}
                    className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FF0000] transition-all"
                    style={{ fontSize: '16px' }}
                    placeholder={placeholder}
                    required={required}
                  />
                  {fieldErrors[id] && (
                    <p className="text-[#FF0000] text-[10px] font-mono uppercase tracking-wider mt-1">
                      ▸ {fieldErrors[id]}
                    </p>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                className="space-y-2 sm:col-span-2"
              >
                <label htmlFor="message" className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Your Message
                </label>
                <motion.textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  rows={4}
                  required
                  autoComplete="off"
                  onFocus={() => { setFocused("message"); setFieldErrors(prev => ({ ...prev, message: "" })); }}
                  onBlur={(e) => handleBlur("message", e.target.value)}
                  animate={{ borderColor: fieldErrors.message ? '#FF0000' : getBorderColor("message") }}
                  className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#FF0000] transition-all resize-none"
                  style={{ fontSize: '16px' }}
                  placeholder="Tell me about your project..."
                />
                {fieldErrors.message && (
                  <p className="text-[#FF0000] text-[10px] font-mono uppercase tracking-wider mt-1">
                    ▸ {fieldErrors.message}
                  </p>
                )}
              </motion.div>

              <div className="sm:col-span-2 flex justify-end">
                <MagneticButton>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(255,0,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    animate={shakeError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={shakeError ? { duration: 0.4 } : { duration: 0.2 }}
                    disabled={sending}
                    className="group flex items-center gap-2 px-8 py-3 bg-[#FF0000]/10 border border-[#FF0000]/40 text-[#FF0000] font-mono font-bold rounded text-xs uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-200 disabled:opacity-70 w-full sm:w-auto justify-center"
                  >
                    {sending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full"
                        />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-current" />
                        SEND_MSG
                        <Send size={13} />
                      </>
                    )}
                  </motion.button>
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


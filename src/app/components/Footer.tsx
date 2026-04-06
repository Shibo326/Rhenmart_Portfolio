import { Linkedin, Mail, Phone, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-6">

        {/* Brand */}
        <div className="text-3xl font-bold tracking-tighter">
          <span className="text-[#FF0000]">RHEN.</span>
        </div>

        {/* Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 text-white/50 text-xs sm:text-sm font-medium uppercase tracking-wider">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3">
          <a href="https://www.linkedin.com/in/rhenmart-delacruz-117858312/" target="_blank" rel="noopener noreferrer"
            className="p-3 bg-white/5 rounded-full hover:bg-[#0077B5] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]">
            <Linkedin size={18} />
          </a>
          <a href="https://www.instagram.com/_rhenmart_/" target="_blank" rel="noopener noreferrer"
            className="p-3 bg-white/5 rounded-full hover:bg-[#E1306C] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(225,48,108,0.5)]">
            <Instagram size={18} />
          </a>
          <a href="https://www.facebook.com/rhenmart1234" target="_blank" rel="noopener noreferrer"
            className="p-3 bg-white/5 rounded-full hover:bg-[#1877F2] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.5)]">
            <Facebook size={18} />
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
          <a
            href="mailto:Rhenmart@gmail.com"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group"
          >
            <span className="p-2 bg-white/5 rounded-full group-hover:bg-[#FF0000]/20 transition-colors">
              <Mail size={14} className="text-[#FF0000]" />
            </span>
            Rhenmart@gmail.com
          </a>

          <div className="hidden sm:block w-px h-5 bg-white/10" />

          <a
            href="tel:+639672212791"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group"
          >
            <span className="p-2 bg-white/5 rounded-full group-hover:bg-[#FF0000]/20 transition-colors">
              <Phone size={14} className="text-[#FF0000]" />
            </span>
            0967 221 2791
          </a>
        </div>

        {/* Copyright */}
        <div className="text-white/20 text-xs text-center">
          &copy; {currentYear} Rhenmart Dela Cruz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

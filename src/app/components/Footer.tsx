import { Linkedin, Mail, Phone, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-8">
        
        {/* Brand */}
        <div className="text-3xl font-bold tracking-tighter">
          <span className="text-[#FF0000]">RHEN.</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/50 text-sm font-medium uppercase tracking-wider">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Social & Contact info */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-4">
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/in/rhenmart-delacruz-117858312/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-[#0077B5] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]">
              <Linkedin size={20} />
            </a>
            <a href="https://www.instagram.com/_rhenmart_/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-[#E1306C] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(225,48,108,0.5)]">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/rhenmart1234" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-[#1877F2] text-white/70 hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.5)]">
              <Facebook size={20} />
            </a>
          </div>

          <div className="hidden md:block w-px h-8 bg-white/10"></div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white/50 text-sm">
             <a href="mailto:hello@rhenmart.com" className="flex items-center gap-2 hover:text-white transition-colors">
               <Mail size={16} className="text-[#FF0000]" />
               hello@rhenmart.com
             </a>
             <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-white transition-colors">
               <Phone size={16} className="text-[#FF0000]" />
               +1 234 567 890
             </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-white/30 text-xs flex items-center gap-1">
          &copy; {currentYear} Rhenmart Dela Cruz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

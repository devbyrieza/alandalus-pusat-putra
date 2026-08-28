"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { IS_PUTRA, BRANDING } from "@/config/branding";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const WA_MSG = `Assalamu'alaikum, saya ingin bertanya tentang SPMB ${BRANDING.schoolName} Tahun Ajaran 2027/2028.`;

export default function MobileBottomCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hardcoded hex to avoid Tailwind v4 dynamic class issues
  const primaryBg   = IS_PUTRA ? "#059669" : "#9d174d";
  const waHref = `https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(WA_MSG)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          style={{
            background: "linear-gradient(to top, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.88) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingBottom: "env(safe-area-inset-bottom, 4px)" }}
        >
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            {/* Primary CTA */}
            <Link
              href="/ppdb"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: primaryBg }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              Daftar SPMB Sekarang
            </Link>
            {/* WA CTA */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl text-white text-sm font-black shadow-lg active:scale-95 transition-transform shrink-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <FaWhatsapp className="w-4.5 h-4.5" />
              <span>WA</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


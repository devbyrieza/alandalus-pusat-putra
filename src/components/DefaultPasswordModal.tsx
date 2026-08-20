"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, KeyRound, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DefaultPasswordModalProps {
  profileUrl?: string;
}

export function DefaultPasswordModal({ profileUrl = "/dashboard/admin/profil" }: DefaultPasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if session has default password flag
    try {
      const isDismissed = sessionStorage.getItem("dismissed_pwd_warning");
      if (isDismissed) return;

      const cookies = document.cookie.split("; ");
      const sessionCookie = cookies.find((row) => row.startsWith("app_session="));
      if (sessionCookie) {
        const value = decodeURIComponent(sessionCookie.split("=")[1]);
        const parsed = JSON.parse(value);
        if (parsed.is_default_password) {
          setIsOpen(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("dismissed_pwd_warning", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-200/80 overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mb-5 text-amber-600 shadow-inner">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Peringatan Keamanan Akun
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
              Saat ini Anda masih menggunakan <span className="font-bold text-amber-700">Kata Sandi Default (2026#@)</span>. Demi keamanan akun dan data institusi, disarankan untuk segera memperbarui kata sandi Anda.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={profileUrl}
                onClick={handleDismiss}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 border border-amber-400 flex items-center justify-center gap-2 transition-all group"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ganti Kata Sandi Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleDismiss}
                className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all"
              >
                Ingatkan Nanti
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

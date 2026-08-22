"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface DefaultPasswordModalProps {
  profileUrl?: string;
}

export function DefaultPasswordModal({ profileUrl = "/dashboard/admin/profil" }: DefaultPasswordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if session has default password flag
    try {
      const cookies = document.cookie.split("; ");
      const sessionCookie = cookies.find((row) => row.startsWith("app_session="));
      if (sessionCookie) {
        const value = decodeURIComponent(sessionCookie.split("=")[1]);
        const parsed = JSON.parse(value);
        
        const isExemptRole = ['pendaftar', 'santri', 'wali_santri'].includes(parsed.role);
        const isProfilePage = pathname === profileUrl;

        if (parsed.is_default_password && !isExemptRole && !isProfilePage) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [pathname, profileUrl]);

  if (pathname === profileUrl && isOpen) {
    return (
      <div className="bg-red-500 text-white px-4 py-3 text-center text-sm font-bold shadow-md z-[9999] relative">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <span>PEMBARUAN KATA SANDI DIWAJIBKAN: Silakan ganti kata sandi default Anda melalui form di halaman ini demi keamanan akun.</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-200/80 overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Icon Header */}
            <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mb-5 text-amber-600 shadow-inner">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Tindakan Diperlukan
            </h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
              Sistem mendeteksi Anda menggunakan kata sandi default atau perlu mengganti kata sandi. Demi keamanan akun, <span className="font-bold text-amber-700">Anda WAJIB mengganti kata sandi</span> sebelum melanjutkan.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={profileUrl}
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 border border-amber-400 flex items-center justify-center gap-2 transition-all group"
              >
                <KeyRound className="w-4 h-4" />
                <span>Ganti Kata Sandi Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";
import { useEffect } from "react";

export default function TentangRedirect() {
  useEffect(() => {
    window.location.replace("https://pesantren-alandalus.com");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-300 font-medium">Mengarahkan ke Profil Pesantren Al-Andalus...</p>
      </div>
    </div>
  );
}

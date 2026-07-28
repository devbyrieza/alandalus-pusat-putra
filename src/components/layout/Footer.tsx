import { BRANDING } from "@/config/branding";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-sm text-center border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-semibold text-slate-300 mb-2">{BRANDING.schoolName}</p>
        <p className="mb-4 text-slate-500 max-w-xl mx-auto">{BRANDING.schoolTagline}</p>
        <p>© {new Date().getFullYear()} {BRANDING.schoolShortName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

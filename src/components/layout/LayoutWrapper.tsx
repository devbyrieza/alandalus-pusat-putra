"use client";

import { usePathname } from "next/navigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TawkToScript from "@/components/ui/widgets/TawkToScript";
import ScrollToTop from "@/components/ui/widgets/ScrollToTop";
import PageTransition from "@/components/ui/PageTransition";
import UrgencyBar from "@/components/ui/UrgencyBar";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import LiveActivityToast from "@/components/ui/LiveActivityToast";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import MobileBottomCTA from "@/components/ui/MobileBottomCTA";

export default function LayoutWrapper({
  children }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useScrollRestoration();

  const hideNavbarFooter =
    pathname.startsWith("/login") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/daftar");

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* ✅ SCROLL PROGRESS BAR — fixed at very top */}
      {!hideNavbarFooter && <ScrollProgressBar height={3} />}

      {/* ✅ NAVBAR */}
      {!hideNavbarFooter && <Navbar />}

      {/* ✅ MAIN CONTENT */}
      <main className={hideNavbarFooter ? "flex-1" : "flex-1 pt-[108px] sm:pt-[114px]"}>
        {!hideNavbarFooter && <UrgencyBar />}
        {hideNavbarFooter ? (
          children
        ) : (
          <PageTransition>{children}</PageTransition>
        )}
      </main>

      {/* ✅ FOOTER */}
      {!hideNavbarFooter && <Footer />}

      {/* ✅ FLOATING WIDGETS */}
      {!hideNavbarFooter && (
        <>
          {/* <TawkToScript /> */}
          <ScrollToTop />
          <FloatingWhatsApp />
          <LiveActivityToast />
          <MobileBottomCTA />
        </>
      )}
    </div>
  );
}

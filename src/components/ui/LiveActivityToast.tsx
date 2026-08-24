"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

// Fallback data (shown while API loads or if DB is empty)
const FALLBACK_ACTIVITIES = [
  { name: "Ahmad F.", city: "Jakarta", program: "SMP IT" },
  { name: "Fathur R.", city: "Bekasi", program: "Idad Lughawiy" },
  { name: "Zaid A.", city: "Bogor", program: "SMA IT" }
];

interface Activity {
  name: string;
  city: string;
  program: string;
}

export default function LiveActivityToast() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(FALLBACK_ACTIVITIES);

  // Fetch real registrant data from API
  useEffect(() => {
    fetch("/api/public/recent-registrants", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.registrants && data.registrants.length > 0) {
          setActivities(data.registrants);
        }
      })
      .catch(() => {
        // Silently fall back to static data
      });
  }, []);

  const showNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activities.length);
    setVisible(true);
    setTimeout(() => setVisible(false), 4500);
  }, [activities.length]);

  useEffect(() => {
    // First toast setelah 25s — staggered setelah WA tooltip selesai (18s+5s=23s)
    const initial = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
    }, 25000);

    // Repeat every 25s
    const interval = setInterval(showNext, 25000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [showNext]);

  const activity = activities[current % activities.length];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${current}-${activity.name}`}
          initial={{ opacity: 0, x: -60, y: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-16 sm:bottom-6 left-3 sm:left-6 z-40 bg-white/85 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 px-4 py-3 flex items-center gap-3.5 max-w-[min(280px,calc(100vw-4.5rem))]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-inner border border-green-200/50 flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 text-green-600" />
          </div>
          <div>
            <p className="text-[13px] font-black text-ink-950 leading-tight">
              {activity.name} dari {activity.city}
            </p>
            <p className="text-xs text-ink-500 font-medium leading-tight mt-0.5">
              baru mendaftar Program {activity.program}
            </p>
          </div>
          {/* Live dot */}
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-inner border border-green-200/500 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

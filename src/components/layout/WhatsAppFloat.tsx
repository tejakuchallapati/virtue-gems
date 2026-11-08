"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { whatsAppContactUrl } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  if (pathname.startsWith("/admin") || pathname === "/") return null;

  return (
    <motion.a
      href={whatsAppContactUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: 0.6, type: "spring", stiffness: 260, damping: 18 }
      }
      whileHover={reduceMotion ? undefined : { scale: 1.06 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className="fixed bottom-6 right-4 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 md:flex"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}

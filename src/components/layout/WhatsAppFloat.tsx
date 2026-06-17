"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { whatsAppContactUrl } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname === "/") return null;

  return (
    <motion.a
      href={whatsAppContactUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-4 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 md:flex"
    >
      <MessageCircle className="h-7 w-7" />
    </motion.a>
  );
}

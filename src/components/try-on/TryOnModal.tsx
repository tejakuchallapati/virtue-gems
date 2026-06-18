"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VirtualTryOn } from "./VirtualTryOn";
import type { Product } from "@/types";

export function TryOnModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-dark/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="safe-bottom max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-light p-4 sm:rounded-3xl sm:p-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-dark/50">Virtue Gems Try-On</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-dark/60 transition hover:bg-white hover:text-dark"
                aria-label="Close try-on"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <VirtualTryOn product={product} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavBrandProps = {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
  /**
   * light = white + gold (legacy)
   * dark = black + gold (light bars)
   * gold = gold wording for purple / hero bars
   */
  tone?: "light" | "dark" | "gold";
};

export function NavBrand({
  className,
  logoClassName = "h-8 w-[5.25rem]",
  textClassName,
  showText = true,
  tone = "light",
}: NavBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex shrink-0 items-center gap-2.5 transition duration-300 hover:opacity-95 active:scale-[0.98]",
        className,
      )}
    >
      <span className={cn("relative shrink-0", logoClassName)}>
        <Image
          src="/logo-vg.png"
          alt="Virtue Gems"
          width={120}
          height={48}
          quality={95}
          className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)] transition duration-300 group-hover:scale-[1.03]"
          priority
        />
      </span>
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span
            className={cn(
              "text-[11px] font-bold tracking-[0.14em] transition group-hover:tracking-[0.18em] md:text-[13px] lg:tracking-[0.2em]",
              tone === "dark" && "text-[#1a1424]",
              tone === "light" && "text-white",
              tone === "gold" && "text-[#d4af37]",
            )}
          >
            VIRTUE
          </span>
          <span
            className={cn(
              "mt-1 text-[8px] font-semibold tracking-[0.28em] md:text-[10px] lg:tracking-[0.34em]",
              tone === "dark" && "text-[#b8860b]",
              tone === "light" && "text-[#d4af37]",
              tone === "gold" && "text-[#d4af37]",
            )}
          >
            GEMS
          </span>
        </div>
      )}
    </Link>
  );
}

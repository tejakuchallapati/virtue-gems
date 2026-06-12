import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavBrandProps = {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export function NavBrand({
  className,
  logoClassName = "h-8 w-8",
  textClassName,
  showText = true,
}: NavBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex shrink-0 items-center gap-2.5 transition duration-300 hover:opacity-95 active:scale-[0.98]",
        className,
      )}
    >
      <Image
        src="/logo-transparent.png"
        alt="Virtue Gems"
        width={64}
        height={64}
        className={cn("object-contain transition duration-300 group-hover:scale-105", logoClassName)}
        priority
      />
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className="text-[11px] font-bold tracking-[0.28em] text-gold transition group-hover:tracking-[0.32em] md:text-xs">
            VIRTUE
          </span>
          <span className="mt-0.5 text-[8px] font-light tracking-[0.52em] text-light/75 md:text-[9px]">
            GEMS
          </span>
        </div>
      )}
    </Link>
  );
}

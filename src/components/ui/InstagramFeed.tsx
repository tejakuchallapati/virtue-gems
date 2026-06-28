import Image from "next/image";
import instagramData from "@/data/instagram.json";

const PROFILE_URL = instagramData.profileUrl;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function InstagramFeed() {
  return (
    <section>
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-2 block text-center transition hover:opacity-90"
        aria-label={`Follow Virtue Gems on Instagram @${instagramData.handle}`}
      >
        <p className="text-sm tracking-[0.2em] text-gold uppercase transition group-hover:text-gold-dark">
          Follow Us
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <InstagramIcon className="h-5 w-5 text-gold transition group-hover:scale-110" />
          <h2 className="text-xl font-semibold text-dark transition group-hover:text-gold-dark sm:text-2xl">
            @{instagramData.handle}
          </h2>
        </div>
        <p className="mx-auto mt-2 max-w-md text-sm text-dark/60">
          See our latest designs, styling tips, and behind-the-scenes moments.
        </p>
      </a>

      <div className="mt-6 grid grid-cols-3 gap-1 sm:grid-cols-6 sm:gap-2">
        {instagramData.posts.map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-[#1a0a2e] ring-1 ring-inset ring-white/10 sm:rounded-xl"
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              sizes="(max-width: 640px) 33vw, 16vw"
              className="object-contain p-0.5 transition duration-300 group-hover:scale-[1.03] sm:p-1"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-dark/0 transition group-hover:bg-dark/45">
              <InstagramIcon className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full max-w-xs items-center justify-center gap-2 rounded-full border border-gold/40 bg-dark px-6 py-3 text-sm font-medium text-gold transition hover:border-gold hover:bg-gold hover:text-dark sm:w-auto sm:py-2.5"
        >
          <InstagramIcon className="h-4 w-4" />
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-[#faf8f5]">
      <header className="border-b border-[#e8e0d4] bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm tracking-[0.2em] text-[#8b6914] uppercase">
            Fine Jewellery
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1a1a1a] sm:text-4xl">
            Virtue Gems
          </h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-4 py-12 text-center sm:px-6">
        <p className="text-lg leading-relaxed text-[#6b5b4f]">
          Our super phone-responsive jewellery website is being crafted.
          Elegant pieces, made for every screen.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="rounded-xl bg-[#8b6914] px-6 py-3.5 text-base font-medium text-white transition hover:bg-[#6d5210]"
          >
            Contact us
          </Link>
          <a
            href="https://github.com/tejakuchallapati/virtue-gems"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[#e8e0d4] bg-white px-6 py-3.5 text-base font-medium text-[#8b6914] transition hover:border-[#d4af37]"
          >
            View on GitHub
          </a>
        </div>
      </main>

      <footer className="border-t border-[#e8e0d4] px-4 py-6 text-center text-sm text-[#6b5b4f]">
        &copy; {new Date().getFullYear()} Virtue Gems. All rights reserved.
      </footer>
    </div>
  );
}

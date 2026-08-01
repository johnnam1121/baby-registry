import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export default function SiteFooter() {
  const { footer, dog } = siteConfig;

  return (
    <footer className="mt-8 border-t border-line">
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-3 px-6 py-9 text-center">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13.5px] text-ink-soft">
          <span>
            Made with 🧸 by{" "}
            <strong className="font-bold text-deep-2">{footer.builtBy}</strong> ·{" "}
            {footer.year}
          </span>
        </p>
        <p className="text-[13px] text-ink-soft">
          Quality assurance by{" "}
          <Link
            href="/benny"
            className="font-bold text-deep underline underline-offset-2"
          >
            {dog.name}
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}

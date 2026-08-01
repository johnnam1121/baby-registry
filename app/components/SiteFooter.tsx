import Link from "next/link";
import { siteConfig } from "@/data/site-config";

/**
 * Powder blue, one step deeper than the pale bands above it — enough to
 * close the page off without going dark. On the home page it follows the
 * blush "Questions?" block, so the two don't run together.
 */
export default function SiteFooter() {
  const { footer, dog } = siteConfig;

  return (
    <footer className="bg-band">
      <div className="shell flex flex-col items-center gap-2 py-10 text-center">
        <p className="text-[13.5px] text-ink-soft">
          Made with 🧸 by{" "}
          <span className="font-semibold text-deep-2">{footer.builtBy}</span> ·{" "}
          {footer.year}
        </p>
        <p className="text-[13px] text-ink-soft">
          Quality assurance by{" "}
          <Link
            href="/benny"
            className="font-semibold text-deep underline underline-offset-2"
          >
            {dog.name}
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}

/**
 * X/Twitter reads its own `twitter:image` tag and ignores the Open Graph
 * one, so it needs its own file. Same picture — this just points the
 * second tag at `opengraph-image.tsx`.
 */
export { default, alt, size, contentType } from "./opengraph-image";

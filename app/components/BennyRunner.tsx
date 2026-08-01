/**
 * Benny, trotting back and forth along the bottom of the viewport.
 *
 * Pure CSS — no JavaScript, no GIF, no image request. The animation lives
 * in the `.benny-*` rules at the bottom of `app/globals.css`, which is
 * also where you'd change his speed or size.
 *
 * The body, shoulder, head, chest ruff and tail tip are "cloud" outlines:
 * an ellipse whose perimeter is a chain of shallow outward arcs, which is
 * what reads as a rough coat. Fewer, deeper arcs turn him into a sheep;
 * these are ~15–22 shallow ones per shape.
 *
 * He cannot block a click: `.benny-stage` is `pointer-events: none`.
 */
export default function BennyRunner() {
  return (
    <div className="benny-stage" aria-hidden="true">
      <div className="benny-runner">
        <div className="benny-bob">
          <svg viewBox="0 0 132 92" className="w-full" role="presentation">
            {/* ---- tail: a full plume with a white tip ---- */}
            <g className="benny-tail">
              <path
                d="M33 40 C 22 45 12 41 8 31 C 4 24 5 16 11 12 C 13 19 13 26 18 31 C 22 35 28 38 34 38 Z"
                fill="#20201e"
              />
              <path
                d="M14.9 19.0 A3.9 3.9 0 0 1 13.4 22.7 A4.0 4.0 0 0 1 10.0 24.6 A4.6 4.6 0 0 1 6.7 22.7 A4.4 4.4 0 0 1 5.3 19.0 A4.1 4.1 0 0 1 6.5 15.1 A4.7 4.7 0 0 1 10.0 13.2 A4.5 4.5 0 0 1 13.4 15.2 A4.3 4.3 0 0 1 14.9 19.0 Z"
                fill="#f7f5f1"
              />
            </g>

            {/* ---- far legs (a shade darker so they read as the far side) ---- */}
            <g className="benny-leg benny-leg--back">
              <rect x="30" y="50" width="7" height="25" rx="3.5" fill="#b9b5ac" />
              <ellipse cx="33.5" cy="75" rx="4.3" ry="2.9" fill="#b9b5ac" />
            </g>
            <g className="benny-leg">
              <rect x="72" y="50" width="7" height="25" rx="3.5" fill="#b9b5ac" />
              <ellipse cx="75.5" cy="75" rx="4.3" ry="2.9" fill="#b9b5ac" />
            </g>

            {/* ---- far ear, tucked behind the head ---- */}
            <path
              d="M104 13 C 110 4 118 4 118 10 C 117 16 110 19 104 18 Z"
              fill="#3a3936"
            />

            {/* ---- body, shoulder and head, all rough-coated ---- */}
            <path
              d="M88.1 46.0 A4.4 4.4 0 0 1 89.0 50.4 A7.2 7.2 0 0 1 84.1 54.2 A7.9 7.9 0 0 1 78.5 57.8 A10.1 10.1 0 0 1 69.1 59.0 A8.7 8.7 0 0 1 60.9 61.4 A11.7 11.7 0 0 1 51.4 60.6 A8.6 8.6 0 0 1 42.9 59.0 A8.6 8.6 0 0 1 35.3 56.8 A9.5 9.5 0 0 1 26.9 54.5 A5.7 5.7 0 0 1 22.8 50.4 A4.4 4.4 0 0 1 22.9 46.0 A5.1 5.1 0 0 1 24.5 41.8 A6.3 6.3 0 0 1 28.1 37.9 A6.8 6.8 0 0 1 34.2 34.5 A9.2 9.2 0 0 1 41.9 32.0 A11.4 11.4 0 0 1 51.2 30.7 A9.8 9.8 0 0 1 60.7 31.3 A10.2 10.2 0 0 1 69.7 32.4 A9.4 9.4 0 0 1 78.4 34.3 A6.6 6.6 0 0 1 83.4 38.0 A6.3 6.3 0 0 1 87.6 41.8 A4.9 4.9 0 0 1 88.1 46.0 Z"
              fill="#20201e"
            />
            <path
              d="M97.2 42.0 A6.2 6.2 0 0 1 95.8 48.1 A7.0 7.0 0 0 1 92.1 52.5 A6.4 6.4 0 0 1 87.0 54.4 A5.7 5.7 0 0 1 81.8 52.7 A7.2 7.2 0 0 1 78.1 48.1 A7.2 7.2 0 0 1 76.6 42.0 A7.5 7.5 0 0 1 77.6 35.5 A6.1 6.1 0 0 1 81.9 31.5 A5.5 5.5 0 0 1 87.0 29.1 A6.0 6.0 0 0 1 92.2 31.4 A6.4 6.4 0 0 1 95.7 36.0 A7.2 7.2 0 0 1 97.2 42.0 Z"
              fill="#20201e"
            />
            <path
              d="M114.7 26.0 A7.6 7.6 0 0 1 113.5 31.6 A7.5 7.5 0 0 1 110.0 36.3 A8.0 8.0 0 0 1 104.8 39.7 A7.1 7.1 0 0 1 98.4 39.8 A8.1 8.1 0 0 1 92.6 37.9 A7.0 7.0 0 0 1 87.8 34.3 A6.5 6.5 0 0 1 84.9 29.0 A7.1 7.1 0 0 1 85.6 23.1 A7.2 7.2 0 0 1 87.9 17.8 A8.0 8.0 0 0 1 92.3 13.6 A8.2 8.2 0 0 1 98.5 12.3 A8.1 8.1 0 0 1 104.8 12.3 A8.2 8.2 0 0 1 109.9 15.8 A6.6 6.6 0 0 1 113.7 20.3 A7.0 7.0 0 0 1 114.7 26.0 Z"
              fill="#20201e"
            />

            {/* ---- white chest ruff and belly ---- */}
            <path
              d="M92.7 48.0 A6.3 6.3 0 0 1 92.2 53.8 A5.8 5.8 0 0 1 88.6 57.8 A5.5 5.5 0 0 1 84.0 59.1 A4.9 4.9 0 0 1 79.6 57.4 A5.7 5.7 0 0 1 76.0 53.7 A5.6 5.6 0 0 1 75.2 48.0 A6.3 6.3 0 0 1 76.3 42.6 A6.2 6.2 0 0 1 79.5 38.5 A5.6 5.6 0 0 1 84.0 37.0 A5.0 5.0 0 0 1 88.7 38.0 A6.1 6.1 0 0 1 91.9 42.4 A6.9 6.9 0 0 1 92.7 48.0 Z"
              fill="#f7f5f1"
            />
            <path
              d="M26 48 C 34 62 70 64 82 52 C 78 60 66 62 54 62 C 40 62 28 56 26 48 Z"
              fill="#f7f5f1"
            />

            {/* ---- near legs, with feathering down the back edge ---- */}
            <g className="benny-leg">
              <rect x="38" y="50" width="8" height="26" rx="4" fill="#f7f5f1" />
              <path
                d="M38 53 C 35 57 34 62 35 67 C 36 63 37 58 38.5 55 Z"
                fill="#f7f5f1"
              />
              <ellipse cx="42" cy="76" rx="4.9" ry="3.1" fill="#f7f5f1" />
            </g>
            <g className="benny-leg benny-leg--back">
              <rect x="80" y="50" width="8" height="26" rx="4" fill="#f7f5f1" />
              <path
                d="M80 53 C 77 57 76 62 77 67 C 78 63 79 58 80.5 55 Z"
                fill="#f7f5f1"
              />
              <ellipse cx="84" cy="76" rx="4.9" ry="3.1" fill="#f7f5f1" />
            </g>

            {/* ---- face ---- */}
            <path
              d="M97 11 C 101 10 103 13 103 18 C 103 23 103 27 102 31 L 96 31 C 95 25 95 16 97 11 Z"
              fill="#f7f5f1"
            />
            <path
              d="M101 24 C 110 21 120 24 122 29 C 120 35 109 37 101 33 Z"
              fill="#f7f5f1"
            />
            <ellipse cx="120" cy="28" rx="3.4" ry="2.9" fill="#141414" />
            <circle cx="108" cy="19" r="2.1" fill="#f7f5f1" />
            <circle cx="108.3" cy="19.2" r="1.3" fill="#141414" />

            {/* ---- near ear ---- */}
            <path
              className="benny-ear"
              d="M93 15 C 87 11 81 5 78 8 C 76 12 80 16 84 18 C 87 19 90 19 93 19 Z"
              fill="#20201e"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

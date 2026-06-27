interface LogoProps {
  variant?: "full" | "icon" | "horizontal";
  className?: string;
  size?: number;
}

/**
 * Shahad Bakes logo — matches the official brand mark:
 *  - Orange hexagon with honey drip smiley face
 *  - "SHAHAD" bold text below
 *  - "SWEETNESS OF PURITY AND HEALTH" tagline
 *
 *  variant="icon"       → hexagon icon only
 *  variant="full"       → icon + SHAHAD + tagline stacked
 *  variant="horizontal" → icon + wordmark side by side (navbar)
 */
export function ShahadLogo({ variant = "horizontal", className = "", size = 40 }: LogoProps) {
  const ORANGE = "#F5A623";
  const DARK_ORANGE = "#E8920A";

  // Hexagon path centered at 50,50 with radius 46
  const hex = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M ${pts.join(" L ")} Z`;
  };

  // The core hexagon + face illustration
  const HexIcon = ({ w = 100, h = 100 }: { w?: number; h?: number }) => (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon body */}
      <path d={hex(50, 52, 44)} fill={ORANGE} />

      {/* Honey drip from top — left drop */}
      <path
        d="M35 10 Q33 18 36 24 Q39 18 37 10 Z"
        fill={ORANGE}
      />
      {/* Honey drip — right drop (taller) */}
      <path
        d="M54 6 Q52 17 55 25 Q58 17 56 6 Z"
        fill={ORANGE}
      />
      {/* Connecting drip bar */}
      <rect x="33" y="8" width="24" height="5" rx="2.5" fill={ORANGE} />

      {/* Face — left eye */}
      <ellipse cx="38" cy="48" rx="4.5" ry="5" fill="white" />
      <ellipse cx="39" cy="49" rx="2.5" ry="3" fill="#333" />
      <ellipse cx="40" cy="48" rx="1" ry="1" fill="white" />

      {/* Face — right eye */}
      <ellipse cx="62" cy="48" rx="4.5" ry="5" fill="white" />
      <ellipse cx="63" cy="49" rx="2.5" ry="3" fill="#333" />
      <ellipse cx="64" cy="48" rx="1" ry="1" fill="white" />

      {/* Smile */}
      <path
        d="M40 60 Q50 68 60 60"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Honey drip from bottom of face */}
      <path
        d="M49 67 Q47 74 50 78 Q53 74 51 67 Z"
        fill={DARK_ORANGE}
        opacity="0.7"
      />

      {/* Cheek blush left */}
      <ellipse cx="32" cy="57" rx="5" ry="3" fill={DARK_ORANGE} opacity="0.4" />
      {/* Cheek blush right */}
      <ellipse cx="68" cy="57" rx="5" ry="3" fill={DARK_ORANGE} opacity="0.4" />

      {/* Small sparkle top right of hexagon */}
      <g transform="translate(82,22)">
        <line x1="0" y1="-5" x2="0" y2="5" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-5" y1="0" x2="5" y2="0" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke={ORANGE} strokeWidth="1" strokeLinecap="round" />
        <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke={ORANGE} strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );

  // ── icon only ──────────────────────────────────────────────
  if (variant === "icon") {
    return (
      <div className={className} style={{ width: size, height: size }}>
        <HexIcon w={size} h={size} />
      </div>
    );
  }

  // ── full stacked (login page, large display) ───────────────
  if (variant === "full") {
    const scale = size / 40;
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <HexIcon w={size * 2.4} h={size * 2.8} />
        <div className="mt-1 text-center">
          <div
            style={{
              color: ORANGE,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 900,
              fontSize: size * 1.1,
              letterSpacing: "0.18em",
              lineHeight: 1,
            }}
          >
            SHAHAD
          </div>
          <div
            style={{
              color: ORANGE,
              fontFamily: "Arial, sans-serif",
              fontWeight: 600,
              fontSize: size * 0.28,
              letterSpacing: "0.12em",
              marginTop: size * 0.1,
            }}
          >
            SWEETNESS OF PURITY AND HEALTH
          </div>
        </div>
      </div>
    );
  }

  // ── horizontal (navbar, footer) ────────────────────────────
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Shahad Bakes">
      <HexIcon w={size * 1.15} h={size * 1.35} />
      <div className="flex flex-col justify-center leading-none">
        <span
          style={{
            color: ORANGE,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 900,
            fontSize: size * 0.52,
            letterSpacing: "0.15em",
            lineHeight: 1,
          }}
        >
          SHAHAD
        </span>
        <span
          style={{
            color: ORANGE,
            fontFamily: "Arial, sans-serif",
            fontWeight: 600,
            fontSize: size * 0.2,
            letterSpacing: "0.1em",
            marginTop: 2,
          }}
        >
          SWEETNESS OF PURITY AND HEALTH
        </span>
      </div>
    </div>
  );
}

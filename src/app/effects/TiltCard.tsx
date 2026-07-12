// ════════════════════════════════════════════════════════════════════════════
//  TiltCard — wraps a card so it tilts in 3D toward the cursor with a glare
//  sheen. Pure CSS transforms (no WebGL). On touch devices / reduced motion
//  it renders a plain wrapper with zero listeners.
//
//  IMPORTANT: TiltCard owns the card's transform. Don't set transform styles
//  on children or the two will fight.
// ════════════════════════════════════════════════════════════════════════════
import { type ReactNode, type CSSProperties, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { useMotionPrefs } from "./useMotionPrefs";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number; // degrees of rotateY at the card's edge
  radius?: number; // border radius of the glare layer (match the card)
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
};

export default function TiltCard({
  children,
  className,
  style,
  maxTilt = 7,
  radius = 16,
  onClick,
  onHoverStart,
  onHoverEnd,
}: TiltCardProps) {
  const { reducedMotion, tier } = useMotionPrefs();

  // Normalized pointer position across the card: -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 260, damping: 20 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxTilt, maxTilt]), spring);
  // rotateX is negated: pointer at the top tips the card back (top away).
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxTilt * 0.7, -maxTilt * 0.7]), spring);

  // Glare follows the pointer (percent coordinates for the gradient origin).
  // Its opacity is a motion value driven by the card's pointer enter/leave —
  // the glare layer itself is pointer-events:none so it can't host hover.
  const glareX = useTransform(px, [-0.5, 0.5], [15, 85]);
  const glareY = useTransform(py, [-0.5, 0.5], [15, 85]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 55%)`;
  const glareOpacityRaw = useMotionValue(0);
  const glareOpacity = useSpring(glareOpacityRaw, { stiffness: 200, damping: 26 });

  // Touch / low-power / reduced-motion: plain wrapper, no listeners at all.
  if (reducedMotion || tier === "lite") {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    // Perspective must live on the PARENT of the rotating element.
    <div className={className} style={{ ...style, perspective: 900 }}>
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          reset();
          glareOpacityRaw.set(0);
          onHoverEnd?.();
        }}
        onPointerEnter={() => {
          glareOpacityRaw.set(1);
          onHoverStart?.();
        }}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", height: "100%", position: "relative" }}
      >
        {children}
        {/* Glare sheen — sits above card content, never intercepts clicks. */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: glare,
            opacity: glareOpacity,
            borderRadius: radius,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </motion.div>
    </div>
  );
}

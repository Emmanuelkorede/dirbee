
import { BeeLogo } from "@/components/brand/bee-logo";

type BrandLockupProps = {
  logoSize?: number;
  color?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
};

export function BrandLockup({
  logoSize,
  color = "currentColor",
  orientation = "vertical",
  className = "",
}: BrandLockupProps) {
  const resolvedLogoSize =
    logoSize ?? (orientation === "vertical" ? 56 : 38);

  const isVertical = orientation === "vertical";

  return (
    <div
      className={[
        "inline-flex items-center",
        isVertical
          ? "flex-col gap-3"
          : "flex-row gap-3",
        className,
      ].join(" ")}
      style={{ color }}
    >
      <BeeLogo
        size={resolvedLogoSize}
        color={color}
        className="shrink-0"
      />

      <span
        className={[
          "font-heading uppercase leading-none",
          "tracking-[0.08em] whitespace-nowrap",
          isVertical
            ? "text-xl sm:text-2xl"
            : "text-lg sm:text-xl",
        ].join(" ")}
      >
        House of Bee
      </span>
    </div>
  );
}

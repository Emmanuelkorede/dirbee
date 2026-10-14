
type BeeLogoProps = {
  size?: number | string;
  color?: string;
  className?: string;
};

export function BeeLogo({
  size = 64,
  color = "currentColor",
  className,
}: BeeLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label="House of Bee logo"
      focusable="false"
    >
      <path
        d="M95 145 L250 55 L425 155
           C448 168 455 194 444 215
           C439 225 432 233 421 240
           C410 227 394 222 375 222
           H275 V175 L185 122 V445 H95 Z"
        fill={color}
      />

      <path
        d="M275 240
           H375
           C419 240 445 267 445 310
           C445 353 419 380 375 380
           H275 Z"
        fill={color}
        transform="translate(0 65)"
      />
    </svg>
  );
}

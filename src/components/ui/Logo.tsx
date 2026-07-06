import { JSX } from "react";

type LogoProps = {
  readonly size?: number;
  readonly className?: string;
};

export default function Logo({ size = 32, className = "" }: LogoProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Compass"
    >
      <circle cx="512" cy="512" r="440" fill="var(--color-ink)" />
      <polygon
        points="512,200 620,512 512,440 404,512"
        fill="var(--color-accent)"
        transform="rotate(35 512 512)"
      />
      <polygon
        points="512,824 566,512 512,580 458,512"
        fill="var(--color-card)"
        transform="rotate(35 512 512)"
      />
    </svg>
  );
}

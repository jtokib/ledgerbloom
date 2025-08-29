import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <path d="M12 2v2.35" />
      <path d="M12 17.77V22" />
      <path d="M4.22 10.27l-1.93-1.93" />
      <path d="M19.78 10.27l1.93-1.93" />
      <path d="M2 14.14h2.35" />
      <path d="M19.65 14.14H22" />
      <path d="M4.22 17.73l-1.93 1.93" />
      <path d="M19.78 17.73l1.93 1.93" />
    </svg>
  );
}

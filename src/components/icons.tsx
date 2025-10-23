import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5.5A5.5 5.5 0 0 1 17.5 11c0 2.24-1.5 4-3 5.5L12 19l-2.5-2.5C8 15 6.5 13.24 6.5 11A5.5 5.5 0 0 1 12 5.5Z" />
      <path d="M12 11c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3Z" />
    </svg>
  ),
};

    
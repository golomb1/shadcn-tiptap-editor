import type { SVGProps } from "react";

export function DeleteRow(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            {...props}
        >
            <path
                fill="currentColor"
                d="M20 5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1a5 5 0 1 1-8 0H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm-7 10v2h6v-2zm6-8H5v4h14z"
            ></path>
        </svg>
    )
}

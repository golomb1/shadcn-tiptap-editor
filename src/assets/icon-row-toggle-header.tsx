import type { SVGProps } from "react";

export function TableHeaderRow(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
            width="1em"
            height="1em"
            {...props}
        >
            <path
                fill="currentColor"
                d="M0 128h2048v1664H0zm768 1024h512V768H768zm512 128H768v384h512zM640 768H128v384h512zm768 0v384h512V768zM128 1280v384h512v-384zm1280 384h512v-384h-512z"
            ></path>
        </svg>
    )
}

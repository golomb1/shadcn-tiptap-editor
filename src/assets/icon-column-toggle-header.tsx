import type { SVGProps } from "react";

export function TableFirstColumn(props: SVGProps<SVGSVGElement>) {
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
                d="M0 128h2048v1664H0zm1920 512V256h-512v384zM768 256v384h512V256zm0 1024v384h512v-384zm0-128h512V768H768zm640-384v384h512V768zm0 896h512v-384h-512z"
            ></path>
        </svg>
    )
}

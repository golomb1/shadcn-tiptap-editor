import type { SVGProps } from "react";

export function InsertColumnRight(props: SVGProps<SVGSVGElement>) {
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
                d="M10 5H4v14h6zM4 21q-.825 0-1.412-.587T2 19V5q0-.825.588-1.412T4 3h14q.825 0 1.413.588T20 5v1q0 .425-.288.713T19 7t-.712-.288T18 6V5h-6v14h6v-1q0-.425.288-.712T19 17t.713.288T20 18v1q0 .825-.587 1.413T18 21zm15-6q-.425 0-.712-.288T18 14v-1h-1q-.425 0-.712-.288T16 12t.288-.712T17 11h1v-1q0-.425.288-.712T19 9t.713.288T20 10v1h1q.425 0 .713.288T22 12t-.288.713T21 13h-1v1q0 .425-.288.713T19 15m-9-3h2zm0 0"
            ></path>
        </svg>
    )
}

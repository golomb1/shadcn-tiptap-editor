import type { SVGProps } from "react";


export function InsertColumnLeft(props: SVGProps<SVGSVGElement>) {
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
                d="M14 19h6V5h-6zm-8 2q-.825 0-1.412-.587T4 19v-1q0-.425.288-.712T5 17t.713.288T6 18v1h6V5H6v1q0 .425-.288.713T5 7t-.712-.288T4 6V5q0-.825.588-1.412T6 3h14q.825 0 1.413.588T22 5v14q0 .825-.587 1.413T20 21zm-1-6q-.425 0-.712-.288T4 14v-1H3q-.425 0-.712-.288T2 12t.288-.712T3 11h1v-1q0-.425.288-.712T5 9t.713.288T6 10v1h1q.425 0 .713.288T8 12t-.288.713T7 13H6v1q0 .425-.288.713T5 15m9-3h-2zm0 0"
            ></path>
        </svg>
    )
}

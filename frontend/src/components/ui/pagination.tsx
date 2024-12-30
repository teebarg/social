import type React from "react"
import { Button } from "./button"

type PaginationProps = {
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  onChangePage: (newPage: number) => void
  page: number
  count?: number
}

const Pagination: React.FC<PaginationProps> = ({
  hasNextPage,
  hasPreviousPage,
  onChangePage,
  page,
  count = 0,
}) => {
  if (!count) {
    return null
  }
  return (
    <div className="py-2 px-2 flex justify-between items-center mt-4">
      <div className="w-[30%]" />
      <nav
        aria-label="pagination navigation"
        className="p-2.5 -m-2.5 overflow-x-scroll scrollbar-hide"
        data-active-page={page}
        data-controls="true"
        data-dots-jump="5"
        data-slot="base"
        data-total={count ?? 0}
        role="navigation"
      >
        <ul
          className="flex flex-nowrap h-fit max-w-fit relative gap-1 items-center overflow-visible rounded-medium"
          data-slot="wrapper"
        >
          <span
            aria-hidden="true"
            className="absolute flex overflow-visible items-center justify-center origin-center left-0 select-none touch-none pointer-events-none z-20 data-[moving=true]:transition-transform !data-[moving=true]:duration-300 opacity-0 data-[moving]:opacity-100 min-w-9 w-9 h-9 text-small rounded-medium bg-foreground text-background"
            data-moving={page !== page || false}
            data-slot="cursor"
            style={{ transform: `translateX(${40 * page}px) scale(1)` }}
          >
            {page}
          </span>
          {/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */}
          <li
            aria-disabled={count === 1 || page === 1 ? "true" : "false"}
            aria-label="previous page button"
            className="flex flex-wrap truncate box-border items-center justify-center text-default-foreground outline-none data-[disabled=true]:text-default-300 data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-default-100 active:bg-default-200 min-w-9 w-9 h-9 text-small rounded-medium cursor-pointer"
            data-disabled={count === 1 || page === 1 ? "true" : "false"}
            data-slot="prev"
            onClick={() => onChangePage(page - 1)}
            onMouseEnter={(e) =>
              e.currentTarget.setAttribute("data-hover", "true")
            }
            onMouseLeave={(e) => e.currentTarget.removeAttribute("data-hover")}
          >
            <svg
              aria-hidden="true"
              fill="none"
              focusable="false"
              height="1em"
              role="presentation"
              viewBox="0 0 24 24"
              width="1em"
            >
              <path
                d="M15.5 19l-7-7 7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </li>
          {Array.from({ length: count }).map((_, index: number) => (
            <li
              key={index}
              aria-current={page === index + 1 ? "true" : undefined}
              aria-label={`pagination item ${index + 1} ${
                page === index + 1 ? "active" : ""
              }`}
              className="select-none touch-none bg-transparent transition-transform-background flex flex-wrap truncate box-border items-center justify-center text-default-foreground outline-none data-[disabled=true]:text-default-300 data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-default-100 active:bg-default-200 min-w-9 w-9 h-9 text-small rounded-medium cursor-pointer"
              data-active={page === index + 1 ? "true" : undefined}
              data-slot="item"
              onClick={() => onChangePage(index + 1)}
              onMouseEnter={(e) =>
                e.currentTarget.setAttribute("data-hover", "true")
              }
              onMouseLeave={(e) =>
                e.currentTarget.removeAttribute("data-hover")
              }
            >
              {index + 1}
            </li>
          ))}
          <li
            aria-disabled={count === 1 || page === count ? "true" : "false"}
            aria-label="next page button"
            className="flex flex-wrap truncate box-border items-center justify-center text-default-foreground outline-none data-[disabled=true]:text-default-300 data-[disabled=true]:pointer-events-none [&[data-hover=true]:not([data-active=true])]:bg-default-100 active:bg-default-200 min-w-9 w-9 h-9 text-small rounded-medium"
            data-disabled={count === 1 || page === count ? "true" : "false"}
            data-slot="next"
            onClick={() => onChangePage(page + 1)}
            onMouseEnter={(e) =>
              e.currentTarget.setAttribute("data-hover", "true")
            }
            onMouseLeave={(e) => e.currentTarget.removeAttribute("data-hover")}
          >
            <svg
              aria-hidden="true"
              className="rotate-180"
              fill="none"
              focusable="false"
              height="1em"
              role="presentation"
              viewBox="0 0 24 24"
              width="1em"
            >
              <path
                d="M15.5 19l-7-7 7-7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </li>
        </ul>
      </nav>
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          disabled={!hasPreviousPage || page <= 1}
          size="sm"
          variant="flat"
          onClick={() => onChangePage(page - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={!hasNextPage}
          size="sm"
          variant="flat"
          onClick={() => onChangePage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export { Pagination }

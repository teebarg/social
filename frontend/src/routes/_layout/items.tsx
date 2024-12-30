import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { z } from "zod"

import { ItemsService } from "@/client"
import ActionsMenu from "@/components/Common/ActionsMenu"
import Navbar from "@/components/Common/Navbar"
import AddItem from "@/components/Items/AddItem"
import { Pagination } from "@/components/ui/pagination"
import SkeletonText from "@/components/ui/skeleton-text.tsx"
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table.tsx"
import { cn } from "@/utils.ts"

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
})

const PER_PAGE = 5

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ItemsService.readItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["items", { page }],
  }
}

function ItemsTable() {
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const {
    data: items,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && items?.data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getItemsQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
    <>
      <div>
        <Table>
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>Title</TH>
              <TH>Description</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          {isPending ? (
            <TBody>
              <TR>
                {new Array(5).fill(null).map((_, index) => (
                  <TD key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </TD>
                ))}
              </TR>
            </TBody>
          ) : (
            <TBody>
              {items?.data.map((item) => (
                <TR
                  key={item.id}
                  className={cn(
                    isPlaceholderData ? "opacity-50" : "opacity-100",
                  )}
                >
                  <TD>{item.id}</TD>
                  <TD className="truncate max-w-40">{item.title}</TD>
                  <TD className="truncate max-w-40">
                    {item.description || "N/A"}
                  </TD>
                  <TD>
                    <ActionsMenu type={"Item"} value={item} />
                  </TD>
                </TR>
              ))}
            </TBody>
          )}
        </Table>
      </div>
      <Pagination
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        count={Math.ceil((items?.count as number) / PER_PAGE)}
      />
    </>
  )
}

function Items() {
  return (
    <div className="py-4 px-8 w-full">
      <h1 className="text-xl text-center md:text-left pt-8">
        Items Management
      </h1>

      <Navbar type={"Item"} addModalAs={AddItem} />
      <ItemsTable />
    </div>
  )
}

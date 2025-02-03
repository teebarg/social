import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import AddUser from "@/components/Admin/AddUser";
import ActionsMenu from "@/components/Common/ActionsMenu";
import Navbar from "@/components/Common/Navbar";
import Chip from "@/components/ui/chip";
import { Pagination } from "@/components/ui/pagination.tsx";
import SkeletonText from "@/components/ui/skeleton-text.tsx";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table.tsx";
import { cn } from "@/utils";
import { type UserPublic, UsersService } from "../../client";

const usersSearchSchema = z.object({
    page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/admin")({
    component: Admin,
    validateSearch: (search) => usersSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getUsersQueryOptions({ page }: { page: number }) {
    return {
        queryFn: () => UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
        queryKey: ["users", { page }],
    };
}

function UsersTable() {
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
    const { page } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const setPage = (page: number) =>
        navigate({
            search: (prev: { [key: string]: string }) => ({ ...prev, page }),
        });

    const {
        data: users,
        isPending,
        isPlaceholderData,
    } = useQuery({
        ...getUsersQueryOptions({ page }),
        placeholderData: (prevData) => prevData,
    });

    const hasNextPage = !isPlaceholderData && users?.data.length === PER_PAGE;
    const hasPreviousPage = page > 1;

    useEffect(() => {
        if (hasNextPage) {
            queryClient.prefetchQuery(getUsersQueryOptions({ page: page + 1 }));
        }
    }, [page, queryClient, hasNextPage]);

    return (
        <>
            <div>
                <Table>
                    <THead>
                        <TR>
                            <TH className="w-[10%]">First name</TH>
                            <TH className="w-[10%]">Last name</TH>
                            <TH className="w-1/2">Email</TH>
                            <TH className="w-[10%]">Role</TH>
                            <TH className="w-[10%]">Status</TH>
                            <TH className="w-[10%]">Actions</TH>
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
                            {users?.data.map((user) => (
                                <TR key={user.id}>
                                    <TD className={cn("max-w-40 truncate", !user.first_name ? "opacity-50" : "opacity-100")}>
                                        {user.first_name || "N/A"}
                                        {currentUser?.id === user.id && <Chip title="You" className="ml-1" color="secondary" />}
                                    </TD>
                                    <TD className={cn("max-w-40 truncate", !user.last_name ? "opacity-50" : "opacity-100")}>
                                        {user.last_name || "N/A"}
                                        {currentUser?.id === user.id && <Chip title="You" className="ml-1" />}
                                    </TD>
                                    <TD className="max-w-40 truncate">{user.email}</TD>
                                    <TD>{user.is_superuser ? "Superuser" : "User"}</TD>
                                    <TD>
                                        <div className="flex gap-2">
                                            <div className={cn("w-1 h-1 rounded-50 self-center", user.is_active ? "bg-success" : "bg-danger")} />
                                            {user.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </TD>
                                    <TD>
                                        <ActionsMenu type="User" value={user} disabled={currentUser?.id === user.id} />
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
                count={Math.ceil((users?.count as number) / PER_PAGE)}
            />
        </>
    );
}

function Admin() {
    return (
        <div className="w-full px-2 py-4">
            <h2 className="text-xl text-center md:text-left pt-4">Users Management</h2>

            <Navbar type={"User"} addModalAs={AddUser} />
            <UsersTable />
        </div>
    );
}

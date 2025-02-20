import { Loading } from "@/components/loading";
import { Dashboard } from "@/components/social/dashboard";
import { CreatePost } from "@/components/social/post-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { DraftService } from "@/client";
import useAuth from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const draftsSearchSchema = z.object({
    page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/posts/")({
    component: PostIndex,
    validateSearch: (search) => draftsSearchSchema.parse(search),
});

const PER_PAGE = 10;

function getItemsQueryOptions({ page = 1 }: { page: number }) {
    return {
        queryFn: () => DraftService.getAll({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
        queryKey: ["drafts", { page }],
    };
}

function PostIndex() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const { page } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const setPage = (page: number) =>
        navigate({
            search: (prev: { [key: string]: string }) => ({ ...prev, page }),
        });

    const {
        data: items,
        isPending,
        isPlaceholderData,
    } = useQuery({
        ...getItemsQueryOptions({ page }),
        placeholderData: (prevData) => prevData,
    });

    const hasNextPage = !isPlaceholderData && items?.data.length === PER_PAGE;
    // const hasPreviousPage = page > 1;

    useEffect(() => {
        if (hasNextPage) {
            queryClient.prefetchQuery(getItemsQueryOptions({ page: page + 1 }));
        }
    }, [page, queryClient, hasNextPage]);

    if (isPending) {
        return <Loading />;
    }

    return (
        <>
            <div className="p-8 bg-content2 w-full">
                <div className="pt-4 m-1 max-w-6xl">
                    <p className="text-2xl">Hi, {currentUser?.first_name || currentUser?.email} 👋🏼</p>
                    <main className="py-8">
                        <div className="space-y-8">
                            <CreatePost />
                            <Dashboard posts={items} page={page} setPage={setPage} hasNextPage={hasNextPage} isPending={isPending} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

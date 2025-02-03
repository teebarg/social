import { type DraftPublic, DraftService, type DraftsPublic } from "@/client";
import { Confirm } from "@/components/confirm";
import { SlideOver } from "@/components/slideover";
import { Button } from "@/components/ui/button";
import SkeletonText from "@/components/ui/skeleton-text.tsx";
import { TBody, TD, TH, THead, TR, Table } from "@/components/ui/table.tsx";
import { format } from "date-fns";
import { Calendar, EditIcon, Trash } from "nui-react-icons";
import type React from "react";
import { useState } from "react";
import { useOverlayTriggerState } from "react-stately";
import { Modal } from "../modal";
import { Pagination } from "@/components/ui/pagination";
import { UpdatePost } from "./post-update-form";
import { Publish } from "./publish";

const PER_PAGE = 5;

type Props = {
    posts?: DraftsPublic;
    page: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
    isPending: boolean;
};

const Dashboard: React.FC<Props> = ({ posts, page, setPage, hasNextPage, isPending }) => {
    const confirmationModal = useOverlayTriggerState({});
    const [id, setId] = useState<string>("");
    const [post, setPost] = useState<any>(null);
    const slideOverState = useOverlayTriggerState({});

    const getPostStatus = (post: any) => {
        if (post.is_published) return "published";
        if (post.scheduled_time) return "scheduled";
        return "draft";
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-700";
            case "scheduled":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-orange-100 text-orange-700";
        }
    };

    const handleEdit = (post: any) => {
        setPost(post);
        slideOverState.open();
    };

    const handleDelete = (id: string) => {
        setId(id);
        confirmationModal.open();
    };

    const hasPreviousPage = page > 1;

    return (
        <div className="py-6 space-y-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-default-800">Total Posts</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{posts?.count}</p>
                </div>
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-default-800">Published</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{posts?.data.filter((post: DraftPublic) => post.is_published).length}</p>
                </div>
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-default-800">Drafts & Scheduled</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{posts?.data.filter((post: DraftPublic) => !post.is_published).length}</p>
                </div>
            </div>

            <div className="bg-content1 rounded-xl shadow-sm p-2">
                <div className="py-6 px-2">
                    <h2 className="text-xl font-semibold text-default-800">Recent Posts</h2>
                </div>
                <Table>
                    <THead>
                        <TR>
                            <TH>ID</TH>
                            <TH>Title</TH>
                            <TH>Content</TH>
                            <TH>Actions</TH>
                            <TH>Status</TH>
                            <TH>Date</TH>
                        </TR>
                    </THead>
                    {isPending ? (
                        <TBody>
                            <TR>
                                {new Array(6).fill(null).map((_, index) => (
                                    <TD key={index}>
                                        <SkeletonText noOfLines={5} paddingBlock="16px" />
                                    </TD>
                                ))}
                            </TR>
                        </TBody>
                    ) : (
                        <TBody>
                            {posts?.data.map((post: DraftPublic, index: number) => (
                                <TR key={post.id} className="relative">
                                    <TD>{(page - 1) * PER_PAGE + index + 1})</TD>
                                    <TD className="truncate max-w-28">{post.title}</TD>
                                    <TD className="truncate max-w-72">
                                        <div className="space-y-2">
                                            <p className="text-default-800">{post.content}</p>
                                            {post.scheduled_time && (
                                                <div className="flex items-center gap-2 text-sm text-default-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Scheduled for: {format(new Date(post.scheduled_time), "MMM d, yyyy h:mm a")}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TD>
                                    <TD>
                                        <div className="flex items-center gap-2">
                                            {!post.is_published && (
                                                <>
                                                    <Publish id={post.id as string} />
                                                    <button
                                                        className="p-2 text-default-600 hover:bg-default-100 rounded-full transition-colors"
                                                        onClick={() => handleEdit(post)}
                                                    >
                                                        <EditIcon className="w-5 h-5" />
                                                    </button>
                                                    <Button
                                                        className="text-red-600 hover:bg-red-50 rounded-full p-1 min-w-0 h-auto bg-transparent"
                                                        onClick={() => handleDelete(post.id as string)}
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TD>
                                    <TD>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(getPostStatus(post))}`}>
                                            {getPostStatus(post)}
                                        </span>
                                    </TD>
                                    <TD>
                                        <div className="text-sm text-default-500">
                                            {post.created_at && <span>{format(new Date(post.created_at as string), "MMM d, yyyy h:mm a")}</span>}
                                        </div>
                                    </TD>
                                </TR>
                            ))}
                        </TBody>
                    )}
                </Table>

                <Pagination
                    page={page}
                    onChangePage={setPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    count={Math.ceil((posts?.count as number) / PER_PAGE)}
                />
            </div>
            {confirmationModal.isOpen && (
                <Modal onClose={confirmationModal.close}>
                    <Confirm
                        title="Delete draft?"
                        content="Are you sure you want to delete this draft? This action cannot be undone."
                        onClose={confirmationModal.close}
                        queryKey="drafts"
                        onConfirm={DraftService.delete({ id: id })}
                    />
                </Modal>
            )}
            {slideOverState.isOpen && (
                <SlideOver className="bg-default-50" isOpen={slideOverState.isOpen} title="Edit Product" onClose={slideOverState.close}>
                    <UpdatePost post={post} onClose={slideOverState.close} />
                </SlideOver>
            )}
        </div>
    );
};

export { Dashboard };

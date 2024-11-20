import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, type ItemPublic, type ItemUpdate, ItemsService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError, isEmpty } from "../../utils";
import { Modal } from "../modal";
import { FormControl, Label } from "../ui/label";
import { Input } from "../ui/input2";
import { Button } from "../ui/button";

interface EditItemProps {
    item: ItemPublic;
    isOpen: boolean;
    onClose: () => void;
}

const EditItem = ({ item, isOpen, onClose }: EditItemProps) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ItemUpdate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: item,
    });

    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem({ id: item.id, requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "Item updated successfully.");
            onClose();
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
        },
    });

    const onSubmit: SubmitHandler<ItemUpdate> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            {isOpen && (
                <Modal onClose={onClose}>
                    <div className="mx-auto w-full p-8">
                        <div>
                            <h2 className="text-lg font-semibold leading-6 text-default-800">Edit Item</h2>
                            <form className="w-full mt-2" onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        {...register("title", {
                                            required: "Title is required",
                                        })}
                                        type="text"
                                        placeholder="Title"
                                        error={errors.title?.message}
                                    />
                                </FormControl>
                                <FormControl className="mt-1">
                                    <Label htmlFor="description">Description</Label>
                                    <Input id="description" {...register("description")} placeholder="Description" type="text" />
                                </FormControl>
                                <div className="flex justify-end gap-2 mt-8">
                                    <Button className="min-w-32" onClick={onClose} disabled={mutation.isPending}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className="min-w-32"
                                        color="primary"
                                        type="submit"
                                        disabled={!isEmpty(errors) || mutation.isPending}
                                        isLoading={mutation.isPending}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default EditItem;

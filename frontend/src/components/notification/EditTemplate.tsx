import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError, isEmpty } from "@/utils";
import { type ApiError } from "../../client";
import { FormControl, Label } from "@/components/ui/label";
import { type NotificationTemplateUpdate, type NotificationTemplatePublic } from "@/client/models/notification.model";
import { NotificationsService } from "@/client/services/notification.service";
import { Textarea } from "@/components/ui/textarea";

interface EditTemplateProps {
    template: NotificationTemplatePublic;
    onClose: () => void;
}

const EditTemplate = ({ template, onClose }: EditTemplateProps) => {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<NotificationTemplateUpdate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: template,
    });

    const mutation = useMutation({
        mutationFn: (data: NotificationTemplateUpdate) => NotificationsService.updateTemplate({ id: template.id, requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "Template updated successfully.");
            onClose();
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
        },
    });

    const onSubmit: SubmitHandler<NotificationTemplateUpdate> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            <div className="mx-auto w-full p-8">
                <div>
                    <h2 className="text-lg font-semibold leading-6 text-default-800">Edit Item</h2>
                    <form className="w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
                        <FormControl className="mt-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                {...register("title", {
                                    required: "Title is required.",
                                })}
                                error={errors.title?.message}
                                className="mt-1 shadow-sm sm:text-sm"
                                placeholder="Notification Title"
                            />
                        </FormControl>
                        <FormControl className="mt-1">
                            <Label htmlFor="title">Excerpt</Label>
                            <Input
                                type="text"
                                id="excerpt"
                                {...register("excerpt", {
                                    required: "Excerpt is required.",
                                })}
                                error={errors.excerpt?.message}
                                className="mt-1 shadow-sm sm:text-sm"
                                placeholder="Excerpt"
                            />
                        </FormControl>
                        <FormControl className="mt-1">
                            <Label htmlFor="icon">Icon (emoji or URL)</Label>
                            <Input type="text" id="icon" {...register("icon")} className="mt-1" placeholder="🔔" />
                        </FormControl>

                        <FormControl className="mt-1">
                            <Label htmlFor="body">Message</Label>
                            <Textarea
                                id="body"
                                {...register("body", {
                                    required: "Message is required.",
                                })}
                                error={errors.body?.message}
                                className="mt-1"
                                placeholder="Notification message..."
                            />
                        </FormControl>
                        <div className="flex justify-end gap-2 mt-8">
                            <Button className="min-w-32" onClick={onClose} disabled={mutation.isPending}>
                                Cancel
                            </Button>
                            <Button
                                className="min-w-32"
                                color="primary"
                                type="submit"
                                disabled={!isEmpty(errors) || !isDirty || mutation.isPending}
                                isLoading={mutation.isPending}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditTemplate;

import { NotificationPreview as NotificationPreviewType } from "@/client/models/notification.model";
import { Bell, Send } from "nui-react-icons";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";
import { type ApiError } from "@/client";
import { NotificationsService } from "@/client/services/notification.service";
import { NotificationCreate } from "@/client/models/notification.model";

interface NotificationPreviewProps {
    notification: NotificationPreviewType;
}

export function NotificationPreview({ notification }: NotificationPreviewProps) {
    const queryClient = useQueryClient();
    const showToast = useCustomToast();

    const mutation = useMutation({
        mutationFn: (data: NotificationCreate) => NotificationsService.createNotification({ requestBody: data }),
        onSuccess: () => {
            showToast.success("Success!", "Notification sent successfully.");
        },
        onError: (err: ApiError) => {
            handleError(err, showToast);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
    const handleSend = () => {
        mutation.mutate({
            title: `${notification.icon} ${notification.title}`,
            body: notification.body,
            group: "bot"
        });
    };

    return (
        <>
            <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {notification.icon ? <span className="text-2xl">{notification.icon}</span> : <Bell className="h-6 w-6 text-gray-400" />}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title || "Notification Title"}</p>
                            <p className="mt-1 text-sm text-gray-500">{notification.body || "Notification message will appear here"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <Button className="min-w-24" color="secondary" onClick={handleSend} startContent={<Send className="h-4 w-4" />}>
                    Send
                </Button>
            </div>
        </>
    );
}

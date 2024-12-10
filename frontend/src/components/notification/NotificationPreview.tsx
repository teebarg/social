import { NotificationPreview as NotificationPreviewType } from "@/types/notification";
import { Bell } from "nui-react-icons";

interface NotificationPreviewProps {
    notification: NotificationPreviewType;
}

export function NotificationPreview({ notification }: NotificationPreviewProps) {
    return (
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
    );
}

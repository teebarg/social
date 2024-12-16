import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "nui-react-icons";
import { NotificationForm } from "@/components/notification/NotificationForm";
import { NotificationPreview } from "@/components/notification/NotificationPreview";
import { TemplateSelector } from "@/components/notification/TemplateSelector";
import { NotificationPreview as NotificationPreviewType } from "@/types/notification";
import { useState } from "react";

export const Route = createFileRoute("/_layout/notification/")({
    component: SendNotification,
});

function SendNotification() {
    const templates = [
        { id: "custom", name: "Custom Message" },
        { id: "welcome", name: "Welcome Message" },
        { id: "reminder", name: "Reminder" },
        { id: "update", name: "App Update" },
    ];

    const [preview, setPreview] = useState<NotificationPreviewType>({
        title: "",
        body: "",
        icon: "",
    });

    return (
        <>
            <div className="bg-content2 w-full min-h-screen">
                <div className="py-10">
                    <header>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center">
                                <Bell className="h-8 w-8 mr-3 text-indigo-600" />
                                Push Notification Manager
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="px-4 py-8 sm:px-0">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                    <div className="space-y-8 col-span-2">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Compose Notification</h2>
                                                <NotificationForm onPreview={setPreview} />
                                            </div>
                                        </div>

                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <TemplateSelector
                                                    onSelect={(template) =>
                                                        setPreview({
                                                            title: template.title,
                                                            body: template.body,
                                                            icon: template.icon,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <NotificationPreview notification={preview} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

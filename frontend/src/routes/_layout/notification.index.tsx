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

    const handleSend = (notification: NotificationPreviewType) => {
        // In a real application, this would send the notification to users
        alert("Notification sent successfully!");
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100">
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
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="space-y-8">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Compose Notification</h2>
                                                <NotificationForm onPreview={setPreview} onSend={handleSend} />
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
            {/* <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Send Push Notification</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                                Notification Template
                            </label>
                            <select id="template" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter notification title"
                            />
                        </div>
                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                                Body
                            </label>
                            <textarea
                                id="body"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter notification body"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                                Target Group (optional)
                            </label>
                            <input
                                type="text"
                                id="group"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter target group"
                            />
                        </div>
                        <div>
                            <label htmlFor="users" className="block text-sm font-medium text-gray-700">
                                User IDs (optional, comma separated)
                            </label>
                            <input
                                type="text"
                                id="users"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter user IDs"
                            />
                        </div>
                        <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md">
                            Send Notification
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Preview</h2>
                    <div className="border rounded-lg p-4 max-w-sm mx-auto bg-white shadow-lg">
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                            <span>9:41</span>
                            <div className="flex space-x-1">
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs">App</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm">Your App Name</span>
                                    <span className="text-xs text-gray-500">now</span>
                                </div>
                                <h3 className="font-medium text-sm">
                                    Preview Title
                                </h3>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">Preview notification message will appear here...</p>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <p className="mb-2">📱 This is how your notification will appear on user devices</p>
                        <p>👥 Recipients: All Users</p>
                    </div>
                </div>
            </div> */}
        </>
    );
}

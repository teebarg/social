import { useState } from "react";
import { NotificationPreview } from "../../types/notification";
import { EyeIcon, Send } from "nui-react-icons";

interface NotificationFormProps {
    onPreview: (preview: NotificationPreview) => void;
    onSend: (notification: NotificationPreview) => void;
}

export function NotificationForm({ onPreview, onSend }: NotificationFormProps) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [icon, setIcon] = useState("");

    const handlePreview = () => {
        onPreview({ title, body, icon });
    };

    const handleSend = () => {
        onSend({ title, body, icon });
        setTitle("");
        setBody("");
        setIcon("");
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Notification Title"
                />
            </div>

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Notification message..."
                />
            </div>

            <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icon (emoji or URL)
                </label>
                <input
                    type="text"
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="🔔"
                />
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={handlePreview}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Preview
                </button>
                <button
                    onClick={handleSend}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                </button>
            </div>
        </div>
    );
}

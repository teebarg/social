import { useState } from "react";
import { NotificationPreview } from "@/types/notification";
import { EyeIcon, Send } from "nui-react-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {Select, SelectItem} from "@/components/ui/select"

interface NotificationFormProps {
    onPreview: (preview: NotificationPreview) => void;
    onSend: (notification: NotificationPreview) => void;
}

const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
];

export function NotificationForm({ onPreview, onSend }: NotificationFormProps) {
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState("");
    const [icon, setIcon] = useState("");
    const [value, setValue] = useState<string>("");

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
                <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="mt-1 shadow-sm sm:text-sm"
                    placeholder="Notification Title"
                />
            </div>

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="mt-1" placeholder="Notification message..." />
            </div>

            <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    Icon (emoji or URL)
                </label>
                <Input
                    type="text"
                    id="icon"
                    value={icon}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="mt-1"
                    placeholder="🔔"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Select Framework</label>
                <Select value={value} onChange={setValue} placeholder="Select a framework">
                    {frameworks.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                            {framework.label}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex space-x-4">
                <Button className="min-w-24" color="primary" onClick={handlePreview} startContent={<EyeIcon className="h-4 w-4" />}>
                    Preview
                </Button>
                <Button className="min-w-24" color="secondary" onClick={handleSend} startContent={<Send className="h-4 w-4" />}>
                    Send
                </Button>
            </div>
        </div>
    );
}

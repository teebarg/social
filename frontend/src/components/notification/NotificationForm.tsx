import { useState } from "react";
import { NotificationPreview } from "@/types/notification";
import { EyeIcon } from "nui-react-icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, Item } from "@/components/ui/select1";
import { Label } from "@/components/ui/label";

interface NotificationFormProps {
    onPreview: (preview: NotificationPreview) => void;
}

const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
];

export function NotificationForm({ onPreview }: NotificationFormProps) {
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState("");
    const [icon, setIcon] = useState("");
    const [value, setValue] = useState<string>("");

    const handlePreview = () => {
        onPreview({ title, body, icon });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="title">Title</Label>
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
                    <Label htmlFor="icon">Icon (emoji or URL)</Label>
                    <Input
                        type="text"
                        id="icon"
                        value={icon}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIcon(e.target.value)}
                        className="mt-1"
                        placeholder="🔔"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="mt-1" placeholder="Notification message..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <Select
                        label="Select Group"
                        items={frameworks}
                        selectedKey={value}
                        onSelectionChange={(selected) => setValue(selected as string)}
                        className="w-full"
                    >
                        {(item) => <Item key={item.value}>{item.label}</Item>}
                    </Select>
                </div>
            </div>

            <div className="flex">
                <Button className="min-w-24" color="primary" onClick={handlePreview} startContent={<EyeIcon className="h-4 w-4" />}>
                    Preview
                </Button>
            </div>
        </div>
    );
}

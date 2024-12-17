import { NotificationTemplatePublic } from "@/client/models/notification.model";
import { NotificationTemplate } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "nui-react-icons";
import AddTemplate from "@/components/notification/AddTemplate";
import { useState } from "react";

interface TemplateSelectorProps {
    templates: Array<NotificationTemplatePublic> | undefined;
    onSelect: (template: NotificationTemplatePublic) => void;
}

const defaultTemplates: NotificationTemplate[] = [
    {
        id: "1",
        name: "Welcome Message",
        title: "Welcome to Our Platform! 👋",
        body: `Thank you for joining us. We're excited to have you here!`,
        icon: "🎉",
    },
    {
        id: "2",
        name: "New Feature Alert",
        title: "New Feature Available ✨",
        body: "Check out our latest feature that just launched!",
        icon: "🚀",
    },
    {
        id: "3",
        name: "Reminder",
        title: "Don't forget! ⏰",
        body: "You have pending tasks waiting for your attention.",
        icon: "📝",
    },
];

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
    const [addTemplate, setAddTemplate] = useState<boolean>(false);
    const handleAdd = () => {};

    const handleDelete = () => {};

    const handleEdit = () => {};

    return (
        <>
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-default-900">Templates</h3>
                <div>
                    <Button color="primary" onClick={() => setAddTemplate(true)} className="">
                        Add <Plus />
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates?.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => onSelect(template)}
                            className="relative rounded-lg border border-gray-300 bg-content1 px-6 py-5 shadow-sm flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <div className="flex-1">
                                <span className="text-2xl mb-2 block">{template.icon}</span>
                                <h3 className="text-sm font-medium text-default-900">{template.title}</h3>
                                <p className="mt-1 text-sm text-default-500">{template.excerpt}</p>
                            </div>
                            <div className="flex flex-row-reverse mt-4 gap-2 w-full">
                                <Button color="danger" onClick={handleDelete} className="min-w-0">
                                    <Trash />
                                </Button>
                                <Button color="secondary" onClick={handleEdit} className="min-w-0">
                                    <Pencil />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <AddTemplate isOpen={addTemplate} onClose={() => setAddTemplate(false)} />
        </>
    );
}

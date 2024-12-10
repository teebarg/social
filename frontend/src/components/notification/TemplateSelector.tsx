import { NotificationTemplate } from '@/types/notification';

interface TemplateSelectorProps {
    onSelect: (template: NotificationTemplate) => void;
}

const defaultTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Welcome Message',
      title: 'Welcome to Our Platform! 👋',
      body: `Thank you for joining us. We're excited to have you here!`,
      icon: '🎉'
    },
    {
      id: '2',
      name: 'New Feature Alert',
      title: 'New Feature Available ✨',
      body: 'Check out our latest feature that just launched!',
      icon: '🚀'
    },
    {
      id: '3',
      name: 'Reminder',
      title: 'Don\'t forget! ⏰',
      body: 'You have pending tasks waiting for your attention.',
      icon: '📝'
    }
  ];

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Templates</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {defaultTemplates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template)}
                        className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-start hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <div className="flex-1">
                            <span className="text-2xl mb-2 block">{template.icon}</span>
                            <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{template.title}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

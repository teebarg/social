export type NotificationCreate = {
    title: string;
    body?: string | null;
    group?: string | null;
    users?: number[];
};

export interface NotificationPreview {
    title: string;
    body: string;
    icon?: string;
}

export type NotificationPublic = {
    title: string;
    body?: string | null;
    group?: string | null;
    users?: number[];
};

export type NotificationsPublic = {
    data: Array<NotificationPublic>;
    count: number;
};


export type NotificationTemplateCreate = {
    icon: string;
    title: string;
    body: string;
    excerpt?: string;
};

export type NotificationTemplateUpdate = {
    icon?: string | null;
    title?: string | null;
    body?: string | null;
    excerpt?: string | null;
};

export type NotificationTemplatePublic = {
    id: string;
    icon?: string;
    title: string;
    body: string;
    excerpt: string;
    created_at?: Date;
};

export type NotificationTemplatesPublic = {
    data: Array<NotificationTemplatePublic>;
};

export type NotificationCreate = {
    title: string;
    body?: string | null;
    group?: string | null;
    users?: number[];
};

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
import { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { Message } from "../models";
import {
    NotificationCreate,
    NotificationPublic,
    NotificationsPublic,
    NotificationTemplatesPublic,
    NotificationTemplateUpdate,
    NotificationTemplateCreate,
    NotificationTemplatePublic,
} from "../models/notification.model";

export type TDataRead = {
    limit?: number;
    skip?: number;
};
export type TDataCreateNotification = {
    requestBody: NotificationCreate;
};
export type TDataReadNotification = {
    id: string;
};
export type TDataCreateNotificationTemplate = {
    requestBody: NotificationTemplateCreate;
};
export type TDataUpdateNotificationTemplate = {
    id: string;
    requestBody: NotificationTemplateUpdate;
};
export type TDataDeleteNotification = {
    id: string;
};

export class NotificationsService {
    /**
     * Read Notifications
     * Retrieve notifications.
     * @returns NotificationsPublic Successful Response
     * @throws ApiError
     */
    public static readNotifications(data: TDataRead = {}): CancelablePromise<NotificationsPublic> {
        const { limit = 100, skip = 0 } = data;
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v1/notifications/",
            query: {
                skip,
                limit,
            },
            errors: {
                422: "Validation Error",
            },
        });
    }

    /**
     * Create Notification
     * Create new notification.
     * @returns NotificationPublic Successful Response
     * @throws ApiError
     */
    public static createNotification(data: TDataCreateNotification): CancelablePromise<NotificationPublic> {
        const { requestBody } = data;
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v1/notifications/",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                422: "Validation Error",
            },
        });
    }

    /**
     * Read Notification
     * Get notification by ID.
     * @returns NotificationPublic Successful Response
     * @throws ApiError
     */
    public static readNotification(data: TDataReadNotification): CancelablePromise<NotificationPublic> {
        const { id } = data;
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v1/notifications/{id}",
            path: {
                id,
            },
            errors: {
                422: "Validation Error",
            },
        });
    }

    /**
     * Delete Notification
     * Delete an notification.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static deleteNotification(data: TDataDeleteNotification): CancelablePromise<Message> {
        const { id } = data;
        return __request(OpenAPI, {
            method: "DELETE",
            url: "/api/v1/notifications/{id}",
            path: {
                id,
            },
            errors: {
                422: "Validation Error",
            },
        });
    }

    /**
     * Read NotificationTemplates
     * Retrieve notification templates.
     * @returns NotificationTemplatePublic Successful Response
     * @throws ApiError
     */
    public static readTemplates(data: TDataRead = {}): CancelablePromise<NotificationTemplatesPublic> {
        const { limit = 100, skip = 0 } = data;
        return __request(OpenAPI, {
            method: "GET",
            url: "/api/v1/notifications/templates",
            query: {
                skip,
                limit,
            },
            errors: {
                422: "Validation Error",
            },
        });
    }

    /**
     * Create NotificationTemplate
     * Create new notification template.
     * @returns NotificationTemplatePublic Successful Response
     * @throws ApiError
     */
    public static createTemplate(data: TDataCreateNotificationTemplate): CancelablePromise<NotificationTemplatePublic> {
        const { requestBody } = data;
        return __request(OpenAPI, {
            method: "POST",
            url: "/api/v1/notifications/templates",
            body: requestBody,
            mediaType: "application/json",
            errors: {
                422: "Validation Error",
            },
        });
    }
}

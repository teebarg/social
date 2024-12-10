export interface NotificationTemplate {
    id: string;
    name: string;
    title: string;
    body: string;
    icon?: string;
  }
  
  export interface NotificationPreview {
    title: string;
    body: string;
    icon?: string;
  }
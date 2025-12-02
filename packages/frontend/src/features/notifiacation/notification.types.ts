export interface Notification {
    id: number;
    type: "info" | "error" | "success";
    title: string;
    description: string;
    date: Date;
    isRead: boolean;
}
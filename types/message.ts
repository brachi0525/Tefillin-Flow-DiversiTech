export interface Message {
    id: string;
    title: string;
    content: string;
    fromRole: string;
    toRole: string;
    createdAt: Date;
    updatedAt?: Date;
}
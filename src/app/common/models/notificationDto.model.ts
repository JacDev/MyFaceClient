export class NotificationDto {
    id: string;
    whenAdded: Date;
    hasSeen: boolean
    fromWho: string;
    notificationType: string;
    eventId: string
}
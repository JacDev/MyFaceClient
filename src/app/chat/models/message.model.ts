export class MessageModel {
    id: string;
    toWho: string;
    conversationId: string;
    text: string;
    when: Date;
    fromWho: string;
}
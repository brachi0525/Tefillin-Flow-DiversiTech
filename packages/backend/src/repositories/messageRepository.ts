import { Message } from '../../../../types/message';
import { BaseRepository } from './baseRepository';

export class MessageRepository extends BaseRepository<Message> {
    constructor() {
        super('messages');
    }

    public async getMessagesByUsers(fromRole?: string, toRole?: string): Promise<Message[]> {
        const query: Partial<Message> = {};
        if (fromRole) {
            query.fromRole = fromRole;
        }
        if (toRole) {
            query.toRole = toRole;
        }
        return this.filter(query);
    }
}
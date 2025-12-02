import { Message } from '../../../../types/message';
import { UseMessageDto } from '../dto/message.dto';
import { MessageRepository } from '../repositories/messageRepository';

export class MessageService {
    private messageRepository = new MessageRepository();

    public async getAllMessages(): Promise<Message[]> {
        return this.messageRepository.getAll();
    }

    public async getMessageById(id: string): Promise<Message | null> {
        return this.messageRepository.getById(id);
    }

    public async getMessagesByUsers(fromRole?: string, toRole?: string): Promise<Message[] | null> {
        return this.messageRepository.getMessagesByUsers(fromRole, toRole);
    }

    public async createMessage(dto: UseMessageDto): Promise<Message> {
        const message = await this.messageRepository.insert(dto);
        if (!message) throw new Error('Failed to create message');
        return message;
    }

    public async updateMessage(id: string, dto: UseMessageDto): Promise<Message | null> {
        return this.messageRepository.update(id, dto);
    }

    public async deleteMessage(id: string): Promise<void> {
        return this.messageRepository.delete(id);
    }
}
import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/messageService';
import { UseMessageDto } from '../dto/message.dto';

const messageService = new MessageService();

export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await messageService.getAllMessages();
        res.json(messages);
    } catch (err) {
        next(err);
    }
};

export const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const message = await messageService.getMessageById(id);
        if (!message) res.status(404).json({ error: 'Message not found' });
        res.json(message);
    } catch (err) {

        next(err);
    }
};

export const getMessagesByUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { from_user_id, to_user_id } = req.params;
        const messages = await messageService.getMessagesByUsers(from_user_id, to_user_id);
        if (messages?.length == 0) res.status(404).json({ error: 'There are no messages between these users' });
        res.json(messages);
    } catch (err) {
        next(err);
    }
}

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto: UseMessageDto = req.body;
        const message = await messageService.createMessage(dto);
        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
};

export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const dto: UseMessageDto = req.body;
        const message = await messageService.updateMessage(id, dto);
        if (!message) res.status(404).json({ error: 'Message not found' });
        res.json(message);
    } catch (err) {
        next(err);
    }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await messageService.deleteMessage(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
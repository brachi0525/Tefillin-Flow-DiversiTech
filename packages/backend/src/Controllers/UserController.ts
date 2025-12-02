import { Request, Response, NextFunction } from 'express';
import { userSchema } from '../schemas/userSchema';
import { UserService } from '../services/UserService';
import { BaseRepository } from '../repositories/baseRepository';

const userService = new UserService();


const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1,  sortBy = 'name', sortOrder = 'asc'} = req.query;
    const { filters = {} } = req.body?? {};

        const pageNum = parseInt(page as string, 10);
        const sortDirection = sortOrder === 'desc' ? -1 : 1;

        const users = await userService.getAllUsers({
            filters,
            sort: { [sortBy as string]: sortDirection },
            page: pageNum,
        });

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        if (!user) {
            throw new Error(`User with id ${id} not found`);
            
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getUsersByRole = async (req: Request, res: Response, next : NextFunction) => {
    try{
        const { role } = req.params;        
        const users = await userService.getUsersByRole(role);
        if(!users){
            throw new Error(`No users found with role ${role}`);
        }
        res.status(200).json(users);
    } catch (error){
        next(error)
    }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const parseResult = userSchema.safeParse(userData);

        if (!parseResult.success) throw parseResult.error;
        const newUser = await userService.createUser(userData);

        res.status(201).json({ message: 'User created', user: newUser });

    } catch (error: any) {
        console.log('Error creating user:', error);
        next(error);

    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = await userService.getIdByEmail(id);
        const userData = req.body;
        const parseResult = userSchema.partial().safeParse(userData);
          if (!parseResult.success) throw parseResult.error;
        const updatedUser = await userService.updateUser(userId, userData);

        if (!updatedUser) {
           throw new Error( `User with id ${userId} not found` );
            return;
        }

        res.status(200).json({ message: `User with id ${userId} updated`, user: updatedUser });
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {       
        const { id } = req.params;
        const userId = await userService.getIdByEmail(id);

        const deleted = await userService.deleteUser(userId);      

        if (!deleted) {
           throw new Error( `User with id ${userId} not found` );
            return;
        }

        res.status(200).json({ message: `User with id ${userId} deleted` });
    } catch (error) {
        next(error);
    }
};

export { getUsers, getUserById, getUsersByRole, createUser, updateUser, deleteUser };

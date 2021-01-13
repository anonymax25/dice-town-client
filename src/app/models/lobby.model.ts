import { User } from './user.model';

export class Lobby {
    id: number
    name: string
    code: string
    ownerId: number
    is_private: boolean
    users: User[]
    // created_at: Date
}
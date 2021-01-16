import { Game } from './game.model';
import { User } from './user.model';

export class Lobby {
    id: number
    created_at: Date
    name: string
    code: string
    ownerId: number
    is_private: boolean
    isGameStarted: boolean
    game: Game
    users: User[]
}
import { Lobby } from './lobby.model';

export class User {
  id: number;
  email: string;
  name: string;
  lobbies: Lobby[]
}

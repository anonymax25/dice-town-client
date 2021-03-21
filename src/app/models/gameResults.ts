import { GameStatus } from "./game-status.enum";

export class GameResults {
    constructor(public values: Map<GameStatus,number[]>) {}
}
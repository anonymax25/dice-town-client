import { Inventory } from './inventory'
import { Player } from './player'

export class Game {
    id: number
    gameStarted: boolean
    startTime: Date
    waitingFor: string[]
    sherifUserid: string
    inventory: Inventory
    players: Player[]
}
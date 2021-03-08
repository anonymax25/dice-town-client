import { BadLuck } from './badLuck'
import { GeneralStorms } from './generalStorms'
import { Inventory } from './inventory'
import { Player } from './player'
import { Property } from './property'

export class Game {
    id: number
    startTime: Date
    waitingFor: number[]
    sherifUserid: number
    players: Player[]
    nuggets: number
    dollar: number
    property: Property[]
    generalStorms: GeneralStorms[]
    badLuck: BadLuck[]
}
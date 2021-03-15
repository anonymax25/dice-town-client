import { BadLuck } from "./badLuck"
import { Dice } from "./dice"
import { GeneralStorms } from "./generalStorms"
import { Property } from "./property"

export class Player {
    userId: number
    isReady: boolean
    nuggets: number
    dollar: number
    property: Property[]
    generalStorms: GeneralStorms[]
    BadLuck: BadLuck[]
    dices: Dice[]
    canThrowDices: boolean
}
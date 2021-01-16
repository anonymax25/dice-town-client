import { BadLuck } from "./badLuck"
import { GeneralStorms } from "./generalStorms"
import { Inventory } from "./inventory"
import { Property } from "./property"

export class Player {
    userId: string
    isReady: boolean
    nuggets: number
    dollar: number
    property: Property[]
    generalStorms: GeneralStorms[]
    BadLuck: BadLuck[]
    inventory: Inventory
}
import Phaser from "phaser"

import Gold from "./Gold"
import Meat from "./Meat"

const DropSystem = (scene, posX, posY) => {

    const randNumber = Math.floor(Math.random() * 2 + 1)

    switch (randNumber) {
        case 1:
            new Gold(scene, posX, posY, 'gold', 'goldspawn')
            break;
        case 2:
            new Meat(scene, posX, posY, 'meat', 'meatspawn')
            break;
        default:
            new Gold(scene, posX, posY, 'gold', 'goldspawn')
    }

}

export default DropSystem

import './style.css'
import Phaser from 'phaser'

import GameLoader from './src/scenes/GameLoader'
import Game from './src/scenes/Game'

const config = {
  type: Phaser.AUTO,
  width: 1220,
  height: 900,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [GameLoader, Game]
}

const game = new Phaser.Game(config)
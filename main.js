import './style.css'
import Phaser from 'phaser'

import GameLoader from './src/scenes/GameLoader'
import Game from './src/scenes/Game'
import GameUI from './src/scenes/GameUI'

const tinyswords = document.querySelector('.tinyswords')

const config = {
  type: Phaser.AUTO,
  width: 1220,
  height: 900,
  parent: tinyswords,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [GameLoader, Game, GameUI]
}

const game = new Phaser.Game(config)
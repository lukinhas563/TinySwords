import Phaser from "phaser";


export default class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI', active: true });
        this.player = null

    }

    create() {

        this.game.scene.getScene('Game').events.on('playerData', (player) => {
            this.player = player
            this.playerText = this.add.text(50, 50, `HEALTH: ${this.player.health}`, { fontSize: '30px', fill: '#000' });
            this.playerText2 = this.add.text(50, 100, `GOLD: ${this.player.gold}`, { fontSize: '30px', fill: '#000' });

        });


    }

    update() {

        if (this.player) {
            this.updatePlayerText();
        }
    }

    updatePlayerText() {

        if (this.playerText && this.playerText2) {
            this.playerText.destroy();
            this.playerText2.destroy()
        }

        // Criar novo texto com os dados do jogador
        this.playerText = this.add.text(50, 10, `HEALTH: ${this.player.health}`, { fontSize: '30px', fill: '#000' });
        this.playerText2 = this.add.text(50, 30, `GOLD: ${this.player.gold}`, { fontSize: '30px', fill: '#000' });


    }

}
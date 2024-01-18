import Phaser from "phaser";


export default class GameUI extends Phaser.Scene {
    constructor() {
        super({ key: 'GameUI', active: true });
        this.player = null

    }

    preload() {

        this.load.tilemapTiledJSON('UImap', 'assets/UImap.json')
        this.load.image('bannerhorizontal', 'assets/Tiny Swords (Update 010)/UI/Banners/Banner_Horizontal.png')
        this.load.image('carved', 'assets/Tiny Swords (Update 010)/UI/Banners/Carved_3Slides.png')

    }

    create() {

        const ui = this.make.tilemap({ key: 'UImap' })
        const tiledBanner = ui.addTilesetImage('Banner_Horizontal', 'bannerhorizontal')
        const tileCarved = ui.addTilesetImage('Carved_3Slides', 'carved')

        ui.createLayer('Banner', tiledBanner)
        ui.createLayer('Banner1', tileCarved)

        this.game.scene.getScene('Game').events.on('playerData', (player) => {
            this.player = player
            this.playerText = this.add.text(100, 80, `${this.player.health}`, {
                fontSize: '30px',
                fill: '#000',
                fontFamily: 'sans-serif'
            });
            this.playerText2 = this.add.text(180, 80, `${this.player.gold}`, {
                fontSize: '30px',
                fill: '#000',
                fontFamily: 'sans-serif'
            });

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
        this.playerText = this.add.text(100, 80, `${this.player.health}`, {
            fontSize: '30px',
            fill: '#000',
            fontFamily: 'Comic Sans MS'
        });
        this.playerText2 = this.add.text(180, 80, `${this.player.gold}`, {
            fontSize: '30px',
            fill: '#000',
            fontFamily: 'Comic Sans MS'
        });

    }

}
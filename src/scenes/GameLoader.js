import Phaser from "phaser";

export default class GameLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'GameLoader' })
    }

    preload() {

        //CHARACTER PLAYER
        this.load.spritesheet('player', 'assets/Tiny Swords (Update 010)/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png', { frameWidth: 192, frameHeight: 192 })

        //NPCs
        this.load.spritesheet('partner', 'assets/Tiny Swords (Update 010)/Factions/Knights/Troops/Warrior/Red/Warrior_Red.png', { frameWidth: 192, frameHeight: 192 })
        this.load.spritesheet('citizen', 'assets/Tiny Swords (Update 010)/Factions/Knights/Troops/Pawn/Blue/Pawn_Blue.png', { frameWidth: 192, frameHeight: 192 })
        this.load.spritesheet('sheep', 'assets/Tiny Swords (Update 010)/Resources/Sheep/HappySheep_All.png', { frameWidth: 128, frameHeight: 128 })

        //ENEMYS
        this.load.spritesheet('goblin_torch', 'assets/Tiny Swords (Update 010)/Factions/Goblins/Troops/Torch/Red/Torch_Red.png', { frameWidth: 192, frameHeight: 192 })
        this.load.spritesheet('death', 'assets/Tiny Swords (Update 010)/Factions/Knights/Troops/Dead/Dead.png', { frameWidth: 128, frameHeight: 128 })

        //OBJECTS
        this.load.spritesheet('trees', 'assets/Tiny Swords (Update 010)/Resources/Trees/Tree.png', { frameWidth: 192, frameHeight: 192 })
        this.load.image('house', 'assets/Tiny Swords (Update 010)/Factions/Knights/Buildings/House/House_Blue.png')
        this.load.image('castle', 'assets/Tiny Swords (Update 010)/Factions/Knights/Buildings/Castle/Castle_Blue.png')
        this.load.spritesheet('gold', 'assets/Tiny Swords (Update 010)/Resources/Resources/G_Idle_(NoShadow).png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('goldspawn', 'assets/Tiny Swords (Update 010)/Resources/Resources/G_Spawn.png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('meat', 'assets/Tiny Swords (Update 010)/Resources/Resources/M_Idle_(NoShadow).png', { frameWidth: 128, frameHeight: 128 })
        this.load.spritesheet('meatspawn', 'assets/Tiny Swords (Update 010)/Resources/Resources/M_Spawn.png', { frameWidth: 128, frameHeight: 128 })
        this.load.image('bigbrush', 'assets/Tiny Swords (Update 010)/Deco/09.png')

        //MAP
        this.load.image('water', 'assets/Tiny Swords (Update 010)/Terrain/Water/Water.png')
        this.load.image('waves', 'assets/Tiny Swords (Update 010)/Terrain/Water/Foam/Foam.png')
        this.load.image('ground', 'assets/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Flat.png')
        this.load.image('elevation', 'assets/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Elevation.png')
        this.load.image('bridge', 'assets/Tiny Swords (Update 010)/Terrain/Bridge/Bridge_All.png')
        this.load.image('houses', 'assets/Tiny Swords (Update 010)/Factions/Knights/Buildings/House/House_Blue.png')
        this.load.image('collider', 'assets/Tiny Swords (Update 010)/Terrain/Collider.png')
        this.load.image('rocks', 'assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_04.png')
        this.load.image('rocks1', 'assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_03.png')
        this.load.image('rocks2', 'assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_02.png')
        this.load.image('rocks3', 'assets/Tiny Swords (Update 010)/Deco/04.png')
        this.load.image('brushes', 'assets/Tiny Swords (Update 010)/Deco/09.png')
        this.load.image('colliderHelf', 'assets/Tiny Swords (Update 010)/Terrain/Collider_Min.png')
        this.load.tilemapTiledJSON('map', 'assets/map.json')

        //SOUNDS
        this.load.audio('swing', 'assets/sounds/WHOOSH_ARM_SWING_01.wav')
        this.load.audio('hitheavy', 'assets/sounds/PUNCH_SQUELCH_HEAVY_01.wav')
        this.load.audio('deathsound', 'assets/sounds/Glyph Activation Light 01.wav')
        this.load.audio('mainbattle', 'assets/sounds/Arcade - Battle Network.ogg')
        this.load.audio('torchswing', 'assets/sounds/fireball-whoosh-1-179125.mp3')
        this.load.audio('goldappear', 'assets/sounds/UI Message Appear 01.wav')

        this.load.on('complete', () => {
            this.scene.start('Game')
        })


    }

    create() {


    }

    update() {



    }
}
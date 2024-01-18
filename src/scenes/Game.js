import Phaser from "phaser"
import AnimatedTiles from "phaser-animated-tiles-phaser3.5"

import Player from "../modules/Player"
import Npc from "../modules/Npc"
import Objects from "../modules/Objects"
import Enemy from "../modules/Enemy"
import Gold from "../modules/Drops/Gold"
import Meat from "../modules/Drops/Meat"
import Objects2 from "../modules/Objects2"

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' })
    }

    preload() {

        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles')

    }

    create() {

        //MAP
        const map = this.make.tilemap({ key: 'map' })
        const tileWater = map.addTilesetImage('Water', 'water')
        const tileWaves = map.addTilesetImage('Waves', 'waves')
        const tileGround = map.addTilesetImage('Grass', 'ground')
        const tileElevation = map.addTilesetImage('Elevation', 'elevation')
        const tileBridge = map.addTilesetImage('Bridge', 'bridge')
        const tileRocks = map.addTilesetImage('Rocks', 'rocks')
        const tileRocks1 = map.addTilesetImage('Rocks_1', 'rocks1')
        const tileRocks2 = map.addTilesetImage('Rocks_2', 'rocks2')
        const tileRocks3 = map.addTilesetImage('Rocks_3', 'rocks3')
        const tileCollider = map.addTilesetImage('Collider', 'collider')
        const tileCollider1 = map.addTilesetImage('Collider_Helf', 'colliderHelf')

        map.createLayer('Water', tileWater)
        map.createLayer('Waves', tileWaves)
        map.createLayer('Waves1', tileWaves)
        map.createLayer('Waves2', tileWaves)
        map.createLayer('Sand', tileGround)
        map.createLayer('Elevation', tileElevation)
        map.createLayer('Grass', tileGround)
        map.createLayer('Bridge', tileBridge)
        map.createLayer('Elevation1', tileElevation)
        map.createLayer('Grass1', tileGround)
        map.createLayer('Details', tileGround)
        map.createLayer('DetailsRocks', tileRocks)
        map.createLayer('DetailsRocks1', tileRocks1)
        map.createLayer('DetailsRocks2', tileRocks2)
        map.createLayer('DetailsRocks3', tileRocks3)
        this.collider = map.createLayer('Collision', tileCollider).setAlpha(0)
        this.collider1 = map.createLayer('Collision1', tileCollider1).setAlpha(0)


        this.sys.animatedTiles.init(map); // Map animation

        //AUDIOS
        this.swingSound = this.sound.add('swing')
        this.swingSound.loop = false

        this.hitSound = this.sound.add('hitheavy')
        this.hitSound.loop = false

        this.deathSound = this.sound.add('deathsound')
        this.deathSound.loop = false

        this.torchSwing = this.sound.add('torchswing')
        this.torchSwing.loop = false

        this.goldAppear = this.sound.add('goldappear')
        this.goldAppear.loop = false

        this.running = this.sound.add('running')
        this.running.loop = false

        this.mainBattle = this.sound.add('mainbattle')
        this.mainBattle.loop = true
        this.mainBattle.play()

        //NPC
        this.citizen = new Npc(this, 'citizen', 1000, 400, true)

        //ENEMYS
        this.goblin = new Enemy(this, 'goblin_torch', 1300, 500, true, map)

        //CHARACTER
        this.player = new Player(this, 'player', 250, 700)

        //OBJECTS
        const treeConfig = {
            sizeX: 30,
            sizeY: 30,
            originX: 0.5,
            originY: 0.7,
            offsetX: 80,
            offsetY: 150,
            animations: true
        }
        this.trees = new Objects(this, map, 'TreeSpawn', 'trees', treeConfig.sizeX, treeConfig.sizeY, treeConfig.originX, treeConfig.originY, treeConfig.offsetX, treeConfig.offsetY, treeConfig.animations)

        const houseConfig = {
            sizeX: 75,
            sizeY: 65,
            originX: 0.5,
            originY: 0.6,
            offsetX: 25,
            offsetY: 100,
            animations: false
        }
        this.houses = new Objects(this, map, 'HouseSpawn', 'house', houseConfig.sizeX, houseConfig.sizeY, houseConfig.originX, houseConfig.originY, houseConfig.offsetX, houseConfig.offsetY, houseConfig.animations)

        const castleConfig = {
            sizeX: 270,
            sizeY: 100,
            originX: 0.5,
            originY: 0.7,
            offsetX: 25,
            offsetY: 140,
            animations: false
        }
        this.castles = new Objects(this, map, 'CastleSpawn', 'castle', castleConfig.sizeX, castleConfig.sizeY, castleConfig.originX, castleConfig.originY, castleConfig.offsetX, castleConfig.offsetY, castleConfig.animations)

        const brushConfig = {
            sizeX: 64,
            sizeY: 64,
            originX: 0.5,
            originY: 0.3,
            offsetX: 0,
            offsetY: 0,
            animations: false
        }
        this.bigBrush = new Objects(this, map, 'BrushSpawn', 'bigbrush', brushConfig.sizeX, brushConfig.sizeY, brushConfig.originX, brushConfig.originY, brushConfig.offsetX, brushConfig.offsetY, brushConfig.animations)

        const tree2Config = {
            sizeX: 30,
            sizeY: 30,
            originX: 0.5,
            originY: 0.7,
            offsetX: 80,
            offsetY: 150,
            animations: false
        }
        this.tree2 = new Objects2(this, map, 'TreeSpawn2', 'trees', tree2Config.sizeX, tree2Config.sizeY, tree2Config.originX, tree2Config.originY, tree2Config.offsetX, tree2Config.offsetY, tree2Config.animations)

        const bigpumpkinConfig = {
            sizeX: 64,
            sizeY: 64,
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0,
            animations: false
        }
        this.bigpumpkin = new Objects2(this, map, 'BigPumpkinSpawn', 'bigpumpkin', bigpumpkinConfig.sizeX, bigpumpkinConfig.sizeY, bigpumpkinConfig.originX, bigpumpkinConfig.originY, bigpumpkinConfig.offsetX, bigpumpkinConfig.offsetY, bigpumpkinConfig.animations)

        const smallpumpkinConfig = {
            sizeX: 64,
            sizeY: 64,
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0,
            animations: false
        }
        this.smallpumpkin = new Objects2(this, map, 'SmallPumpkinSpawn', 'smallpumpkin', smallpumpkinConfig.sizeX, smallpumpkinConfig.sizeY, smallpumpkinConfig.originX, smallpumpkinConfig.originY, smallpumpkinConfig.offsetX, smallpumpkinConfig.offsetY, smallpumpkinConfig.animations)


        //COLLISION
        this.collider.setCollisionByProperty({ collider: true })
        this.collider1.setCollisionByProperty({ collider: true })

        this.colliders = [this.collider, this.collider1]

        this.player.createCollision(this, this.colliders)
        this.player.createCollision(this, this.citizen.sprite)

        this.citizen.createCollision(this, this.colliders)
        this.goblin.createCollision(this, this.colliders)
        this.goblin.createCollision(this, this.player.sprite)

        this.trees.createCollision(this, this.player.sprite)
        this.trees.createGroupCollision(this, this.goblin.enemyGroup)
        this.trees.createCollision(this, this.citizen.sprite)

        this.houses.createCollision(this, this.player.sprite)
        this.houses.createCollision(this, this.goblin.sprite)
        this.houses.createCollision(this, this.citizen.sprite)

        this.castles.createCollision(this, this.player.sprite)
        this.castles.createCollision(this, this.goblin.sprite)
        this.castles.createCollision(this, this.citizen.sprite)

        //UI
        this.events.emit('playerData', this.player)

        //CAMERA
        const mapWidth = 1920;
        const mapHeight = 1280;
        const zoom = 1

        this.cameras.main.setZoom(zoom)
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight) // Tamanho da Imagem/mapa
        this.physics.world.setBounds(0, 0, 1920, 1920) // Limite do mundo
        this.cameras.main.startFollow(this.player.sprite)

    }

    update() {

        // PLAYER
        this.player.createMoviment()
        this.player.status()

        //NPC
        this.citizen.status()

        //ENEMY
        this.goblin.status()

        //OBJECTS MOVIMENT
        this.trees.createMoviment()

        //FOREGROUND
        this.children.each(c => {
            const child = c
            child.setDepth(child.y)
        })

    }
}
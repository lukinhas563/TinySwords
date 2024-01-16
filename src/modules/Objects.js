import Phaser from "phaser";

export default class Objects {
    constructor(scene, map, layer, sprite, sizeX, sizeY, originX, originY, offsetX, offsetY, animed) {

        this.scene = scene
        this.map = map
        this.objectSpawn = map.getObjectLayer(layer)

        this.createAnimate(scene, animed)

        this.objectGroup = scene.physics.add.group()
        this.objectSpawn.objects.forEach(spawn => {
            this.object = this.objectGroup.create(spawn.x, spawn.y, sprite).setSize(sizeX, sizeY).setOffset(offsetX, offsetY)
            this.object.setImmovable(true)
            this.object.setOrigin(originX, originY)
        })

    }

    createAnimate(scene, animed) {

        if (animed) {

            scene.anims.create({
                key: 'treeIdle',
                frames: scene.anims.generateFrameNumbers('trees', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });

        } else {

            return

        }

    }

    createMoviment() {

        this.objectGroup.children.iterate(object => {
            object.anims.play('treeIdle', true)
        })

        return

    }

    createCollision(scene, player, citizen, goblin) {


        this.objectGroup.children.iterate(object => {

            scene.physics.add.collider(object, player)

        })

    }

}
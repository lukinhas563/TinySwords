import Phaser from "phaser";

export default class Meat {

    constructor(scene, posX, posY, stringSprite, spriteAnimate) {

        this.stringSprite = stringSprite
        this.scene = scene
        this.posX = posX
        this.posY = posY

        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(40, 40)
        this.sprite.setOffset(50, 55)

        this.createAnimate(scene, spriteAnimate, stringSprite)

        scene.goldAppear.play()
        this.sprite.anims.play('meatAppear', true)

        this.sprite.once('animationcomplete', () => {

            this.sprite.anims.play('meatIdle', true)

            this.scene.tweens.add({
                targets: this.sprite,
                y: this.posY - 10,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            this.createOverlap(scene)

        })

    }

    createAnimate(scene, spriteAnimate, stringSprite) {

        scene.anims.create({

            key: 'meatAppear',
            frames: scene.anims.generateFrameNumbers(spriteAnimate, { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0

        })

        scene.anims.create({

            key: 'meatIdle',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 0, end: 0 }),
            frameRate: 10,
            repeat: 0

        })

    }

    createOverlap(scene) {

        scene.physics.add.overlap(this.sprite, scene.player.sprite, () => {

            scene.goldAppear.play()

            if (scene.player.health < 90) {
                scene.player.health += 10
            } else {
                scene.player.health = 100
            }

            this.sprite.destroy()

        })

    }

}
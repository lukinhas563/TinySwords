import Phaser from "phaser";

import handleAttack from "./Attack";

export default class Player {

    constructor(scene, stringSprite, posX, posY) {

        this.scene = scene
        this.stringSprite = stringSprite
        this.posX = posX
        this.posY = posY

        //STATUS
        this.health = 100
        this.isAlive = true

        this.control = this.scene.input.keyboard.createCursorKeys()

        scene.events.on('npcCollision', (player) => {

            this.health -= 1

        })

        //SPRITE
        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(50, 40).setOffset(70, 90)
        this.createAnimate(scene, stringSprite)

        //ATTACK
        this.possibleattack = [scene.citizen, scene.goblin]
        this.attackDelay = 300
        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: () => handleAttack(this.scene, this.sprite, this.possibleattack),
            loop: false,
            paused: true
        })

    }

    createAnimate(scene, stringSprite) {

        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'attack1',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'death',
            frames: scene.anims.generateFrameNumbers('death', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: 0
        })


    }

    createMoviment() {

        if (this.isAlive === false) {
            return
        }


        const W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        const A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        const S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        const D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        const velocity = 200

        if (this.control.left.isDown || A.isDown) {

            this.sprite.setFlipX(true)
            this.sprite.setVelocityX(-velocity)
            this.sprite.anims.play('right', true)
            return

        } else if (this.control.right.isDown || D.isDown) {

            this.sprite.setFlipX(false)
            this.sprite.setVelocityX(velocity)
            this.sprite.anims.play('right', true)
            return

        } else if (this.control.up.isDown || W.isDown) {

            this.sprite.setVelocityY(-velocity)
            this.sprite.anims.play('right', true)
            return

        } else if (this.control.down.isDown || S.isDown) {

            this.sprite.setVelocityY(velocity)
            this.sprite.anims.play('right', true)
            return

        } else if (this.control.space.isDown) {

            this.sprite.anims.play('attack1', true)
            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)

            this.attackTimer.paused = false;

        } else if (this.control.space.isUp) {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)
            this.sprite.anims.play('idle', true)
            this.attackTimer.paused = true
            this.restartTimerAttack()

        } else {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)
            this.sprite.anims.play('idle', true)

            return
        }

    }

    restartTimerAttack() {

        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: () => handleAttack(this.scene, this.sprite, this.possibleattack),
            callbackScope: this,
            loop: false,
            paused: true
        })

    }

    createCollision(scene, colliders) {

        for (let i = 0; i < colliders.length; i++) {

            scene.physics.add.collider(this.sprite, colliders[i])

        }

    }

    status() {

        if (this.playerText) {
            this.playerText.destroy();
        }

        if (this.health > 0) {

            this.playerText = this.scene.add.text(this.posX, this.posY, `Helth: ${this.health}`, { fontSize: '30px', fill: '#fff' })
            this.playerText.setOrigin(0.5, 1)


            if (this.playerText) {
                this.playerText.setPosition(this.sprite.x, this.sprite.y - 50);
            }

        } else {

            this.dead()

        }

    }

    dead() {

        if (!this.isAlive) {
            return
        }

        this.isAlive = false

        this.sprite.anims.stop()
        this.sprite.setVelocityX(0)
        this.sprite.setVelocityY(0)

        this.sprite.body.destroy()
        this.playerText.destroy()

        this.scene.deathSound.play()
        this.sprite.anims.play('death', true)

        this.scene.time.delayedCall(1300, () => {

            console.log('DEAD')


        }, [], this)


    }

}
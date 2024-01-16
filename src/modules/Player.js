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

        scene.events.on('npcCollision', (player) => {

            this.health -= 1

        })

        //ATTACK
        this.swordHitbox = this.scene.add.rectangle(0, 0, 80, 110)
        this.scene.physics.add.existing(this.swordHitbox)
        this.swordHitbox.body.enable = true
        scene.physics.world.remove(this.swordHitbox.body)

        this.attackDelay = 300
        this.attackTimer = scene.time.addEvent({
            delay: this.attackDelay,
            callback: this.attack,
            callbackScope: this,
            loop: false,
            paused: true
        })

        const possibleattack = [scene.citizen, scene.goblin]

        possibleattack.forEach(target => {

            const attackOverlap = scene.physics.add.overlap(this.swordHitbox, target.sprite, () => {

                if (!this.attacked) {
                    this.scene.hitSound.play()
                    target.health -= 1;
                    this.attacked = true;
                }
            })

        })

        //SPRITE
        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(50, 40).setOffset(70, 90)



        this.createAnimate(scene, stringSprite)

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


    }

    createMoviment() {

        this.control = this.scene.input.keyboard.createCursorKeys()

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
            this.attackTimer.paused = false
            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)

            return

        } else if (this.control.space.isUp && this.attackTimer.getOverallProgress() < 1) {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)
            this.sprite.anims.play('idle', true)
            this.attackTimer.paused = true;
            this.restartTimerAttack()

        } else {

            this.sprite.setVelocityX(0)
            this.sprite.setVelocityY(0)
            this.sprite.anims.play('idle', true)

            return

        }

    }

    attack() {

        this.scene.physics.world.add(this.swordHitbox.body)

        if (this.sprite.flipX) {
            this.swordHitbox.x = this.sprite.x - this.sprite.width * 0.25
        } else {
            this.swordHitbox.x = this.sprite.x + this.sprite.width * 0.25
        }
        this.swordHitbox.y = this.sprite.y - this.sprite.height * 0.1

        this.scene.time.delayedCall(100, () => {
            this.swordHitbox.body.enable = false


            this.scene.swingSound.play() //ARRUMAR


            this.scene.physics.world.remove(this.swordHitbox.body)
            this.attacked = false;
        }, [], this)
        this.restartTimerAttack()

    }

    restartTimerAttack() {

        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: this.attack,
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

        this.playerText = this.scene.add.text(this.posX, this.posY, `Helth: ${this.health}`, { fontSize: '30px', fill: '#fff' })
        this.playerText.setOrigin(0.5, 1)


        if (this.playerText) {
            this.playerText.setPosition(this.sprite.x, this.sprite.y - 50);
        }
    }

}
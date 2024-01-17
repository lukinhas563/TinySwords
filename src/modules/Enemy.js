import Phaser from "phaser";

import handleAttackEnemy from "./AttackEnemy";

export default class Enemy {

    constructor(scene, stringSprite, posX, posY, moviment) {

        this.scene = scene
        this.stringSprite = stringSprite
        this.moviment = moviment

        this.posX = posX
        this.posY = posY

        //STATUS
        this.health = 10
        this.isAlive = true
        this.inBattle = false
        this.isVulnerability = false
        this.isAttacking = false

        //CREATE SPRITE
        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(50, 30).setOffset(70, 90)
        this.sprite.setImmovable(true)

        this.attackDelay = 300
        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: () => handleAttackEnemy(this.scene, this.sprite, this.scene.player),
            loop: false,
            paused: true
        })


        if (this.inBattle) {


            return

        } else {

            this.scene.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.move(this.scene, this.moviment, this.stringSprite)
                },
                loop: true,
                callbackScope: this
            })

        }

        //CREATE FUNCTIONS
        this.createAnimate(scene, stringSprite)

    }

    createAnimate(scene, stringSprite) {

        scene.anims.create({
            key: stringSprite + 'idle',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: stringSprite + 'right',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 7, end: 12 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: stringSprite + 'attack',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 14, end: 19 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: stringSprite + 'death',
            frames: scene.anims.generateFrameNumbers('death', { start: 0, end: 13 }),
            frameRate: 10,
            repeat: 0
        })

    }

    createCollision(scene, collider) {


        /*scene.physics.add.collider(this.sprite, collider, () => {

            scene.events.emit('npcCollision', this.sprite);

        })*/

        scene.physics.add.collider(this.sprite, collider)

    }

    move(scene, moviment, stringSprite) {

        if (this.isAlive === false) {
            return
        }

        if (moviment && this.isAlive) {


            if (this.inBattle) {

                return

            } else {

                const randNumber = Math.floor(Math.random() * 4 + 1)


                switch (randNumber) {
                    case 1:
                        this.sprite.setFlipX(true)
                        this.sprite.setVelocityX(-160)
                        this.sprite.anims.play(stringSprite + 'right', true)
                        break;
                    case 2:
                        this.sprite.setFlipX(false)
                        this.sprite.setVelocityX(160)
                        this.sprite.anims.play(stringSprite + 'right', true)
                        break;
                    case 3:

                        this.sprite.setVelocityY(-160)
                        this.sprite.anims.play(stringSprite + 'right', true)
                        break;
                    case 4:

                        this.sprite.setVelocityY(160)
                        this.sprite.anims.play(stringSprite + 'right', true)
                        break;
                    default:
                        this.sprite.setFlipX(false)
                        this.sprite.setVelocityX(160)
                        this.sprite.anims.play(stringSprite + 'right', true)
                }

                scene.time.addEvent({
                    delay: 500,
                    callback: () => {

                        this.sprite.setVelocityX(0)
                        this.sprite.setVelocityY(0)

                        this.sprite.anims.play(stringSprite + 'idle', true)
                    },
                    callbackScope: this
                })


            }


        } else {

            this.sprite.anims.play(stringSprite + 'idle', true)
            return

        }

    }

    status() {

        if (this.npcText) {

            this.npcText.destroy();

        }


        if (this.health > 0) {

            let distance = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                this.scene.player.sprite.x,
                this.scene.player.sprite.y,
            )

            if (distance <= 300) {

                this.inBattle = true

                this.chasePlayer(distance)

            } else {

                this.inBattle = false

            }

            this.npcText = this.scene.add.text(this.posX, this.posY, `Helth: ${this.health}`, { fontSize: '30px', fill: '#fff' })
            this.npcText.setOrigin(0.5, 1)

            if (this.npcText) {
                this.npcText.setPosition(this.sprite.x, this.sprite.y - 50);
            }


        } else {

            this.dead()

        }


    }

    chasePlayer(distance) {

        const directionX = this.scene.player.sprite.x - this.sprite.x;
        const directionY = this.scene.player.sprite.y - this.sprite.y;

        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;
        const speed = 140;

        if (distance <= 100 && !this.isAttacking && !this.isVulnerability) {

            this.isAttacking = true
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);

            this.scene.torchSwing.play()
            this.sprite.anims.play(this.stringSprite + 'attack', true)

            //ATTACK
            this.possibleattack = this.scene.player.sprite

            this.attackTimer.paused = false

            this.scene.time.delayedCall(700, () => {

                this.isAttacking = false
                this.restartTimerAttack()

            })


        } else if (distance > 100 && !this.isAttacking && !this.isVulnerability) {

            this.sprite.setVelocityX(normalizedDirectionX * speed);
            this.sprite.setVelocityY(normalizedDirectionY * speed);

            if (directionX < 0) {

                this.sprite.setFlipX(true)
                this.sprite.anims.play(this.stringSprite + 'right', true)

            } else {

                this.sprite.setFlipX(false)
                this.sprite.anims.play(this.stringSprite + 'right', true)

            }

        }

    }

    restartTimerAttack() {

        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: () => handleAttackEnemy(this.scene, this.sprite, this.scene.player.sprite),
            loop: false,
            paused: true
        })

    }

    dead() {

        if (!this.isAlive) {
            return
        }

        this.isAlive = false
        this.sprite.clearTint()
        this.sprite.body.destroy()
        this.npcText.destroy()

        this.scene.deathSound.play()
        this.sprite.anims.play(this.stringSprite + 'death', true)

        this.scene.time.delayedCall(1300, () => {

            this.sprite.destroy()

        }, [], this)

    }

}
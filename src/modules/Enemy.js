import Phaser from "phaser";

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

        //CREATED SPRITE
        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(50, 30).setOffset(70, 90)
        this.sprite.setImmovable(true)

        if (this.inBattle) {

            console.log('FIGHT')
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

    createCollision(scene, colliders) {


        scene.physics.add.collider(this.sprite, colliders[2], () => {

            scene.events.emit('npcCollision', this.sprite);


        })

        for (let i = 0; i < colliders.length; i++) {

            scene.physics.add.collider(this.sprite, colliders[i])

        }

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
        const speed = 100;

        if (distance <= 100 && !this.isAttacking) {

            this.isAttacking = true
            this.sprite.setVelocityX(0);
            this.sprite.setVelocityY(0);

            this.sprite.anims.play(this.stringSprite + 'attack', true)

            this.scene.time.delayedCall(700, () => {

                this.isAttacking = false

            })

        } else if (distance > 100 && !this.isAttacking) {

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
import Phaser from "phaser";

export default class Npc {

    constructor(scene, stringSprite, posX, posY, moviment) {

        this.scene = scene
        this.stringSprite = stringSprite
        this.moviment = moviment

        this.posX = posX
        this.posY = posY

        //STATUS
        this.health = 3
        this.isAlive = true
        this.isVunerable = false

        //CREATED SPRITE
        this.sprite = scene.physics.add.sprite(posX, posY, stringSprite).setSize(50, 30).setOffset(70, 90)
        this.sprite.setPushable(false)

        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.move(this.scene, this.moviment, this.stringSprite)
            },
            loop: true,
            callbackScope: this
        })

        //CREATE FUNCTIONS
        this.createAnimate(scene, stringSprite)

    }

    createAnimate(scene, stringSprite) {

        scene.anims.create({
            key: stringSprite + 'idle',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: stringSprite + 'right',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: stringSprite + 'attack',
            frames: scene.anims.generateFrameNumbers(stringSprite, { start: 12, end: 17 }),
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

        /* scene.physics.add.collider(this.sprite, colliders[2], () => {
 
             scene.events.emit('npcCollision', this.sprite);
 
 
         })*/

        scene.physics.add.collider(this.sprite, collider)

    }

    move(scene, moviment, stringSprite) {

        if (this.isAlive === false) {
            return
        }

        if (moviment) {

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


            this.npcText = this.scene.add.text(this.posX, this.posY, `Health: ${this.health}`, { fontSize: '30px', fill: '#fff' })
            this.npcText.setOrigin(0.5, 1)

            if (this.npcText) {
                this.npcText.setPosition(this.sprite.x, this.sprite.y - 50);
            }
        } else {
            this.dead()
            return
        }

    }

    dead() {

        if (!this.isAlive) {
            return
        }

        this.isAlive = false

        this.sprite.body.destroy()
        this.npcText.destroy()

        this.scene.deathSound.play()
        this.sprite.anims.play(this.stringSprite + 'death', true)

        this.scene.time.delayedCall(1300, () => {

            this.sprite.destroy()

        }, [], this)
    }

}
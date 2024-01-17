import Phaser from "phaser";

import handleAttackEnemy from "./AttackEnemy";

export default class Enemy {

    constructor(scene, stringSprite, posX, posY, moviment, map) {

        this.scene = scene
        this.stringSprite = stringSprite
        this.moviment = moviment
        this.enemySpawn = map.getObjectLayer('EnemySpawn')

        this.posX = posX
        this.posY = posY

        //CREATE SPRITE
        this.enemyGroup = scene.physics.add.group()
        this.enemySpawn.objects.forEach(spawn => {

            const enemy = scene.physics.add.sprite(spawn.x, spawn.y, stringSprite).setSize(50, 30).setOffset(70, 90)
            enemy.setPushable(false)

            //STATUS
            enemy.health = 10
            enemy.isAlive = true
            enemy.inBattle = false
            enemy.isVulnerability = false
            enemy.isAttacking = false

            enemy.attackDelay = 300
            enemy.attackTimer = this.scene.time.addEvent({
                delay: enemy.attackDelay,
                callback: () => handleAttackEnemy(this.scene, enemy, this.scene.player),
                loop: false,
                paused: true
            })

            // ADD ENEMY TO GROUP
            this.enemyGroup.add(enemy)

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

        this.enemyGroup.children.iterate(enemy => {

            scene.physics.add.collider(enemy, collider)

        })

    }

    move(scene, moviment, stringSprite) {

        this.enemyGroup.children.iterate(enemy => {

            if (enemy.isAlive === false) {
                return
            }

            if (moviment && enemy.isAlive) {

                if (enemy.inBattle) {

                    return

                } else {

                    const randNumber = Math.floor(Math.random() * 4 + 1)


                    switch (randNumber) {
                        case 1:
                            enemy.setFlipX(true)
                            enemy.setVelocityX(-160)
                            enemy.anims.play(stringSprite + 'right', true)
                            break;
                        case 2:
                            enemy.setFlipX(false)
                            enemy.setVelocityX(160)
                            enemy.anims.play(stringSprite + 'right', true)
                            break;
                        case 3:

                            enemy.setVelocityY(-160)
                            enemy.anims.play(stringSprite + 'right', true)
                            break;
                        case 4:

                            enemy.setVelocityY(160)
                            enemy.anims.play(stringSprite + 'right', true)
                            break;
                        default:
                            enemy.setFlipX(false)
                            enemy.setVelocityX(160)
                            enemy.anims.play(stringSprite + 'right', true)
                    }

                    scene.time.addEvent({
                        delay: 500,
                        callback: () => {

                            enemy.setVelocityX(0)
                            enemy.setVelocityY(0)

                            enemy.anims.play(stringSprite + 'idle', true)
                        },
                        callbackScope: this
                    })

                }

            } else {

                enemy.anims.play(stringSprite + 'idle', true)

                return
            }

        })


    }

    status() {

        this.enemyGroup.children.iterate(enemy => {

            if (enemy.npcText) {

                enemy.npcText.destroy();

            }


            if (enemy.health > 0) {


                let distance = Phaser.Math.Distance.Between(
                    enemy.x,
                    enemy.y,
                    this.scene.player.sprite.x,
                    this.scene.player.sprite.y,
                )

                if (distance <= 300) {

                    enemy.inBattle = true

                    this.chasePlayer(distance, enemy)

                } else {

                    enemy.inBattle = false

                }

                enemy.npcText = this.scene.add.text(enemy.posX, enemy.posY, `Helth: ${enemy.health}`, { fontSize: '30px', fill: '#fff' })
                enemy.npcText.setOrigin(0.5, 1)

                if (enemy.npcText) {
                    enemy.npcText.setPosition(enemy.x, enemy.y - 50);
                }


            } else {

                this.dead(enemy)

            }

        })

    }

    chasePlayer(distance, enemy) {

        const directionX = this.scene.player.sprite.x - enemy.x;
        const directionY = this.scene.player.sprite.y - enemy.y;

        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;
        const speed = 140;

        if (distance <= 100 && !enemy.isAttacking && !enemy.isVulnerability) {

            enemy.isAttacking = true
            enemy.setVelocityX(0);
            enemy.setVelocityY(0);

            this.scene.torchSwing.play()
            enemy.anims.play(this.stringSprite + 'attack', true)

            //ATTACK
            this.possibleattack = this.scene.player.sprite

            // this.attackTimer.paused = false

            this.scene.time.delayedCall(700, () => {

                enemy.isAttacking = false
                this.restartTimerAttack(enemy)

            })


        } else if (distance > 100 && !enemy.isAttacking && !enemy.isVulnerability) {

            enemy.setVelocityX(normalizedDirectionX * speed);
            enemy.setVelocityY(normalizedDirectionY * speed);

            if (directionX < 0) {

                enemy.setFlipX(true)
                enemy.anims.play(this.stringSprite + 'right', true)

            } else {

                enemy.setFlipX(false)
                enemy.anims.play(this.stringSprite + 'right', true)

            }

        }

    }

    restartTimerAttack(enemy) {

        this.attackTimer = this.scene.time.addEvent({
            delay: this.attackDelay,
            callback: () => handleAttackEnemy(this.scene, enemy, this.scene.player.sprite),
            loop: false,
            paused: true
        })

    }

    dead(enemy) {

        if (!enemy.isAlive) {
            return
        }

        enemy.isAlive = false
        enemy.clearTint()
        enemy.body.destroy()
        enemy.npcText.destroy()

        this.scene.deathSound.play()
        enemy.anims.play(this.stringSprite + 'death', true)

        this.scene.time.delayedCall(1300, () => {

            enemy.destroy()

        }, [], this)

    }

}
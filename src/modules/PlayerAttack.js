import Phaser from "phaser";

export default class PlayerAttack {

    constructor(scene, attacker, targets) {

        const control = scene.input.keyboard.createCursorKeys()
        this.spacePressed = control.space.isDown
        this.spaceUp = control.space.isUp
        this.scene = scene
        this.attacker = attacker
        this.targets = targets

        //TIMERS
        this.repeatAttack = scene.time.addEvent({
            delay: 600,
            callback: () => {

                new PlayerAttack(scene, attacker, targets)

            },
            loop: false,
            paused: true
        })

        //STATUS
        this.attacking = false

        if (!this.attacking && this.spacePressed) {

            this.attackHitBox = scene.add.rectangle(0, 0, 80, 110)
            scene.physics.add.existing(this.attackHitBox)

            this.attackHitBox.body.enable = true
            scene.physics.world.remove(this.attackHitBox.body)

            targets.forEach(target => {

                if (target instanceof Phaser.GameObjects.Group) {

                    target.children.iterate((individualTarget) => {
                        scene.physics.add.overlap(this.attackHitBox, individualTarget, () => {


                            this.handleOverlap(individualTarget, scene, attacker)

                        })
                    })

                } else {

                    scene.physics.add.overlap(this.attackHitBox, target.sprite, () => {

                        this.handleOverlap(target, scene, attacker)

                    })

                }

            })

            this.attack(scene, this.attackHitBox, attacker, this.attacking, targets, this.spaceUp)

        } else {
            this.attacking = false
        }

    }

    handleOverlap(target, scene, attacker) {

        scene.hitSound.play()

        if (!target.isVulnerability) {


            target.isVulnerability = true

            if (target.sprite) {

                target.health -= 1;
                this.attacking = true;

                //RED GLOW
                target.sprite.setTint(0xff0000)

                const pushForce = 600
                const direction = Phaser.Math.Angle.BetweenPoints(attacker, target.sprite)
                const pushVector = new Phaser.Math.Vector2(Math.cos(direction), Math.sin(direction)).scale(pushForce)
                target.sprite.setVelocity(pushVector.x, pushVector.y)


                scene.time.delayedCall(100, () => {
                    target.sprite.setVelocity(0, 0)
                    target.isVulnerability = false
                    target.sprite.clearTint()
                    this.attacking = false;
                })

            } else {

                target.health -= 1;
                this.attacking = true;
                target.isVulnerability = true

                target.setTint(0xff0000)

                const pushForce = 600
                const direction = Phaser.Math.Angle.BetweenPoints(attacker, target)
                const pushVector = new Phaser.Math.Vector2(Math.cos(direction), Math.sin(direction)).scale(pushForce)
                target.setVelocity(pushVector.x, pushVector.y)

                scene.time.delayedCall(100, () => {
                    target.setVelocity(0, 0)
                    target.isVulnerability = false
                    target.clearTint()
                    this.attacking = false;
                })

            }

        }

    }

    attack() {

        this.scene.physics.world.add(this.attackHitBox.body)

        if (this.attacker.flipX) {

            this.attackHitBox.x = this.attacker.x - this.attacker.width * 0.25

        } else {

            this.attackHitBox.x = this.attacker.x + this.attacker.width * 0.25

        }

        this.attackHitBox.y = this.attacker.y - this.attacker.height * 0.1


        this.scene.time.delayedCall(100, () => {

            this.attackHitBox.body.enable = false
            this.scene.swingSound.play()
            this.scene.physics.world.remove(this.attackHitBox.body)
            this.attacking = false;
            console.log(this.attacking)

        }, [], this)

        if (!this.spaceUp) {
            // this.repeatAttack.paused = false
        } else {
            this.resetAttack()
        }

    }

    resetAttack() {

        this.repeatAttack = this.scene.time.addEvent({
            delay: 600,
            callback: () => {

                new PlayerAttack(this.scene, this.attacker, this.targets)

            },
            loop: false,
            paused: true
        })
    }

}
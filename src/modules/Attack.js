import Phaser from "phaser";

let attacked = false
let currentAttack = false;
const attackDelay = 300

const handleAttack = (scene, attacker, targets) => {

    const control = scene.input.keyboard.createCursorKeys()
    let spacePressed = control.space.isDown


    if (!attacked && spacePressed) {

        attacked = true

        const attackHitBox = scene.add.rectangle(0, 0, 80, 110)
        scene.physics.add.existing(attackHitBox)

        attackHitBox.body.enable = true
        scene.physics.world.remove(attackHitBox.body)


        targets.forEach(target => {

            if (target instanceof Phaser.GameObjects.Group) {

                target.children.iterate((individualTarget) => {
                    scene.physics.add.overlap(attackHitBox, individualTarget, () => {


                        handleOverlap(individualTarget, scene, attacker)

                    })
                })

            } else {

                scene.physics.add.overlap(attackHitBox, target.sprite, () => {

                    handleOverlap(target, scene, attacker)

                })

            }

        })

        scene.time.delayedCall(0, () => {
            attack(scene, attackHitBox, attacker, attacked, targets)
        })

        scene.time.delayedCall(100, () => {
            attacked = false

        })

        attacked = true;
    }


}

const handleOverlap = (target, scene, attacker) => {

    scene.hitSound.play()

    if (!target.isVulnerability) {


        target.isVulnerability = true

        if (target.sprite) {

            target.health -= 1;
            attacked = true;

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
                attacked = false;
            })

        } else {

            target.health -= 1;
            attacked = true;
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
                attacked = false;
            })

        }

    }
}

const attack = (scene, attackHitBox, attacker, attacked, targets) => {

    scene.physics.world.add(attackHitBox.body)

    if (attacker.flipX) {

        attackHitBox.x = attacker.x - attacker.width * 0.25

    } else {

        attackHitBox.x = attacker.x + attacker.width * 0.25

    }

    attackHitBox.y = attacker.y - attacker.height * 0.1


    scene.time.delayedCall(100, () => {

        attackHitBox.body.enable = false
        scene.swingSound.play()
        scene.physics.world.remove(attackHitBox.body)
        attacked = false;
        console.log(attacked)

    }, [], this)


    scene.time.addEvent({
        delay: 600,
        callback: () => {

            handleAttack(scene, attacker, targets)

        },
        loop: false,
    })

}

export default handleAttack
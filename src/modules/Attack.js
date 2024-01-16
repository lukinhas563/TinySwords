import Phaser from "phaser";

let attacked = false
const attackDelay = 300

const handleAttack = (scene, attacker, targets) => {

    if (!scene || !attacker || !targets) {

        return
    }

    const attackHitBox = scene.scene.add.rectangle(0, 0, 80, 110)
    scene.physics.add.existing(attackHitBox)
    attackHitBox.body.enable = true
    scene.physics.world.remove(attackHitBox.body)

    targets.forEach(target => {

        const attackOverlap = scene.physics.add.overlap(attackHitBox, target.sprite, () => {

            if (!attacked) {
                scene.hitSound.play()
                target.health -= 1;
                attacked = true;
            }

        })

    })


    const attackTimer = scene.time.addEvent({
        delay: attackDelay,
        callback: attack(scene, attackHitBox, attacker, attacked),
        loop: false,
        paused: true
    })

}

const attack = (scene, attackHitBox, attacker, attacked) => {

    scene.physics.world.add(attackHitBox.body)

    if (attacker.flipX) {

        attackHitBox.x = attacker.x - attacker.width * 0.25

    } else {

        attackHitBox.x = attacker.x + attacker.width * 0.25

    }

    attackHitBox.y = attacker.y - attacker.height * 0.1

    scene.time.delayedCall(100, () => {
        attackHitBox.body.enable = false


        scene.swingSound.play() //ARRUMAR


        scene.physics.world.remove(attackHitBox.body)
        attacked = false;

    }, [], this)

    restartTimerAttack()

}

const restartTimerAttack = () => {

    attackTimer = scene.time.addEvent({
        delay: attackDelay,
        callback: attack,
        loop: false,
        paused: true
    })
}

export default handleAttack
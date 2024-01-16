import Phaser from "phaser";

let attacked = false
const attackDelay = 300

const handleAttack = (scene, attacker, targets) => {

    const control = scene.input.keyboard.createCursorKeys()
    let spacePressed = control.space.isDown

    if (!attacked && spacePressed) {
        console.log('ATACOU')

        const attackHitBox = scene.add.rectangle(0, 0, 80, 110)
        scene.physics.add.existing(attackHitBox)

        attackHitBox.body.enable = true
        scene.physics.world.remove(attackHitBox.body)

        targets.forEach(target => {

            scene.physics.add.overlap(attackHitBox, target.sprite, () => handleOverlap(target, scene))

        })

        let attackTimer = scene.time.addEvent({
            delay: attackDelay,
            callback: attack(scene, attackHitBox, attacker, attacked, targets),
            loop: false,
            paused: true
        })

    }

}

const handleOverlap = (target, scene) => {

    if (!attacked) {

        scene.hitSound.play()
        target.health -= 1;
        attacked = true;
        console.log('DAMAGE')


        scene.time.delayedCall(attackDelay, () => {
            attacked = false;
        });

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

    }, [], this)


    scene.time.addEvent({
        delay: 600,
        callback: () => { handleAttack(scene, attacker, targets) },
        loop: false,
    })

}

export default handleAttack

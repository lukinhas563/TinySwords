import Phaser from "phaser";

let attacked = false
const attackDelay = 300

const handleAttackEnemy = (scene, attacker, target) => {


    if (!attacked) {

        const enemyAttackHitbox = scene.add.rectangle(0, 0, 80, 110)
        scene.physics.add.existing(enemyAttackHitbox)

        enemyAttackHitbox.body.enable = true
        scene.physics.world.remove(enemyAttackHitbox.body)


        console.log('DAMAGE', target)
        scene.physics.add.overlap(enemyAttackHitbox, target, () => handleOverlap(target, scene, attacker))


        scene.time.addEvent({
            delay: attackDelay,
            callback: attack(scene, enemyAttackHitbox, attacker, attacked, target),
            loop: false,
            paused: true
        })

    }

}

const handleOverlap = (target, scene, attacker) => {

    if (!attacked) {

        scene.hitSound.play()
        target.health -= 1;
        attacked = true;
        target.isVulnerability = true

        //RED GLOW
        target.sprite.setTint(0xff0000)

        scene.time.delayedCall(100, () => {
            target.sprite.clearTint()
            attacked = false;
        });

        const pushForce = 600
        const direction = Phaser.Math.Angle.BetweenPoints(attacker, target.sprite)
        const pushVector = new Phaser.Math.Vector2(Math.cos(direction), Math.sin(direction)).scale(pushForce)
        target.sprite.setVelocity(pushVector.x, pushVector.y)

        scene.time.delayedCall(100, () => {
            target.sprite.setVelocity(0, 0)
            target.isVulnerability = false
        })
    }

}

const attack = (scene, attackHitBox, attacker, attacked, target) => {

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
        callback: () => { handleAttackEnemy(scene, attacker, target) },
        loop: false,
    })

}

export default handleAttackEnemy

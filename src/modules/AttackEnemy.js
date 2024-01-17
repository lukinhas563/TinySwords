import Phaser from "phaser";

let attacked = false
const attackDelay = 100

const handleAttackEnemy = (scene, attacker, target) => {

    if (!attacked) {
        console.log('ATAQUE')
        const enemyAttackHitbox = scene.add.rectangle(0, 0, 80, 110)
        scene.physics.add.existing(enemyAttackHitbox)

        enemyAttackHitbox.body.enable = true
        scene.physics.world.remove(enemyAttackHitbox.body)

        scene.physics.add.overlap(enemyAttackHitbox, target, () => handleOverlap(target, scene, attacker))

        scene.time.delayedCall(attackDelay, () => {
            attack(scene, enemyAttackHitbox, attacker, attacked, target)
        })

    }

}

const handleOverlap = (target, scene, attacker) => {

    if (!attacked) {

        scene.hitSound.play()
        scene.player.health -= 1
        attacked = true;
        scene.player.isVulnerability = true

        scene.player.sprite.setTint(0xff0000)

        const pushForce = 600
        const direction = Phaser.Math.Angle.BetweenPoints(attacker, scene.player.sprite)
        const pushVector = new Phaser.Math.Vector2(Math.cos(direction), Math.sin(direction)).scale(pushForce)
        scene.player.sprite.setVelocity(pushVector.x, pushVector.y)

        scene.time.delayedCall(100, () => {

            attacked = false
            scene.player.sprite.clearTint()
            scene.player.isVulnerability = false
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
        scene.physics.world.remove(attackHitBox.body)

        attacked = false


    }, [], this)

}

export default handleAttackEnemy

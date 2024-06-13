import { _decorator, Component, EventTouch, Input, input, log, Node, ParticleSystem, SkeletalAnimation, tween, Tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
import { Break } from './Break';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(UIManager)
    uiManager: UIManager = null;
    @property(GameManager)
    manager: GameManager = null;

    @property(ParticleSystem)
    jumpVfx: ParticleSystem = null;
    @property(Node)
    winVfx: Node = null;

    // Rock
    @property(Node)
    rock1: Node = null;
    @property(Node)
    rock2: Node = null;
    @property(Node)
    rock3: Node = null;
    @property(Node)
    rock4: Node = null;
    @property(Node)
    rock5: Node = null;
    @property(Node)
    rock6: Node = null;

    @property(Node)
    rockHints: Node = null;

    @property(Node)
    playerPos: Node = null;

    isGameover = false;
    isDeath = false;
    isWon = false;
    isRound1Finished = false;
    isRound2Finished = false;
    isRound3Finished = false;
    isRound4Finished = false;
    isRound5Finished = false;
    isRound6Finished = false;
    isRound7Finished = false;
    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;
    private tweenThen4!: Tween<Node>;
    private tweenThen5!: Tween<Node>;
    private tweenThen6!: Tween<Node>;

    public stateX: number = 0;  // 1 positive, 0 static, -1 negative


    start() {

    }

    update(deltaTime: number) {
        if (this.isDeath == true && this.isGameover == false) {
            this.isGameover = true;
            this.scheduleOnce(this.onLoseSchedule, 1.5);
        }
        else if (this.isWon == true && this.isGameover == false) {
            this.isGameover = true;
            this.scheduleOnce(this.onWinSchedule, 2);
        }

        this.playerPos.setPosition(new Vec3(this.playerPos.position.x, this.playerPos.position.y, this.node.position.z));
    }

    onLoseSchedule() {
        this.uiManager.losePopup1.active = true;
        this.uiManager.losePopup2.active = true;
        this.uiManager.cta.active = true;
        this.uiManager.loseSfx.play();
    }
    onWinSchedule() {
        this.uiManager.winPopup1.active = true;
        this.uiManager.winPopup2.active = true;
        this.uiManager.cta.active = true;
    }

    onLeftBtn() {
        if (this.uiManager.tutorial2.active == true || this.uiManager.tutorial1.active == true) {
            this.uiManager.tutorial2.active = false;
            this.uiManager.tutorial1.active = false;

            this.rockHints.active = false;
        }
        this.uiManager.joycon1.active = false;
        this.uiManager.joycon2.active = false;

        // Round 1
        if (this.manager.isRound1 == false && this.isDeath == false) {
            this.manager.isRound1 = true;
            this.round1Left();
        }
        // Round 2
        else if (this.manager.isRound1 == true && this.manager.isRound2 == false && this.isDeath == false) {
            this.manager.isRound2 = true;
            this.round2Left();
        }
        // Round 3
        else if (this.manager.isRound2 == true && this.manager.isRound3 == false && this.isDeath == false) {
            this.manager.isRound3 = true;
            this.round3Left();
        }
        // Round 4
        else if (this.manager.isRound3 == true && this.manager.isRound4 == false && this.isDeath == false) {
            this.manager.isRound4 = true;
            this.round4Left();
        }
        // Round 5
        else if (this.manager.isRound4 == true && this.manager.isRound5 == false && this.isDeath == false) {
            this.manager.isRound5 = true;
            this.round5Left();
        }
        // Round 6
        else if (this.manager.isRound5 == true && this.manager.isRound6 == false && this.isDeath == false) {
            this.manager.isRound6 = true;
            this.round6Left();
        }
    }

    onRightBtn() {
        if (this.uiManager.tutorial2.active == true || this.uiManager.tutorial1.active == true) {
            this.uiManager.tutorial2.active = false;
            this.uiManager.tutorial1.active = false;

            this.rockHints.active = false;
        }
        this.uiManager.joycon2.active = false;
        this.uiManager.joycon1.active = false;

        // Round 1
        if (this.manager.isRound1 == false && this.isDeath == false) {
            this.manager.isRound1 = true;
            this.round1Right();
        }
        // Round 2
        else if (this.isRound1Finished == true && this.manager.isRound2 == false && this.isDeath == false) {
            this.manager.isRound2 = true;
            this.round2Right();
        }
        // Round 3
        else if (this.isRound2Finished == true && this.manager.isRound3 == false && this.isDeath == false) {
            this.manager.isRound3 = true;
            this.round3Right();
        }
        // Round 4
        else if (this.isRound3Finished == true && this.manager.isRound4 == false && this.isDeath == false) {
            this.manager.isRound4 = true;
            this.round4Right();
        }
        // Round 5
        else if (this.isRound4Finished == true && this.manager.isRound5 == false && this.isDeath == false) {
            this.manager.isRound5 = true;
            this.round5Right();
        }
        // Round 6
        else if (this.isRound5Finished == true && this.manager.isRound6 == false && this.isDeath == false) {
            this.manager.isRound6 = true;
            this.round6Right();
        }
    }

    round1Left() {
        let rotate = tween().to(0.2, { eulerAngles: new Vec3(0, 220, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.4, { position: new Vec3(-0.713, 1.656, 3.454) }, { easing: 'smooth' });
        let jump2 = tween().to(0.8, { position: new Vec3(-1.397, -3.138, 1.571) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(-1.349, -9.217, 1.571) }, { easing: 'smooth' });
        this.tweenThen = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                // this.playerPos.setPosition(new Vec3(this.node.position.x, this.node.position.y, this.node.position.z));
                // this.manager.mainCamera.setParent(this.playerPos);
                // this.manager.mainCamera2.setParent(this.playerPos);
                this.isRound1Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round1Right() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 160, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.027, -0.138, 1.571) }, { easing: 'smooth' });
        this.tweenThen = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
                // this.playerPos.setPosition(new Vec3(this.node.position.x, this.node.position.y, this.node.position.z));
                // this.manager.mainCamera.setParent(this.playerPos);
                // this.manager.mainCamera2.setParent(this.playerPos);
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .then(rotate2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound1Finished = true;
                this.uiManager.joycon2.active = true;
                this.uiManager.joycon1.active = true;
            })
            .start();
    }
    round2Left() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 210, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(-0.363, 1.007, -0.575) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -1.973) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(-1.349, -9.217, -1.973) }, { easing: 'smooth' });
        this.tweenThen2 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.isRound2Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round2Right() {
        let jump1 = tween().to(0.3, { position: new Vec3(1.027, 1.007, -0.575) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        this.tweenThen2 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound2Finished = true;
                this.uiManager.joycon2.active = true;
                this.uiManager.joycon1.active = true;
            })
            .start();
    }
    round3Left() {
        let jump1 = tween().to(0.3, { position: new Vec3(-0.363, 1.007, -3.832) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -5.375) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(-1.349, -9.217, -5.375) }, { easing: 'smooth' });
        this.tweenThen3 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump1)
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.isRound3Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round3Right() {
        let jump1 = tween().to(0.3, { position: new Vec3(1.027, 1.007, -3.832) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -5.375) }, { easing: 'smooth' });

        this.tweenThen3 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound3Finished = true;
                this.uiManager.joycon2.active = true;
                this.uiManager.joycon1.active = true;
            })
            .start();
    }
    round4Left() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 210, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(-1.349, 1.007, -7.203) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -8.775) }, { easing: 'smooth' });
        this.tweenThen4 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .then(rotate2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound4Finished = true;
                this.uiManager.joycon2.active = true;
                this.uiManager.joycon1.active = true;
            })
            .start();
    }
    round4Right() {
        let jump1 = tween().to(0.3, { position: new Vec3(1.027, 1.007, -7.203) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -8.775) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(0.917, -15, -8.775) }, { easing: 'smooth' });
        this.tweenThen4 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump1)
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.isRound4Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round5Left() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 210, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(-1.349, 1.007, -10.733) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -12.149) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(-1.349, -15, -12.149) }, { easing: 'smooth' });
        this.tweenThen5 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .then(jump2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.isRound5Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round5Right() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 160, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(0.125, 1.007, -10.733) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.105, -0.138, -12.149) }, { easing: 'smooth' });
        this.tweenThen5 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .then(rotate2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound5Finished = true;
                this.uiManager.joycon2.active = true;
                this.uiManager.joycon1.active = true;
            })
            .start();
    }
    round6Left() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 210, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(-0.173, 1.007, -14.273) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -15.368) }, { easing: 'smooth' });
        let fall = tween().to(2, { position: new Vec3(-1.239, -15, -15.368) }, { easing: 'smooth' });
        this.tweenThen6 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .then(rotate2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
            })
            .delay(0.3)
            .call(() => {
                this.rock6.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.node.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock6.active = false;
                this.isRound6Finished = true;
                this.isDeath = true;
            })
            .then(fall)
            .start();
    }
    round6Right() {
        let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 160, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let rotate3 = tween().to(0.1, { eulerAngles: new Vec3(0, 210, 0) }, { easing: 'smooth' });
        let rotate4 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
        let jump1 = tween().to(0.3, { position: new Vec3(1.105, 1.007, -14.233) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.105, -0.138, -15.46) }, { easing: 'smooth' });
        let jump3 = tween().to(0.3, { position: new Vec3(0.651, 1.007, -17.975) }, { easing: 'smooth' });
        let jump4 = tween().to(0.4, { position: new Vec3(0.125, 0.082, -19.744) }, { easing: 'smooth' });
        this.tweenThen6 = tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump2)
            .then(rotate2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
                this.isRound6Finished = true;
            })
            .delay(0.3)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(rotate3)
            .then(jump3)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump4)
            .then(rotate4)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('idle');
                this.jumpVfx.play();
            })
            .delay(0.2)
            .call(() => {
                this.node.getComponent(SkeletalAnimation).play('dance');
                this.uiManager.winSfx.play();
                this.isRound6Finished = true;
                this.isWon = true;
                this.winVfx.active = true;
            })
            .start();
    }
}


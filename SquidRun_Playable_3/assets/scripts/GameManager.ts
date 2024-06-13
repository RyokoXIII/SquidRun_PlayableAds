import { _decorator, Component, Node, ParticleSystem, SkeletalAnimation, Tween, tween, Vec3, view } from 'cc';
import { UIManager } from './UIManager';
import { Break } from './Break';
const { ccclass, property } = _decorator;


@ccclass('GameManager')
export class GameManager extends Component {

    @property(UIManager)
    uiManager: UIManager = null;
    @property(Node)
    mainCamera: Node = null;
    @property(Node)
    mainCamera2: Node = null;
    @property(Node)
    subCamera: Node = null;
    @property(Node)
    subCamera2: Node = null;

    @property(Node)
    player: Node = null;
    @property(Node)
    huggy: Node = null;
    @property(ParticleSystem)
    jumpVfx: ParticleSystem = null;

    @property(Node)
    rock1: Node = null;

    public isStart = false;
    public isIntro = false;
    public playerIsReady = false;
    public isRound1 = false;
    public isRound2 = false;
    public isRound3 = false;
    public isRound4 = false;
    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;


    start() {
        this.onIntroStart();
    }

    update(deltaTime: number) {
        // Check Device orientation
        var frameSize = view.getVisibleSize();
        if (frameSize.height > frameSize.width) {
            // portrait
            this.uiManager.portraitUI.active = true;
            this.uiManager.landscapeUI.active = false;
            this.mainCamera.active = false;
            this.mainCamera2.active = true;

            if (this.isIntro == false) {
                this.subCamera.active = false;
                this.subCamera2.active = true;
            }
        }
        else if (frameSize.height < frameSize.width) {
            // landscape
            this.uiManager.portraitUI.active = false;
            this.uiManager.landscapeUI.active = true;
            this.mainCamera.active = true;
            this.mainCamera2.active = false;

            if (this.isIntro == false) {
                this.subCamera.active = true;
                this.subCamera2.active = false;
            }
        }
    }

    onIntroStart() {
        if (this.isStart == false) {
            this.isStart = true;

            // Move camera
            let move = tween().to(2, { position: new Vec3(0, 6.306, -10.594) }, { easing: 'smooth' });
            this.tweenThen = tween(this.subCamera2)
                .delay(1.5)
                .call(() => {
                    this.uiManager.levelTitle1.active = false;
                    this.uiManager.levelTitle2.active = false;
                })
                .then(move)
                .delay(0.3)
                .call(() => {
                    this.subCamera2.active = false;
                    this.isIntro = true;
                })
                .start();

            let move22 = tween().to(2, { position: new Vec3(0, 4.392, -6.373) }, { easing: 'smooth' });
            this.tweenThen3 = tween(this.subCamera)
                .delay(1.5)
                .call(() => {
                    this.uiManager.levelTitle1.active = false;
                    this.uiManager.levelTitle2.active = false;
                })
                .then(move22)
                .delay(0.3)
                .call(() => {
                    this.subCamera.active = false;
                    this.isIntro = true;
                })
                .start();

            // Move Huggy
            let move2 = tween().to(1, { position: new Vec3(-0.14, 0, 5.381) }, { easing: 'smooth' });
            let rotate = tween().to(0.1, { eulerAngles: new Vec3(0, 150, 0) }, { easing: 'smooth' });
            let rotate2 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
            let rotate3 = tween().to(0.1, { eulerAngles: new Vec3(0, 220, 0) }, { easing: 'smooth' });
            let rotate4 = tween().to(0.1, { eulerAngles: new Vec3(0, 180, 0) }, { easing: 'smooth' });
            let jump1 = tween().to(0.4, { position: new Vec3(-1.024, 1.656, 3.454) }, { easing: 'smooth' });
            let jump2 = tween().to(0.4, { position: new Vec3(-1.453, -0.157, 1.459) }, { easing: 'smooth' });
            let fall = tween().to(2, { position: new Vec3(-1.453, -9.217, 1.459) }, { easing: 'smooth' });
            this.tweenThen = tween(this.huggy)
                .delay(4)
                .then(rotate)
                .call(() => {
                    this.huggy.getComponent(SkeletalAnimation).play('run');
                })
                .then(move2)
                .then(rotate2)
                .call(() => {
                    this.huggy.getComponent(SkeletalAnimation).play('idle');
                })
                .delay(0.5)
                .call(() => {
                    this.huggy.getComponent(SkeletalAnimation).play('jump');
                })
                .delay(0.3)
                .then(rotate3)
                .then(jump1)
                .call(() => {
                    this.uiManager.jumpSfx.play();
                })
                .then(jump2)
                .then(rotate4)
                .call(() => {
                    this.huggy.getComponent(SkeletalAnimation).play('idle');
                    this.jumpVfx.play();
                })
                .delay(0.3)
                .call(() => {
                    this.rock1.getComponent(Break).breakRock();
                    this.uiManager.rockSfx.play();
                    this.huggy.getComponent(SkeletalAnimation).play('fall');
                    this.uiManager.deathSfx.play();
                    this.rock1.active = false;
                })
                .then(fall)
                .start();

            // Move Player
            let move3 = tween().to(1, { position: new Vec3(-0.272, 0, 5.456) }, { easing: 'smooth' });
            this.tweenThen2 = tween(this.player)
                .delay(8)
                .call(() => {
                    this.player.getComponent(SkeletalAnimation).play('run');
                })
                .then(move3)
                .call(() => {
                    this.player.getComponent(SkeletalAnimation).play('idle');
                })
                .delay(0.5)
                .call(() => {
                    this.playerIsReady = true;
                    this.uiManager.gameCtrlPopup.active = true;
                    this.uiManager.gameCtrlPopup2.active = true;
                })
                .start();
        }
    }
}


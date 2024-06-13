
import { _decorator, AudioSource, Component, getPathFromRoot, Label, Node, Quat, random, randomRangeInt, SkeletalAnimation, tween, Tween, Vec3, view } from 'cc';
import { UIManager } from './UIManager';
import { PlayerController } from './PlayerController';
import { CTA } from './CTA';
const { ccclass, property } = _decorator;
declare var window;


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
    doll: Node = null;
    @property(Node)
    dollBullet: Node = null;

    @property(Node)
    round1Bullet: Node = null;
    @property(Node)
    round2Bullet: Node = null;

    // AI Pos
    @property([Node])
    round1GreenList: Node[] = [];
    @property([Node])
    round1RedList: Node[] = [];
    @property([Node])
    round2GreenList: Node[] = [];
    @property([Node])
    round2RedList: Node[] = [];

    @property([Node])
    round3List: Node[] = [];

    @property([Node])
    greenBot1List: Node[] = [];
    @property([Node])
    redBot1List: Node[] = [];
    @property([Node])
    greenBot2List: Node[] = [];
    @property([Node])
    redBot2List: Node[] = [];

    @property([Node])
    bot3List: Node[] = [];

    // Audio
    @property(AudioSource)
    dollSong: AudioSource = null;
    @property(AudioSource)
    shootSfx: AudioSource = null;
    @property(AudioSource)
    hitSfx: AudioSource = null;
    @property(AudioSource)
    public hitPlayerSfx: AudioSource = null;
    @property(AudioSource)
    runSfx: AudioSource = null;
    @property(AudioSource)
    public winMusic: AudioSource = null;
    @property(AudioSource)
    public loseMusic: AudioSource = null;
    @property(AudioSource)
    countdownMusic: AudioSource = null;

    @property(Node)
    public cta: Node = null;

    public countdownNum = 3;
    public timeNum = 59;
    public isStart = false;
    public isStartRound1 = false;
    public isRound1 = false;
    public isRound2 = false;
    public isRound2Start = false;
    public isRound3 = false;
    public isRound3Start = false;
    public isRound4Start = false;
    public isFinished = false;
    public isDetected = false;
    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;
    private tweenThen4!: Tween<Node>;
    private tweenThen5!: Tween<Node>;
    private tweenThen6!: Tween<Node>;


    onLoad() {
        window.gameReady && window.gameReady();
    }

    start() {
        this.uiManager.gameStartPopup.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    // Countdown
    startCountdown() {
        this.uiManager.countdownText.string = this.countdownNum.toString();
        this.uiManager.countdownText2.string = this.countdownNum.toString();
        this.countdownMusic.play();
        this.schedule(this.countDownSchedule, 1);
    }
    countDownSchedule() {
        this.countdownNum--;
        this.uiManager.countdownText.string = this.countdownNum.toString();
        this.uiManager.countdownText2.string = this.countdownNum.toString();

        if (this.countdownNum <= 0) {
            this.uiManager.countdownText.string = '0';
            this.uiManager.countdownText2.string = '0';
            this.unschedule(this.countDownSchedule);

            this.scheduleOnce(this.gameStartSchedule, 0.3);
        }
    }
    gameStartSchedule() {
        this.isStartRound1 = true;
        this.uiManager.tutorial1.active = true;
        this.uiManager.tutorial2.active = true;
        this.uiManager.countdownText.node.active = false;
        this.uiManager.countdownText2.node.active = false;
        this.uiManager.gameStartPopup.active = false;
        this.uiManager.timer1.node.active = true;
        this.uiManager.timer2.node.active = true;
        this.dollSong.play();
        this.startTimer();
        this.gameRound1();
    }

    // Timer
    startTimer() {
        this.uiManager.timer1.string = '0:' + this.timeNum.toString();
        this.uiManager.timer2.string = '0:' + this.timeNum.toString();
        this.schedule(this.timerSchedule, 1);
    }
    timerSchedule() {
        this.timeNum--;
        this.uiManager.timer1.string = '0:' + this.timeNum.toString();
        this.uiManager.timer2.string = '0:' + this.timeNum.toString();

        if (this.timeNum <= 0) {
            this.uiManager.timer1.string = '0:00';
            this.uiManager.timer2.string = '0:00';
            this.unschedule(this.timerSchedule);
        }
        else if (this.isFinished == true) {
            this.uiManager.timer1.string = '0:' + this.timeNum.toString();
            this.uiManager.timer2.string = '0:' + this.timeNum.toString();
            this.unschedule(this.timerSchedule);
        }
    }

    update(dt: number) {
        // Check Device orientation
        var frameSize = view.getVisibleSize();
        if (frameSize.height > frameSize.width) {
            // portrait
            this.uiManager.portraitUI.active = true;
            this.uiManager.landscapeUI.active = false;
            this.mainCamera.active = true;
            this.mainCamera2.active = false;
        }
        else if (frameSize.height < frameSize.width) {
            // landscape
            this.uiManager.portraitUI.active = false;
            this.uiManager.landscapeUI.active = true;
            this.mainCamera.active = false;
            this.mainCamera2.active = true;
        }

        // Game round manager
        if (this.isRound1 == true && this.isRound2Start == false) {
            this.dollSong.play();
            this.gameRound2();
            this.isRound2Start = true;
        }
        else if (this.isRound2 == true && this.isRound3Start == false) {
            this.dollSong.play();
            this.gameRound3();
            this.isRound3Start = true;
        }
        else if (this.isRound3 == true && this.isRound4Start == false) {
            this.dollSong.play();
            this.gameRound4();
            this.isRound4Start = true;
            this.cta.active = true;
            this.cta.getComponent(CTA).onTouchStart();
        }
    }

    onTouchStart() {
        if (this.isStart == false) {
            this.isStart = true;
            this.uiManager.gameHint1.active = false;
            this.uiManager.gameHint2.active = false;
            // this.uiManager.countdownText.node.active = true;
            // this.startCountdown();

            // move to boss pos
            let move = tween().to(2, { position: new Vec3(-1.609, 2.157, 15.972) }, { easing: 'smooth' });
            this.tweenThen = tween(this.subCamera)
                .then(move)
                .delay(0.3)
                .call(() => {
                    this.subCamera.active = false;
                    this.uiManager.countdownText.node.active = true;
                    this.uiManager.countdownText2.node.active = true;
                    this.startCountdown();
                })
                .start();
        }
    }

    gameRound1() {
        // green bots
        for (let i = 0; i < this.greenBot1List.length; i++) {
            let move = tween().to(4.3, { position: new Vec3(this.round1GreenList[i].position.x, 0.149, this.round1GreenList[i].position.z) }, { easing: 'smooth' });
            this.tweenThen = tween(this.greenBot1List[i])
                .delay(0.1)
                .call(() => {
                    this.greenBot1List[i].getComponent(SkeletalAnimation).play('running');
                })
                .then(move)
                .call(() => {
                    this.greenBot1List[i].getComponent(SkeletalAnimation).play('idle');
                })
                .start();
        }

        // red bots
        for (let i = 0; i < this.redBot1List.length; i++) {
            let move = tween().to(4.7, { position: new Vec3(this.round1RedList[i].position.x, 0.149, this.round1RedList[i].position.z) }, { easing: 'smooth' });
            this.tweenThen2 = tween(this.redBot1List[i])
                .delay(0.5)
                .call(() => {
                    this.redBot1List[i].getComponent(SkeletalAnimation).play('running');
                })
                .then(move)
                .call(() => {
                    this.redBot1List[i].getComponent(SkeletalAnimation).play('idle');
                })
                .start();

            let rotate = tween().to(0.5, { eulerAngles: new Vec3(0, 90, 0) }, { easing: 'smooth' });
            let rotate2 = tween().to(0.5, { eulerAngles: new Vec3(0, -90, 0) }, { easing: 'smooth' });
            this.tweenThen2 = tween(this.doll)
                .delay(4.6)
                .then(rotate)
                .delay(0.3)
                .call(() => {
                    this.round1Bullet.active = true;
                    this.isDetected = true;
                })
                .delay(1)
                .call(() => {
                    this.shootSfx.play();
                    this.hitSfx.play();
                    this.redBot1List[i].getComponent(SkeletalAnimation).play('death');
                })
                .delay(0.1)
                .call(() => {
                    this.round1Bullet.active = false;
                })
                .delay(1.5)
                .then(rotate2)
                .call(() => {
                    this.isRound1 = true;
                    this.isDetected = false;
                })
                .start();
        }
    }

    gameRound2() {
        // green bots
        for (let i = 0; i < this.greenBot2List.length; i++) {
            let move = tween().to(4.3, { position: new Vec3(this.round2GreenList[i].position.x, 0.149, this.round2GreenList[i].position.z) }, { easing: 'smooth' });
            this.tweenThen3 = tween(this.greenBot2List[i])
                .delay(0.1)
                .call(() => {
                    this.greenBot2List[i].getComponent(SkeletalAnimation).play('running');
                })
                .then(move)
                .call(() => {
                    this.greenBot2List[i].getComponent(SkeletalAnimation).play('idle');
                })
                .start();
        }

        // red bots
        for (let i = 0; i < this.redBot2List.length; i++) {
            let move = tween().to(4.7, { position: new Vec3(this.round2RedList[i].position.x, 0.149, this.round2RedList[i].position.z) }, { easing: 'smooth' });
            this.tweenThen4 = tween(this.redBot2List[i])
                .delay(0.5)
                .call(() => {
                    this.redBot2List[i].getComponent(SkeletalAnimation).play('running');
                })
                .then(move)
                .call(() => {
                    this.redBot2List[i].getComponent(SkeletalAnimation).play('idle');
                })
                .start();

            let rotate = tween().to(0.5, { eulerAngles: new Vec3(0, 90, 0) }, { easing: 'smooth' });
            let rotate2 = tween().to(0.5, { eulerAngles: new Vec3(0, -90, 0) }, { easing: 'smooth' });
            this.tweenThen4 = tween(this.doll)
                .delay(4.6)
                .then(rotate)
                .delay(0.3)
                .call(() => {
                    this.round2Bullet.active = true;
                    this.isDetected = true;
                })
                .delay(1)
                .call(() => {
                    this.shootSfx.play();
                    this.hitSfx.play();
                    this.redBot2List[i].getComponent(SkeletalAnimation).play('death');
                })
                .delay(0.1)
                .call(() => {
                    this.round2Bullet.active = false;
                })
                .delay(1.5)
                .then(rotate2)
                .call(() => {
                    this.isRound2 = true;
                    this.isDetected = false;
                })
                .start();
        }
    }

    gameRound3() {
        // green bots
        for (let i = 0; i < this.bot3List.length; i++) {
            let move = tween().to(3.7, { position: new Vec3(this.round3List[i].position.x, 0.149, this.round3List[i].position.z) }, { easing: 'smooth' });
            this.tweenThen5 = tween(this.bot3List[i])
                .delay(0.1)
                .call(() => {
                    this.bot3List[i].getComponent(SkeletalAnimation).play('running');
                })
                .then(move)
                .call(() => {
                    this.bot3List[i].getComponent(SkeletalAnimation).play('dance');
                })
                .start();

            let rotate = tween().to(0.5, { eulerAngles: new Vec3(0, 90, 0) }, { easing: 'smooth' });
            let rotate2 = tween().to(0.5, { eulerAngles: new Vec3(0, -90, 0) }, { easing: 'smooth' });
            this.tweenThen5 = tween(this.doll)
                .delay(4.6)
                .then(rotate)
                .delay(0.3)
                .call(() => {
                    this.isDetected = true;
                })
                .delay(1.2)
                .then(rotate2)
                .call(() => {
                    this.isRound3 = true;
                    this.isDetected = false;
                })
                .start();
        }
    }

    gameRound4() {
        let rotate = tween().to(0.5, { eulerAngles: new Vec3(0, 90, 0) }, { easing: 'smooth' });
        let rotate2 = tween().to(0.5, { eulerAngles: new Vec3(0, -90, 0) }, { easing: 'smooth' });
        this.tweenThen5 = tween(this.doll)
            .delay(4.6)
            .then(rotate)
            .delay(0.3)
            .call(() => {
                this.cta.getComponent(CTA).onTouchStart();
            })
            .delay(1.2)
            .then(rotate2)
            .call(() => {
                this.cta.getComponent(CTA).onTouchStart();
            })
            .start();
    }
}


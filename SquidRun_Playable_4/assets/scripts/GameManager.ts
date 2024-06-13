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
    @property([Node])
    botList: Node[] = [];

    @property(Node)
    bot1: Node = null;
    @property(Node)
    bot2: Node = null;
    @property(Node)
    bot3: Node = null;
    @property(Node)
    bot4: Node = null;
    @property(Node)
    bot5: Node = null;
    @property(Node)
    bot6: Node = null;
    @property(Node)
    bot7: Node = null;

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

    public isStart = false;
    public isIntro = false;
    public playerIsReady = false;
    public isRound1 = false;
    public isRound2 = false;
    public isRound3 = false;
    public isRound4 = false;
    public isRound5 = false;
    public isRound6 = false;
    public isRound7 = false;
    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;

    currentBotPos: Vec3;
    prevBotPos: Vec3;


    start() {
        this.onIntroStart();
        // this.moveBots();
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

            // Move camera Portrait
            let moveUp = tween().to(1, { position: new Vec3(0, 7.59, -12.595) }, { easing: 'smooth' });
            let moveForward = tween().to(2, { position: new Vec3(-0.368, 7.59, 14.79) }, { easing: 'smooth' });
            let moveBack = tween().to(2, { position: new Vec3(0, 7.59, -12.595) }, { easing: 'smooth' });
            let moveZoom = tween().to(1, { position: new Vec3(0, 6.306, -10.594) }, { easing: 'smooth' });
            this.tweenThen = tween(this.subCamera2)
                .delay(1)
                .call(() => {
                    this.uiManager.levelTitle1.active = false;
                    this.uiManager.levelTitle2.active = false;
                })
                .then(moveUp)
                .delay(0.3)
                .then(moveForward)
                .delay(1)
                .then(moveBack)
                .delay(0.2)
                .then(moveZoom)
                .delay(0.3)
                .call(() => {
                    this.subCamera2.active = false;
                    this.isIntro = true;
                })
                .start();

                // Move camera landscape
            let moveUp2 = tween().to(1, { position: new Vec3(0, 5.781, -6.373) }, { easing: 'smooth' });
            let moveForward2 = tween().to(2, { position: new Vec3(-0.272, 5.781, 19.803) }, { easing: 'smooth' });
            let moveBack2 = tween().to(2, { position: new Vec3(0, 5.781, -6.373) }, { easing: 'smooth' });
            let moveZoom2 = tween().to(1, { position: new Vec3(0, 4.392, -6.373) }, { easing: 'smooth' });
            this.tweenThen3 = tween(this.subCamera)
                .delay(1)
                .call(() => {
                    this.uiManager.levelTitle1.active = false;
                    this.uiManager.levelTitle2.active = false;
                })
                .then(moveUp2)
                .delay(0.3)
                .then(moveForward2)
                .delay(1)
                .then(moveBack2)
                .delay(0.2)
                .then(moveZoom2)
                .delay(0.3)
                .call(() => {
                    this.subCamera.active = false;
                    this.isIntro = true;
                })
                .start();

            // // AI bot management
            this.scheduleOnce(this.moveBots, 5);

            // // Move Player
            let move3 = tween().to(1, { position: new Vec3(-0.272, 0, 5.456) }, { easing: 'smooth' });
            this.tweenThen2 = tween(this.player)
                .delay(12)
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

    moveBots() {

        // Get random bot
        const randomIndex = Math.floor(Math.random() * this.botList.length);
        const randomBot = this.botList[randomIndex];
        console.log("node name: " + randomBot.name);

        this.prevBotPos = this.player.position;
        this.currentBotPos = randomBot.position;
        // Check if bot moves left or right
        if (this.currentBotPos.x > this.prevBotPos.x) {
            console.log('move to right')
        }
        else if (this.currentBotPos.x < this.prevBotPos.x) {
            console.log('move to left')
        }

        // bot 1 die
        let move = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump1 = tween().to(0.4, { position: new Vec3(-1.024, 1.656, 3.454) }, { easing: 'smooth' });
        let jump12 = tween().to(0.4, { position: new Vec3(-1.453, -0.157, 1.459) }, { easing: 'smooth' });
        let fall1 = tween().to(2, { position: new Vec3(-1.453, -15, 1.459) }, { easing: 'smooth' });
        this.tweenThen = tween(this.bot1)
            .delay(4)
            .call(() => {
                this.bot1.getComponent(SkeletalAnimation).play('run');
            })
            .then(move)
            .call(() => {
                this.bot1.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.3)
            .call(() => {
                this.bot1.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump1)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump12)
            .call(() => {
                this.bot1.getComponent(SkeletalAnimation).play('idle');
                this.bot1.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.rock1.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.bot1.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock1.active = false;
            })
            .then(fall1)
            .start();

            // bot 2 die
        let move2 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump2 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump22 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump23 = tween().to(0.4, { position: new Vec3(-0.363,1.007, -0.575) }, { easing: 'smooth' });
        let jump24 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -1.973) }, { easing: 'smooth' });
        let fall2 = tween().to(2, { position: new Vec3(-1.349, -15, -1.973) }, { easing: 'smooth' });
        this.tweenThen = tween(this.bot2)
            .delay(6)
            .call(() => {
                this.bot2.getComponent(SkeletalAnimation).play('run');
            })
            .then(move2)
            .call(() => {
                this.bot2.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.4)
            .call(() => {
                this.bot2.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump2)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump22)
            .call(() => {
                this.bot1.getComponent(SkeletalAnimation).play('idle');
                this.bot1.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.5)
            .call(() => {
                this.bot2.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump23)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump24)
            .call(() => {
                this.bot2.getComponent(SkeletalAnimation).play('idle');
                this.bot2.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.rock2.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.bot2.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock2.active = false;
            })
            .then(fall2)
            .start();

            // bot 3 die
        let move3 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump3 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump32 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump33 = tween().to(0.4, { position: new Vec3(1.027,1.007, -0.575) }, { easing: 'smooth' });
        let jump34 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        let jump35 = tween().to(0.4, { position: new Vec3(-0.363,1.007, -3.832) }, { easing: 'smooth' });
        let jump36 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -5.375) }, { easing: 'smooth' });
        let fall3 = tween().to(2, { position: new Vec3(-1.349, -15, -5.375) }, { easing: 'smooth' });
        this.tweenThen = tween(this.bot3)
            .delay(7)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('run');
            })
            .then(move3)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.5)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump3)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump32)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('idle');
                this.bot3.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.5)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump33)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump34)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('idle');
                this.bot3.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump35)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump36)
            .call(() => {
                this.bot3.getComponent(SkeletalAnimation).play('idle');
                this.bot3.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.rock3.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.bot3.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock3.active = false;
            })
            .then(fall3)
            .start();

            // bot 4 die
        let move4 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump4 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump42 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump43 = tween().to(0.4, { position: new Vec3(1.027,1.007, -0.575) }, { easing: 'smooth' });
        let jump44 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        let jump45 = tween().to(0.4, { position: new Vec3(1.027,1.007, -3.832) }, { easing: 'smooth' });
        let jump46 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -5.375) }, { easing: 'smooth' });
        let jump47 = tween().to(0.4, { position: new Vec3(1.027, 1.007, -7.203) }, { easing: 'smooth' });
        let jump48 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -8.775) }, { easing: 'smooth' });
        let fall4 = tween().to(2, { position: new Vec3(1.027, -15, -8.775) }, { easing: 'smooth' });
        this.tweenThen = tween(this.bot4)
            .delay(7.3)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('run');
            })
            .then(move4)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.4)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump4)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump42)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('idle');
                this.bot4.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump43)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump44)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('idle');
                this.bot4.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump45)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump46)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('idle');
                this.bot4.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump47)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump48)
            .call(() => {
                this.bot4.getComponent(SkeletalAnimation).play('idle');
                this.bot4.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.rock4.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.bot4.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock4.active = false;
            })
            .then(fall4)
            .start();

            // bot 5 die
        let move5 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump5 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump52 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump53 = tween().to(0.4, { position: new Vec3(1.027,1.007, -0.575) }, { easing: 'smooth' });
        let jump54 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        let jump55 = tween().to(0.4, { position: new Vec3(1.027,1.007, -3.832) }, { easing: 'smooth' });
        let jump56 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -5.375) }, { easing: 'smooth' });
        let jump57 = tween().to(0.4, { position: new Vec3(-1.349, 1.007, -7.203) }, { easing: 'smooth' });
        let jump58 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -8.775) }, { easing: 'smooth' });
        let jump59 = tween().to(0.4, { position: new Vec3(-1.349, 1.007, -10.844) }, { easing: 'smooth' });
        let jump50 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -12.204) }, { easing: 'smooth' });
        let fall5 = tween().to(2, { position: new Vec3(-1.349, -15, -12.204) }, { easing: 'smooth' });
        this.tweenThen = tween(this.bot5)
            .delay(7.5)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('run');
            })
            .then(move5)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.4)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump5)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump52)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
                this.bot5.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump53)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump54)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
                this.bot5.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump55)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump56)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
                this.bot5.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump57)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump58)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
                this.bot5.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump59)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump50)
            .call(() => {
                this.bot5.getComponent(SkeletalAnimation).play('idle');
                this.bot5.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.rock5.getComponent(Break).breakRock();
                this.uiManager.rockSfx.play();
                this.bot5.getComponent(SkeletalAnimation).play('fall');
                this.uiManager.deathSfx.play();
                this.rock5.active = false;
            })
            .then(fall5)
            .start();

             // bot 6
        let move6 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump6 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump62 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump63 = tween().to(0.4, { position: new Vec3(1.027,1.007, -0.575) }, { easing: 'smooth' });
        let jump64 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        let jump65 = tween().to(0.4, { position: new Vec3(1.027,1.007, -3.832) }, { easing: 'smooth' });
        let jump66 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -5.375) }, { easing: 'smooth' });
        let jump67 = tween().to(0.4, { position: new Vec3(-1.349, 1.007, -7.203) }, { easing: 'smooth' });
        let jump68 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -8.775) }, { easing: 'smooth' });
        let jump69 = tween().to(0.4, { position: new Vec3(0.116, 1.007, -10.844) }, { easing: 'smooth' });
        let jump60 = tween().to(0.4, { position: new Vec3(1.085, -0.138, -12.204) }, { easing: 'smooth' });
        let jump699 = tween().to(0.4, { position: new Vec3(1.085, 1.007, -13.991) }, { easing: 'smooth' });
        let jump600 = tween().to(0.4, { position: new Vec3(1.085, -0.138, -15.371) }, { easing: 'smooth' });        
        let jumpGoal = tween().to(0.4, { position: new Vec3(1.085, 1.007, -17.825) }, { easing: 'smooth' });
        let jumpGoal2 = tween().to(0.4, { position: new Vec3(1.085, 0.082, -19.922) }, { easing: 'smooth' });
        
        this.tweenThen = tween(this.bot6)
            .delay(10)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('run');
            })
            .then(move6)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.4)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump6)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump62)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump63)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump64)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.5)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump65)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump66)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump67)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump68)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump69)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump60)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump699)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump600)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jumpGoal)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jumpGoal2)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('idle');
                this.bot6.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.bot6.getComponent(SkeletalAnimation).play('dance');
            })
            .start();

            // bot 7
        let move7 = tween().to(1, { position: new Vec3(-0.14, 0, 4.772) }, { easing: 'smooth' });
        let jump7 = tween().to(0.4, { position: new Vec3(1.027, 1.656, 3.454) }, { easing: 'smooth' });
        let jump72 = tween().to(0.4, { position: new Vec3(1.027, -0.157, 1.459) }, { easing: 'smooth' });
        let jump73 = tween().to(0.4, { position: new Vec3(1.027,1.007, -0.575) }, { easing: 'smooth' });
        let jump74 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -1.973) }, { easing: 'smooth' });
        let jump75 = tween().to(0.4, { position: new Vec3(1.027,1.007, -3.832) }, { easing: 'smooth' });
        let jump76 = tween().to(0.4, { position: new Vec3(1.027, -0.138, -5.375) }, { easing: 'smooth' });
        let jump77 = tween().to(0.4, { position: new Vec3(-1.349, 1.007, -7.203) }, { easing: 'smooth' });
        let jump78 = tween().to(0.4, { position: new Vec3(-1.349, -0.138, -8.775) }, { easing: 'smooth' });
        let jump79 = tween().to(0.4, { position: new Vec3(0.116, 1.007, -10.844) }, { easing: 'smooth' });
        let jump70 = tween().to(0.4, { position: new Vec3(1.085, -0.138, -12.204) }, { easing: 'smooth' });
        let jump799 = tween().to(0.4, { position: new Vec3(1.085, 1.007, -13.991) }, { easing: 'smooth' });
        let jump700 = tween().to(0.4, { position: new Vec3(1.085, -0.138, -15.371) }, { easing: 'smooth' });        
        let jumpGoal3 = tween().to(0.4, { position: new Vec3(0.1, 1.007, -17.689) }, { easing: 'smooth' });
        let jumpGoal4 = tween().to(0.4, { position: new Vec3(-0.835, 0.082, -19.228) }, { easing: 'smooth' });
        
        this.tweenThen = tween(this.bot7)
            .delay(10.5)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('run');
            })
            .then(move7)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump7)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump72)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump73)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump74)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump75)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump76)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump77)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump78)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.5)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jump79)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump70)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.6)
            .then(jump799)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jump700)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('jump');
            })
            .delay(0.3)
            .then(jumpGoal3)
            .call(() => {
                this.uiManager.jumpSfx.play();
            })
            .then(jumpGoal4)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('idle');
                this.bot7.getComponentInChildren(ParticleSystem).play();
            })
            .delay(0.3)
            .call(() => {
                this.bot7.getComponent(SkeletalAnimation).play('dance');
            })
            .start();
    }
}


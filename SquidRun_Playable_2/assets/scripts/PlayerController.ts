
import { _decorator, CapsuleCollider, Component, EventTouch, Input, input, ITriggerEvent, Node, PhysicsSystem, SkeletalAnimation, Vec3 } from 'cc';
import { RigidCharacter } from './RigidCharacter';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
import { CTA } from './CTA';
const { ccclass, property } = _decorator;
const v3_0 = new Vec3();


@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(GameManager)
    manager: GameManager = null;
    @property(UIManager)
    uiManager: UIManager = null;

    @property(RigidCharacter)
    character: RigidCharacter = null!;

    @property
    speed: Vec3 = new Vec3(1, 0, -1);

    protected _stateX: number = 0;  // 1 positive, 0 static, -1 negative
    protected _stateZ: number = 0;
    protected _speed = 0;
    currentPos: Vec3;

    isRunning = false;
    public gameIsFinished = false;


    start() {
        this.currentPos = this.node.position;

        let myCollider = this.getComponent(CapsuleCollider);
        myCollider.on('onTriggerEnter', (target: ITriggerEvent) => {
            if (target.otherCollider.node.name == 'goal point') {
                this.gameIsFinished = true;
                this.manager.isFinished = true;
                this.isRunning = false;
                console.log('win');
                this.scheduleOnce(this.winPopupSchedule, 0.5);
                this.manager.cta.getComponent(CTA).onTouchStart();
                this.node.getComponent(SkeletalAnimation).play('dance');
                this.manager.winMusic.play();

            }
        });
    }

    winPopupSchedule(){
        this.uiManager.winPopup1.active = true;
        this.uiManager.winPopup2.active = true;
        this.manager.cta.active = true;
    }

    update(deltaTime: number) {
        const dt = PhysicsSystem.instance.fixedTimeStep;
        
        if (this.manager.isStartRound1 == true) {
            // // Move player
            if (this.isRunning == true) {
                this.currentPos = this.node.position;
                this.updateCharacter(dt);
                
                if (this.manager.isDetected == true) {
                    this.gameIsFinished = true;
                    this.manager.isFinished = true;
                    this.isRunning = false;
                    console.log('lost');
                    this.manager.dollBullet.active = true;
                    this.manager.dollBullet.setPosition(new Vec3(this.manager.dollBullet.position.x, this.node.position.y, this.manager.dollBullet.position.z));
                    this.scheduleOnce(this.onDeathSchedule, 0.3);
                }
            }
            else if (this.isRunning == false) {
                this.node.position = this.currentPos;
            }
        }
    }
    
    onDeathSchedule() {
        this.node.getComponent(SkeletalAnimation).play('death');
        this.manager.hitPlayerSfx.play();
        this.manager.loseMusic.play();
        this.manager.dollBullet.active = false;
        this.scheduleOnce(this.losePopupSchedule, 0.5);
        this.manager.cta.getComponent(CTA).onTouchStart();
    }

    losePopupSchedule(){
        this.uiManager.losePopup1.active = true;
        this.uiManager.losePopup2.active = true;
        this.manager.cta.active = true;
    }

    // Character Controller
    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.touchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);

    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);
    }

    touchStart(touch: EventTouch) {
        if (this.gameIsFinished == false) {
            this._stateX = 0;
            this.isRunning = true;
            this.node.getComponent(SkeletalAnimation).play('running');
            this.uiManager.tutorial1.active = false;
            this.uiManager.tutorial2.active = false;
        }
    }


    touchMove(touch: EventTouch) {
        // let x = touch.getUIDelta().x;
        // if (x > 0) {
        //     this._stateX = this.speed.x;
        // } else {
        //     this._stateX = -this.speed.x;
        // }
    }

    touchEnd(touch: EventTouch) {
        if (this.gameIsFinished == false) {
            this._stateX = 0;
            this.isRunning = false;
            this.node.getComponent(SkeletalAnimation).play('idle');
        }
    }

    touchCancel(touch: EventTouch) {
        this._stateX = 0;
    }

    updateCharacter(dt: number) {
        // this.character.updateFunction(dt);

        // move
        this._stateZ = this.speed.z;
        if (!this.character.onGround) return;
        if (this._stateX || this._stateZ) {
            v3_0.set(this._stateX, 0, this._stateZ);
            v3_0.normalize();
            this.character.move(v3_0, 5);
        }
    }
}


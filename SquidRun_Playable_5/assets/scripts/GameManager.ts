import { _decorator, Component, geometry, Input, input, Node, PhysicsSystem, EventTouch, CameraComponent, Touch, ModelComponent, Material, view, ParticleSystem, Animation, AnimationState, game, AnimationClip, Sprite, Tween, tween, Vec3 } from 'cc';
import { UIManager } from './UIManager';
import { CTA } from './CTA';
const { ccclass, property } = _decorator;
enum ERaycastType {
    ALL,
    CLOSEST
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property(UIManager)
    uiManager: UIManager = null;

    @property(Node)
    mainCamera: Node = null;
    @property(Node)
    subCamera: Node = null;

    @property(ParticleSystem)
    lineVfx: ParticleSystem = null;
    @property(Animation)
    myAnim: Animation = null;

    @property(Node)
    kim: Node = null;
    @property(Node)
    lineDot: Node = null;
    @property(Node)
    candyHint: Node = null;

    @property({ type: Material })
    readonly defaultMaterial: Material = null as any;
    @property({ type: Material })
    readonly rayMaterial: Material = null as any;
    @property({ type: CameraComponent })
    readonly camera: CameraComponent = null as any;
    @property({ type: PhysicsSystem.PhysicsGroup })
    ingnoreLayer: number = 0;
    @property
    queryTrigger = true;

    isFinished = false;
    public timeNum = 29;
    private _raycastType: ERaycastType = ERaycastType.ALL;
    private _ray: geometry.Ray = new geometry.Ray();
    private _maxDistance: number = 100;
    private _mask: number = 0xffffffff;
    isStart = false;
    isStartIntro = false;
    isDetaching = false;

    private tweenThen!: Tween<Node>;
    private tweenThen2!: Tween<Node>;
    private tweenThen3!: Tween<Node>;
    private tweenThen4!: Tween<Node>;


    start() {
        this._maxDistance = this._maxDistance;
        this._mask &= ~this.ingnoreLayer;

        let move = tween().to(1, { position: new Vec3(0, 0.19, 0.024) }, { easing: 'smooth' });
        this.tweenThen = tween(this.mainCamera)
            .delay(1)
            .then(move)
            .call(() => {
                this.isStartIntro = true;
                this.uiManager.tutorialLandscape.active = true;
                this.uiManager.tutorialPortrait.active = true;
            })
            .start();

        let move2 = tween().to(1, { position: new Vec3(0, 0.133, 0.034) }, { easing: 'smooth' });
        this.tweenThen3 = tween(this.subCamera)
            .delay(1)
            .then(move2)
            .call(() => {
                this.isStartIntro = true;
                this.uiManager.tutorialLandscape.active = true;
                this.uiManager.tutorialPortrait.active = true;
            })
            .start();
    }

    update(deltaTime: number) {
        // Check Device orientation
        var frameSize = view.getVisibleSize();
        if (frameSize.height > frameSize.width) {
            // portrait
            this.uiManager.portraitUI.active = true;
            this.uiManager.landscapeUI.active = false;

            this.mainCamera.active = true;
            this.subCamera.active = false;
        }
        else if (frameSize.height < frameSize.width) {
            // landscape
            this.uiManager.portraitUI.active = false;
            this.uiManager.landscapeUI.active = true;

            this.mainCamera.active = false;
            this.subCamera.active = true;
        }

        if (this.isFinished == false && this.myAnim.getState('candy').current >= 3) {
            this.scheduleOnce(this.showDetachBarSchedule, 4);
            let move = tween().to(1, { position: new Vec3(0, 0.404, 0.118) }, { easing: 'smooth' });
            this.tweenThen2 = tween(this.mainCamera)
                .then(move)
                .call(() => {
                    this.kim.getComponent(Animation).play();
                    this.lineVfx.node.active = false;
                    this.uiManager.timer2.node.active = false;
                    this.uiManager.timer1.node.active = false;
                    this.lineDot.active = false;
                    this.isFinished = true;
                })
                .start();

            let move2 = tween().to(1, { position: new Vec3(0, 0.207, 0.082) }, { easing: 'smooth' });
            this.tweenThen4 = tween(this.subCamera)
                .then(move2)
                .start();
        }
    }

    showDetachBarSchedule() {
        this.kim.active = false;
        this.uiManager.detachBar2.active = true;
        this.uiManager.detachBar1.active = true;
        this.candyHint.active = true;
        this.uiManager.cta.active = true;
    }

    onEnable() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() {
        if (this.isStartIntro == true && this.isStart == false && this.myAnim.getState('candy').current < 3) {
            this.myAnim.play();
            this.lineVfx.play();
            this.startTimer();
            this.isStart = true;
            this.uiManager.tutorialLandscape.active = false;
            this.uiManager.tutorialPortrait.active = false;
        }
        else if (this.isStart == true && this.isDetaching == false && this.myAnim.getState('candy').current < 3) {
            this.myAnim.resume();
            this.lineVfx.play();
            this.isDetaching = true;

            console.log('time: ' + this.myAnim.getState('candy').current.toString());
        }
        // else if (this.myAnim.getState('candy').current >= 3.4) {
        //     this.kim.active = false;
        //     this.lineDot.active = false;
        // }
    }

    onTouchEnd() {
        if (this.isDetaching == true || this.isStart == true) {
            this.lineVfx.stop();
            this.myAnim.pause();

            this.isDetaching = false;
        }
        // else if (this.myAnim.getState('candy').current >= 3.4) {
        //     this.kim.active = false;
        //     this.lineDot.active = false;
        // }
    }

    onTouchStart2(touch: Touch, event: EventTouch) {
        this.resetAll();

        this.camera.screenPointToRay(touch.getLocationX(), touch.getLocationY(), this._ray);
        switch (this._raycastType) {
            case ERaycastType.ALL:
                if (PhysicsSystem.instance.raycast(this._ray, this._mask, this._maxDistance, this.queryTrigger)) {
                    const r = PhysicsSystem.instance.raycastResults;
                    for (let i = 0; i < r.length; i++) {
                        const item = r[i];
                        const modelCom = item.collider.node.getComponent(ModelComponent)!;
                        modelCom.material = this.rayMaterial;
                    }
                }
                break;
            case ERaycastType.CLOSEST:
                if (PhysicsSystem.instance.raycastClosest(this._ray, this._mask, this._maxDistance, this.queryTrigger)) {
                    const r = PhysicsSystem.instance.raycastClosestResult;
                    const modelCom = r.collider.node.getComponent(ModelComponent)!;
                    modelCom.material = this.rayMaterial;
                }
                break;
        }
    }

    resetAll() {
        for (let i = 0; i < this.node.children.length; i++) {
            let modelCom = this.node.children[i].getComponent(ModelComponent)!;
            modelCom.material = this.defaultMaterial;
        }
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

        if (this.timeNum < 10 && this.timeNum > 0) {
            this.uiManager.timer1.string = '0:0' + this.timeNum.toString();
            this.uiManager.timer2.string = '0:0' + this.timeNum.toString();
        }
        else if (this.timeNum <= 0) {
            this.uiManager.timer1.string = '0:00';
            this.uiManager.timer2.string = '0:00';
            this.uiManager.losePopup1.active = true;
            this.uiManager.losePopup2.active = true;
            this.uiManager.cta.active = true;
            this.uiManager.cta.getComponent(CTA).on_click_download();
            this.unschedule(this.timerSchedule);
        }
        else if (this.isFinished == true) {
            this.uiManager.timer1.string = '0:' + this.timeNum.toString();
            this.uiManager.timer2.string = '0:' + this.timeNum.toString();
            this.unschedule(this.timerSchedule);
        }
    }
}


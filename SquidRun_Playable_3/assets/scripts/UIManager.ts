import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    // UI
    @property(Node)
    gameCtrlPopup: Node = null;
    @property(Node)
    gameCtrlPopup2: Node = null;
    @property(Node)
    portraitUI: Node = null;
    @property(Node)
    landscapeUI: Node = null;

    @property(Node)
    levelTitle1: Node = null;
    @property(Node)
    levelTitle2: Node = null;

    @property(Node)
    losePopup1: Node = null;
    @property(Node)
    losePopup2: Node = null;

    @property(Node)
    cta: Node = null;

    @property(Node)
    tutorial1: Node = null;
    @property(Node)
    tutorial2: Node = null;

    @property(Node)
    joycon1: Node = null;
    @property(Node)
    joycon2: Node = null;

    @property(Node)
    left1: Node = null;
    @property(Node)
    left2: Node = null;

    // Music & SFX
    @property(AudioSource)
    bgMusic: AudioSource = null;
    @property(AudioSource)
    loseSfx: AudioSource = null;
    @property(AudioSource)
    jumpSfx: AudioSource = null;
    @property(AudioSource)
    deathSfx: AudioSource = null;
    @property(AudioSource)
    shotSfx: AudioSource = null;
    @property(AudioSource)
    rockSfx: AudioSource = null;


    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(){
        if(this.bgMusic.playing == false){
            this.bgMusic.play();
        }
    }

    update(deltaTime: number) {
        
    }
}


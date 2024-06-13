
import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;


 
@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    gameStartPopup: Node = null;
    @property(Node)
    portraitUI: Node = null;
    @property(Node)
    landscapeUI: Node = null;

    @property(Node)
    winPopup1: Node = null;
    @property(Node)
    winPopup2: Node = null;
    @property(Node)
    losePopup1: Node = null;
    @property(Node)
    losePopup2: Node = null;

    @property(Node)
    gameHint1: Node = null;
    @property(Node)
    gameHint2: Node = null;

    @property(Node)
    public tutorial1: Node = null;
    @property(Node)
    public tutorial2: Node = null;

    @property(Label)
    countdownText: Label = null;
    @property(Label)
    countdownText2: Label = null;
    @property(Label)
    timer1: Label = null;
    @property(Label)
    timer2: Label = null;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}



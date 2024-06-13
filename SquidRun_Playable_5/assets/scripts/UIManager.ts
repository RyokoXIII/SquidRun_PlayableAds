import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    portraitUI: Node = null;
    @property(Node)
    landscapeUI: Node = null;

    @property(Label)
    timer1: Label = null;
    @property(Label)
    timer2: Label = null;

    @property(Node)
    detachBar1: Node = null;
    @property(Node)
    detachBar2: Node = null;

    @property(Node)
    losePopup1: Node = null;
    @property(Node)
    losePopup2: Node = null;

    @property(Node)
    tutorialLandscape: Node = null;
    @property(Node)
    tutorialPortrait: Node = null;

    @property(Node)
    cta: Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


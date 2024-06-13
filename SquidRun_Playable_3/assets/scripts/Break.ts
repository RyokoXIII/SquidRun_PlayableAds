import { _decorator, Component, instantiate, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Break')
export class Break extends Component {

    @property([Node])
    breakableRockList: Node[] = [];

    @property(Node)
    breakableRock: Node = null;

    @property
    breakForce = 5;

    start() {
        // this.breakRock();
    }

    update(deltaTime: number) {
        
    }

    breakRock(){
        this.breakableRock.active = true;

        this.breakableRockList.forEach((node)=>{
            this.node.active = false;
            const rb = node.getComponent(RigidBody);
            const force = new Vec3(node.position.x - this.node.position.x, node.position.y - this.node.position.y,node.position.z - this.node.position.z).normalize();
            rb.applyImpulse(new Vec3(force.x * this.breakForce, force.y * this.breakForce, force.z * this.breakForce));
        });
    }
}



import * as THREE from 'three';
import ShaderMaterial from "../Shader/magic"
import BaseMaterial from "../BaseMaterial"

export class Magic extends BaseMaterial {
   
    color: THREE.Color = new THREE.Color(0, 1, 0)
    Init(): void {
        this.clock = new THREE.Clock();
        this.material = ShaderMaterial({ color: this.color});
        this.material.needsUpdate = true
    }
    private clock:THREE.Clock;
    Update() {
        if (this.material) {
            const delta = this.clock.getDelta();
            this.material.uniforms.time.value += delta * 5;
        }
    }
    Resize(): void {
    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }
}
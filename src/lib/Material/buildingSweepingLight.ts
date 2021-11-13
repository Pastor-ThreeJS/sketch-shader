import * as THREE from 'three';
import ShaderMaterial from "../Shader/BuildingSweepingLight"
import BaseMaterial from "../BaseMaterial"

export class BuildingSweepingLight extends BaseMaterial {
    speed: number = 0.1;
    boxH: number = 10;
    color: THREE.Vector4 = new THREE.Vector4(0, 0.2, 1.0, 0.1)
    Init(): void {
        this.material = ShaderMaterial({ boxH: this.boxH, baseColor: this.color });
        this.material.needsUpdate = true
    }
    Update() {
        this.material.uniforms.boxH.value += this.speed
        if (this.material.uniforms.boxH.value > this.boxH) {
            this.material.uniforms.boxH.value = -this.boxH
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
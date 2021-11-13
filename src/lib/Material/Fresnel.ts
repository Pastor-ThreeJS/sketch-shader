import * as THREE from 'three';
import ShaderMaterial from "../Shader/Fresnel"
import BaseMaterial from "../BaseMaterial"

export class Fresnel extends BaseMaterial {
    glowColor: THREE.Color = new THREE.Color(0.741, 0.173, 0.741)
    Init(): void {
        this.material = ShaderMaterial({ glowColor: this.glowColor });
    }
    Update() {

    }
    Resize(): void {

    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }
}
import * as THREE from 'three';
import ShaderMaterial from "../Shader/Fresnel"
import BaseMaterial from "../BaseMaterial"

export class Fresnel extends BaseMaterial {
    s: number = -1;
    b: number = 1;
    p: number = 2;
    glowColor: THREE.Color = new THREE.Color(1, 1, 1)
    Init(): void {
        this.material = ShaderMaterial({ glowColor: this.glowColor, s: this.s, b: this.b, p: this.p });
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

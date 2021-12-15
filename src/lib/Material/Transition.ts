import * as THREE from 'three';
import ShaderMaterial from "../Shader/transitionManager"
import BaseMaterial from "../BaseMaterial"

export class Transition extends BaseMaterial {

    Init(): void {
        this.material = ShaderMaterial({
            tDiffuse1: null,
            tDiffuse2: null,
            mixRatio: 0.0,
            threshold: 0.1,
            useTexture: 1,
            tMixTexture: null
        });
        this.material.needsUpdate = true
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
import * as THREE from 'three';
import ShaderMaterial from "../Shader/GeometryMaterial"
import BaseMaterial from "../BaseMaterial"

export class GeometryMaterial extends BaseMaterial {
    Init(): void {
        this.material = ShaderMaterial();
        this.material.uniforms.u_resolution.value.x = window.outerWidth;
        this.material.uniforms.u_resolution.value.y = window.outerHeight;
    }
    Update() {
        if (this.material)
            this.material.uniforms.u_time.value += 0.02;
    }
    Resize(): void {
        this.material.uniforms.u_resolution.value.x = window.outerWidth;
        this.material.uniforms.u_resolution.value.y = window.outerHeight;
    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }
}
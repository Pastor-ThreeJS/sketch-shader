import * as THREE from 'three';
import ShaderMaterial from "../Shader/Radar"
import BaseMaterial from "../BaseMaterial"

export class Radar extends BaseMaterial {
    radius: number = 30;
    bw: number = 0.5;
    color: string = "#3acbf4";
    speed: number = 2;
    opacity: number = 0.4;
    angle: number = Math.PI;
    Init(): void {
        this.material = ShaderMaterial({
            radius: this.radius,
            bw: this.bw,
            color: this.color,
            speed: this.speed,
            opacity: this.opacity,
            angle: this.angle
        });
        this.clock = new THREE.Clock();
    }
    private clock: THREE.Clock;
    Update() {
        if (this.material)
            this.material.uniforms.time.value = this.clock.getElapsedTime();
    }
    Resize(): void {

    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }
    GetMesh() {
        const width = this.radius * 2;
        const geometry = new THREE.PlaneBufferGeometry(width, width, width, width);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.renderOrder = 1;
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        return mesh;
    }
}
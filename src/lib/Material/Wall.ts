import * as THREE from 'three';
import ShaderMaterial from "../Shader/Wall"
import BaseMaterial from "../BaseMaterial"

export class Wall extends BaseMaterial {
    radius: number = 50;
    height: number = 10;
    speed: number = 0.2;
    color: string = "#3acbf4";
    opacity: number = 0.8;
    Init(): void {
        this.material = ShaderMaterial({
            radius: this.radius,
            height: this.height,
            color: this.color,
            speed: this.speed,
            opacity: this.opacity,
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
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, true);
        geometry.translate(0, this.height / 2, 0);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.renderOrder = 1;
        mesh.rotation.set(0, 0, 0);
        return mesh;
    }
}
import * as THREE from 'three';
import ShaderMaterial from "../Shader/SpriteOutline"
import BaseMaterial from "../BaseMaterial"

export class SpriteOutline extends BaseMaterial {
    repeatX: number = 1;
    speed: number = 0.5;
    color: string = "#ffffff";
    map: THREE.Texture
    Init(): void {
        this.material = ShaderMaterial({
            repeatX: this.repeatX,
            speed: this.speed,
            color: this.color,
            map: this.map,
        });
        this.map.needsUpdate = true;
        this.clock = new THREE.Clock();
    }
    private clock: THREE.Clock;
    Update() {
        if (this.material) {
            this.material.uniforms.time.value = this.clock.getElapsedTime();
        }
    }
    Resize(): void {

    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }

    GetMesh() {
        let scalling = 0.01;
        const geometry = new THREE.PlaneBufferGeometry(this.map.image.naturalHeight * scalling, this.map.image.naturalWidth * scalling, this.map.image.naturalHeight, this.map.image.naturalWidth);
        const mesh = new THREE.Mesh(geometry, this.material);
        mesh.renderOrder = 1;
        mesh.rotation.set(0, 0, 0);
        return mesh;
    }
}
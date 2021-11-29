import * as THREE from 'three';
import ShaderMaterial from "../Shader/SurroundLine"
import BaseMaterial from "../BaseMaterial"

export class SurroundLine extends BaseMaterial {
    color: string = "#ff0000";
    active: string = "#0000ff";
    startTime: number = 1;
    opacity: number = 0.8;
    max: number = 1;
    min: number = 1;
    range: number = 10;
    speed: number = 0.1;
    Init(): void {
        this.material = ShaderMaterial({
            color: this.color,
            active: this.active,
            startTime: this.startTime,
            opacity: this.opacity,
            max: this.max,
            min: this.min,
            range: this.range,
            speed: this.speed,
        });
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
    GetMesh(node: THREE.Mesh) {
        let edges = new THREE.EdgesGeometry(node.geometry);
        node.geometry.computeBoundingBox();
        let {
            max,
            min
        } = node.geometry.boundingBox as any;
        let size = new THREE.Vector3(
            max.x - min.x,
            max.y - min.y,
            max.z - min.z
        );
        this.min = min;
        this.max = max;
        this.material.uniforms.uRange.value = size.y * 2;
        this.material.uniforms.uMax.value = this.max;
        this.material.uniforms.uMin.value = this.min;
        var mesh = new THREE.LineSegments(edges, this.material);
        return mesh;
    }
}
import * as THREE from 'three';
import ShaderMaterial from "../Shader/Fly2"
import BaseMaterial from "../BaseMaterial"

export class Fly2 extends BaseMaterial {
    source: { x: number, y: number, z: number } = {
        x: 0,
        y: 0,
        z: 0,
    }
    target: { x: number, y: number, z: number } = {
        x: 10,
        y: 5,
        z: 0
    }
    height: number = 5;
    color: number = 0xff0000;
    size: number = 3;
    number: number = 2;
    speed: number = 2;
    length: number = 0.3;
    Init(): void {
        this.material = ShaderMaterial({
            color: this.color,
            size: this.size,
            number: this.number,
            speed: this.speed,
            length: this.length
        });
        this.clock = new THREE.Clock();
    }
    private clock: THREE.Clock;
    Update() {
        if (this.material)
            this.material.uniforms.u_time.value = this.clock.getElapsedTime();
    }
    Resize(): void {

    }
    Destroyed(): void {
        if (this.material) {
            this.material.dispose();
        }
    }
    GetMesh() {
        var p1 = new THREE.Vector3(this.source.x, this.source.y, this.source.z);
        var p3 = new THREE.Vector3(this.target.x, this.target.y, this.target.z);
        let _center = p3.clone().lerp(p1, 0.5);
        _center.y += this.height;
        let number = p1.distanceTo(_center) + p3.distanceTo(_center);
        var curve = new THREE.QuadraticBezierCurve3(p1, _center, p3);
        var points = curve.getPoints(1000);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        let length = points.length;
        var percents = new Float32Array(length);
        for (let i = 0; i < points.length; i += 1) {
            percents[i] = i / length;
        }
        geometry.attributes.percent = new THREE.BufferAttribute(percents, 1);
        let mesh = new THREE.Points(geometry, this.material);
        return mesh;
    }
}
import * as THREE from 'three';
import ShaderMaterial from "../Shader/Fly"
import BaseMaterial from "../BaseMaterial"

export class Fly extends BaseMaterial {
    source: { x: number, y: number, z: number } = {
        x: -100,
        y: 20,
        z: -100,
    }
    target: { x: number, y: number, z: number } = {
        x: 0,
        y: 20,
        z: 0
    }
    range: number = 200;
    height: number = 80;
    color: string = "#efad35";
    size: number = 3;
    number: number = 300;
    speed: number = 0.2;

    Init(): void {
        this.material = ShaderMaterial({
            color: this.color,
            range: this.range,
            size: this.size,
            number: this.number,
            speed: this.speed,
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
        let positions: any = [];
        let attrPositions: any = [];
        let attrCindex: any = [];
        let attrCnumber: any = [];
        let _source = new THREE.Vector3(this.source.x, this.source.y, this.source.z);
        let _target = new THREE.Vector3(this.target.x, this.target.y, this.target.z);
        let _center = _target.clone().lerp(_source, 0.5);
        _center.y += this.height;
        let number = _source.distanceTo(_center) + _target.distanceTo(_center);
        let curve = new THREE.QuadraticBezierCurve3(
            _source,
            _center,
            _target
        );
        let points = curve.getPoints(number);
        // 粒子位置计算 
        points.forEach((elem, i) => {
            const index = i / (number - 1);
            positions.push({
                x: elem.x,
                y: elem.y,
                z: elem.z
            });
            attrCindex.push(index);
            attrCnumber.push(i);
        })
        positions.forEach((p: any) => {
            attrPositions.push(p.x, p.y, p.z);
        })
        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(attrPositions, 3));
        geometry.setAttribute('index', new THREE.Float32BufferAttribute(attrCindex, 1));
        geometry.setAttribute('current', new THREE.Float32BufferAttribute(attrCnumber, 1));
        let point = new THREE.Points(geometry, this.material);
        return point;
    }
}
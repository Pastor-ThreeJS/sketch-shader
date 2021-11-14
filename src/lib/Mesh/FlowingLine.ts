import * as THREE from 'three';
import BaseMesh from "../BaseMesh"

export class FlowingLine extends BaseMesh {
    Init(param: { points: THREE.Vector3[], textureUrl: string, tubularSegments: number, radius: number, repeat: number }): void {
        //曲线路径
        this._curve = new THREE.CatmullRomCurve3(param.points);
        //依据线条路径创建管道几何体
        this._tubeGeometry = new THREE.TubeGeometry(this._curve, param.tubularSegments, param.radius);
        //加载纹理
        this._texture = new THREE.TextureLoader().load(param.textureUrl)
        this._texture.wrapS = THREE.RepeatWrapping;
        this._texture.wrapT = THREE.RepeatWrapping;
        this._texture.repeat.set(param.repeat, 1);
        this._texture.needsUpdate = true;
        //创建纹理贴图材质
        let material = new THREE.MeshBasicMaterial({
            map: this._texture,
            side: THREE.BackSide,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this._tubeGeometry, material);
    }
    Update() {
        if (this._texture)
            this._texture.offset.x -= 0.05;
    }
    Destroyed(): void {

    }
    private _texture: THREE.Texture;
    private _curve: THREE.CatmullRomCurve3;
    private _tubeGeometry: THREE.TubeGeometry;
}
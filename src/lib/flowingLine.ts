import * as THREE from 'three';

export class FlowingLine {
    mesh: THREE.Mesh
    texture: THREE.Texture
    constructor(points: THREE.Vector3[], textureUrl: string, tubularSegments: number, radius: number, repeat: number) {
        //曲线路径
        this._curve = new THREE.CatmullRomCurve3(points);
        //依据线条路径创建管道几何体
        this._tubeGeometry = new THREE.TubeGeometry(this._curve, tubularSegments, radius);
        //加载纹理
        this.texture = new THREE.TextureLoader().load(textureUrl)
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(repeat, 1);
        this.texture.needsUpdate = true;
        //创建纹理贴图材质
        let material = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: THREE.BackSide,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this._tubeGeometry, material);
    }

    Update() {
        this.texture.offset.x -= 0.05;
    }
    private _curve: THREE.CatmullRomCurve3;
    private _tubeGeometry: THREE.TubeGeometry;
}
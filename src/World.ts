import { BuildingSweepingLight, FlowingLine, Fresnel, GeometryMaterial, BaseMaterial, BaseMesh, Radar, Wall, Fly, SurroundLine, ShaderSourceUtils } from "./lib"
import * as THREE from 'three';
import Stats from './Stats';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class World {
    baseMeshGroup: any[] = [];
    baseMaterialGroup: any[] = [];
    flowingLine: any;
    geometryMaterial: any;
    buildingSweepingLight: any;
    fresnel: any;
    constructor() {
        //1.场景初始化
        var scene = new THREE.Scene();
        //2.摄像机初始化
        var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        camera.position.set(20, 50, 100);
        //3.灯光初始化
        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(25, 30, 50);
        spotLight.castShadow = true;
        scene.add(spotLight);
        //4.渲染器初始化
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0f2d48); //设置背景色
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        let canvas = document.getElementById("WebGL-output");
        if (canvas)
            canvas.appendChild(renderer.domElement);
        //5.性能初始化
        var stats = new Stats();
        //6.控制器
        var controls = new OrbitControls(camera, renderer.domElement)
        let axesHelper = true;
        let length = 100;
        if (axesHelper) {
            //Arrow-x
            let object = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), length, 0xff0000);
            object.position.set(0, 0, 0);
            object.renderOrder = 2;
            scene.add(object);
            //Arrow-Z
            object = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), length, 0x0000ff);
            object.position.set(0, 0, 0);
            object.renderOrder = 2;
            scene.add(object);
            //Arrow-Y
            object = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), length, 0x00ff00);
            object.position.set(0, 0, 0);
            object.renderOrder = 2;
            scene.add(object);

            //AxesHelper
            let axesHelper = new THREE.AxesHelper(length);
            axesHelper.renderOrder = 2;
            scene.add(axesHelper);

            let gridHelper = new THREE.GridHelper(length, length, 0x808080, 0x808080);
            gridHelper.position.set(0, -0.001, 0);
            gridHelper.renderOrder = 1;
            scene.add(gridHelper);
        }

        window.addEventListener("resize", () => {
            let width = window.innerWidth;
            let height = window.innerHeight;
            let aspect = width / height;
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            this.baseMaterialGroup.forEach((material) => {
                material.Resize();
            });
        });

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.stats = stats;
        this.controls = controls;
        this.Update();
    }
    scene: THREE.Scene;
    camera: any;
    renderer: any;
    stats: any;
    controls: any;
    Update() {
        this.renderer.autoClear = true;
        this.stats.stats.update();
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
        this.baseMeshGroup.forEach((mesh) => {
            mesh.Update();
        });
        this.baseMaterialGroup.forEach((material) => {
            material.Update();
        });
        requestAnimationFrame(this.Update.bind(this));
    }

    Init() {
        {
            //     let radar = new Radar();
            //     radar.radius = 10;
            //     radar.Init();
            //     let mesh = radar.GetMesh();
            //     mesh.position.set(0, 0, 0);
            //     this.scene.add(mesh);
            //     this.baseMaterialGroup.push(radar);
            // }
            // {
            //     let wall = new Wall();
            //     wall.Init();
            //     let mesh = wall.GetMesh();
            //     mesh.position.set(0, 1, 0);
            //     this.scene.add(mesh);
            //     this.baseMaterialGroup.push(wall);
            // }
            // {
            //     let fly = new Fly();
            //     fly.Init();
            //     let mesh = fly.GetMesh();
            //     mesh.position.set(0, 0, 0);
            //     this.scene.add(mesh);
            //     this.baseMaterialGroup.push(fly);
            // }

            // {
            //     let object = new SurroundLine();
            //     object.Init();
            //     this.baseMaterialGroup.push(object);
            //     let geometry = new THREE.BoxGeometry(20, 20, 20);
            //     let mat = new THREE.MeshBasicMaterial();
            //     let box = new THREE.Mesh(geometry, mat);
            //     this.scene.add(box);
            //     let mesh = object.GetMesh(box);
            //     mesh.position.set(0, 0, 0);
            //     this.scene.add(mesh);
            // }

            // {
            //     let object = new SurroundLine();
            //     object.Init();
            //     this.baseMaterialGroup.push(object);
            //     let geometry = new THREE.BoxGeometry(20, 20, 20);
            //     let mat = new THREE.MeshBasicMaterial();
            //     let box = new THREE.Mesh(geometry, mat);
            //     this.scene.add(box);
            //     ShaderSourceUtils.Test(mat, new THREE.Color(0, 1, 0))
            // }
        }
    }
}
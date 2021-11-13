import React from 'react';
import * as THREE from 'three';
import Stats from 'stats-js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BuildingSweepingLight, FlowingLine } from "./lib"
import './App.css';

interface StateProps { }
interface StaState {
  development: boolean
}

export default class App extends React.Component<StateProps, StaState> {
  constructor(props: StateProps) {
    super(props);
    this.state = {
      development: false,
    };
  }

  componentDidMount() {

    //判定开发环境
    if (process.env.NODE_ENV === "development") {
      console.log("开发环境");
      this.setState({ development: true });
    } else {
      console.log("生产环境");
      this.setState({ development: false });
    }

    this.Init();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <div id="app" style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }}>
          <div id="Stats-output"></div>
          <div id="WebGL-output" style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }} />
          {this.RenderConsole()}
        </div>
      </div >
    )
  }

  RenderConsole(): JSX.Element {
    if (this.state.development)
      return (
        <div>
          <div id="ButtonGtroup" >
          </div>
        </div >
      )
    else
      return (
        <div></div>)
  }

  Init() {

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
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    //5.性能初始化
    var stats = new Stats();
    stats.setMode(0);
    document.getElementById("Stats-output").appendChild(stats.domElement);
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
    });


    this.InitModel(scene);

    let app = this;
    function render() {
      renderer.autoClear = true
      stats.update();
      controls.update()
      app.Update();
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }

  Update() {
    this.flowingLine.Update();
    this.buildingSweepingLight.Update();
  }
  flowingLine: FlowingLine;
  buildingSweepingLight: BuildingSweepingLight;

  InitModel(scene: THREE.Scene) {
    let poins = [
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, 0, 10),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(20, 0, -10)
    ]
    let texrtureUrl = "\\assets\\textures\\arrow.png";
    this.flowingLine = new FlowingLine(poins, texrtureUrl, 80, 0.1, 40);
    scene.add(this.flowingLine.mesh);

    this.buildingSweepingLight = new BuildingSweepingLight();
    for (let i = 0; i < 60; i++) {
      const height = Math.random() * 10 + 2
      const width = 3
      const cubeGeom = new THREE.BoxBufferGeometry(width, height, width)
      cubeGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(24 * 3), 3))
      const colors = cubeGeom.attributes.color
      let r = Math.random() * 0.2,
        g = Math.random() * 0.1,
        b = Math.random() * 0.8
      //设置立方体六个面24个顶点的颜色  
      for (let i = 0; i < 24; i++) {
        colors.setXYZ(i, r, g, 0.6)
      }
      //重置立方体顶部四边形的四个顶点的颜色
      const k = 2
      colors.setXYZ(k * 4 + 0, .0, g, 1.0)
      colors.setXYZ(k * 4 + 1, .0, g, 1.0)
      colors.setXYZ(k * 4 + 2, .0, g, 1.0)
      colors.setXYZ(k * 4 + 3, .0, g, 1.0)
      const cube = new THREE.Mesh(cubeGeom, this.buildingSweepingLight.material)
      cube.position.set(Math.random() * 100 - 50, height / 2, Math.random() * 100 - 50)
      scene.add(cube)

      //绘制边框线
      const lineGeom = new THREE.EdgesGeometry(cubeGeom)
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x018BF5,
        linewidth: 1,
        linecap: 'round',
        linejoin: 'round'
      })
      const line = new THREE.LineSegments(lineGeom, lineMaterial)
      line.scale.copy(cube.scale)
      line.rotation.copy(cube.rotation)
      line.position.copy(cube.position)
      scene.add(line)
    }

  }
}
import * as THREE from 'three';

export default abstract class BaseMesh {
    mesh: THREE.Mesh
    abstract Init(param: any): void;
    abstract Update(): void;
    abstract Destroyed(): void;
}
import * as THREE from 'three';

export default abstract class BaseMaterial {
    material: THREE.ShaderMaterial
    abstract Init(): void;
    abstract Update(): void;
    abstract Resize(): void;
    abstract Destroyed(): void;
}
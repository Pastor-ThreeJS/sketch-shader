import * as THREE from 'three';

const vertexShader = `
varying vec3 vColor;
varying float v_pz;
void main(){
    v_pz = position.y;
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = ` 
uniform float boxH;
uniform vec4 baseColor;
varying vec3 vColor;
varying float v_pz;
float plot(float pct){
    return smoothstep(pct-8.0,pct,v_pz) - smoothstep(pct,pct+0.02,v_pz);
}
void main(){
    float f1 = plot(boxH);
    vec4 b1 = mix(baseColor,vec4(f1,f1,f1,1.0),0.1);
    gl_FragColor = mix(vec4(vColor,1.0),b1,f1);
     gl_FragColor = vec4(vec3(gl_FragColor),0.9);
    }
`;

export class BuildingSweepingLight {
    speed: number = 0.1;
    boxH: number = 10;
    color: THREE.Vector4 = new THREE.Vector4(0, 0.2, 1.0, 0.1)
    material: THREE.ShaderMaterial
    constructor() {
        let uniforms = {
            "boxH": {
                type: "f",
                value: -this.boxH
            },
            "baseColor": {
                type: "v",
                value: this.color
            }
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            vertexColors: true
        })
        this.material.needsUpdate = true
    }

    Update() {
        this.material.uniforms.boxH.value += this.speed
        if (this.material.uniforms.boxH.value > this.boxH) {
            this.material.uniforms.boxH.value = -this.boxH
        }
    }

}
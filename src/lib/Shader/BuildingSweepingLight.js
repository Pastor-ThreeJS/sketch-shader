import * as THREE from 'three';

const Shader = {
    vertexShader: `
    varying vec3 vColor;
    varying float v_pz;
    void main(){
        v_pz = position.y;
        vColor = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: ` 
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
    `
}

export default function (param) {
    const material = new THREE.ShaderMaterial({
        uniforms:
        {
            "boxH": {
                type: "f",
                value: -param.boxH
            },
            "baseColor": {
                type: "v",
                value: param.baseColor
            }
        },
        vertexShader: Shader.vertexShader,
        fragmentShader: Shader.fragmentShader,
        vertexColors: true
    })
    return material;
}
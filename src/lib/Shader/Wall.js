import * as THREE from 'three';

const vertexShader = `
uniform vec3 u_color;

uniform float time;
uniform float u_speed;
uniform float u_height;
varying float v_opacity;

void main() {

    vec3 vPosition = position * mod(time*u_speed, 1.0);

    v_opacity = mix(1.0, 0.0, position.y / u_height);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
`;
const fragmentShader = ` 
uniform vec3 u_color;
uniform float u_opacity;
varying float v_opacity;

void main() { 
    gl_FragColor = vec4(u_color, v_opacity * u_opacity);
}
`;


export default function (option) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_height: {
                value: option.height
            },
            u_speed: {
                value: option.speed
            },
            u_opacity: {
                value: option.opacity
            },
            u_color: {
                value: new THREE.Color(option.color)
            },
            time: {
                value: 0
            }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });
    console.log(option)
    return material;
}
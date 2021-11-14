import * as THREE from 'three';
import { UniformsUtils } from 'three';

export default class ShaderSourceUtils {
   constructor() { }
   public static replaceMain(shaderSourceString: string, renamedMain: string) {
      renamedMain = 'void ' + renamedMain + '()';
      return shaderSourceString.replace(/void\s+main\s*\(\s*(?:void)?\s*\)/g, renamedMain);
   }
   public static mergeUniforms(oldUniforms: any, addNewUniforms: any) {
      return UniformsUtils.merge([oldUniforms, addNewUniforms]);
   }

   public static Test(material: THREE.Material, color: THREE.Color) {
      material.onBeforeCompile = function (shaderobject: any, renderer: any) {
         shaderobject.uniforms = ShaderSourceUtils.mergeUniforms(shaderobject.uniforms, {
            test: {
               value: color
            }
         })
         shaderobject.fragmentShader = ShaderSourceUtils.replaceMain(shaderobject.fragmentShader, 'OldMain');
         shaderobject.fragmentShader +=
            '\n uniform  vec3 test;\n' +
            '\n void main(){\n' +
            '\n OldMain();\n' +
            '\n gl_FragColor = vec4(test,gl_FragColor.a); ' +
            '\n }';
      }
   }
}
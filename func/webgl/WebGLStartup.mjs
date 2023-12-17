import { Buffers } from "./Buffers.mjs"
import { DrawScene } from "./DrawScene.mjs"
import { ShaderProgram } from "./ShaderProgram.mjs"

export class WebGLSetup {
    vsSource = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 vertColor;
attribute vec3 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 fragColor;
varying vec3 fragNormal;

void main() {
    fragColor = vertColor;
    fragNormal = (uProjectionMatrix * uModelViewMatrix * vec4(aVertexNormal, 1.0)).xyz;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`

    fsSource = `
precision mediump float;

varying vec3 fragColor;
varying vec3 fragNormal;

void main() {
    vec3 direction = normalize(vec3(0.0, 0.0, -1.0));

    vec3 intensity = vec3(1.0, 1.0, 1.0) * max(dot(fragNormal, direction), 0.0);

    gl_FragColor = vec4(fragColor * intensity, 1.0);
}
`

    constructor() {
        const canvas = document.getElementById("hyperbolicCanvasWebGL")
        this.gl = canvas.getContext("webgl")

        if (this.gl === null) {
            alert(
                "Nemožno spustit WebGL. Váš prohlížeš ho nemusí podporovat!"
            )
            return
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    }

    /**
     * Resetuje WebGL canvas
     */
    GLReset() {
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }


    /**
     * Vykreslí trojúhelníky
     * @param {Array<number>} indices 
     * @param {Array<number>} vertices 
     * @param {Array<number>} normals 
     * @param {Array<number>} colors 
     * @param {number} amount 
     * @param {number} rotX 
     * @param {number} rotY 
     * @param {number} rotZ 
     */
    DrawTriangles(indices, vertices, normals, colors, amount, rotX, rotY, rotZ) {
        let b = new Buffers();
        const buffers = b.InitBuffers(this.gl, vertices, colors, indices, normals)

        let scene = new DrawScene();
        scene.DrawScene(this.gl, this.programInfo, buffers, amount, rotX, rotY, rotZ)

    }

    /**
     * Vytvoří shader program
     */
    InitShaderProgram() {
        let SP = new ShaderProgram(this.gl, this.vsSource, this.fsSource)
        let shaderProgram = SP.shaderProgram

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                vertexNormal: this.gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                vertexColor: this.gl.getAttribLocation(shaderProgram, "vertColor"),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                normalMatrix: this.gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
            },
        }
    }
}
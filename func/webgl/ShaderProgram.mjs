export class ShaderProgram {
    constructor(gl, vsSource, fsSource) {
        const vertexShader = this._LoadShader(gl, gl.VERTEX_SHADER, vsSource)
        const fragmentShader = this._LoadShader(gl, gl.FRAGMENT_SHADER, fsSource)

        let shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert(
                `Chyba při zapnutí shader programu: ${gl.getProgramIngoLog(shaderProgram)}`
            )
            return null
        }
        this.shaderProgram = shaderProgram
    }

    _LoadShader(gl, type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(
                `Chyba při kompilaci shaderu: ${gl.getShaderInfoLog(shader)}`
            )
            gl.deleteShader(shader)
            return null
        }
        return shader
    }
}
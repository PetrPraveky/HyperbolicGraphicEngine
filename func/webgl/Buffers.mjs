export class Buffers {
    InitBuffers(gl, positions, colors, indices, normals) {
        const positionBuffer = this._InitPositionBuffer(gl, positions)
        const colorBuffer = this._InitColorBuffer(gl, colors)
        const indexBuffer = this._InitIndexBuffer(gl, indices)
        const normalsBuffer = this._InitNormalsBuffer(gl, normals)

        return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
            normal: normalsBuffer
        }
    }

    _InitPositionBuffer(gl, positions) {
        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        return positionBuffer
    }

    _InitColorBuffer(gl, colors) {
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

        return colorBuffer
    }

    _InitIndexBuffer(gl, indices) {
        let indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        return indexBuffer
    }

    _InitNormalsBuffer(gl, normals) {
        let normalsBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

        return normalsBuffer
    }
}
export class DrawScene {
    DrawScene(gl, programInfo, buffers, amount, rotX, rotY, rotZ) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clearDepth(1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)

        gl.clear(gl.COLOR_BUFFER_BUT | gl.DEPTH_BUFFER_BIT)

        // Matice projekce (Orto)
        const projectionMatrix = new Float32Array(16)
        mat4.identity(projectionMatrix)

        // Matice modelu
        const modelViewMatrix = new Float32Array(16)
        mat4.identity(modelViewMatrix)

        // Matice normál
        const normalMatrix = mat4.create()
        mat4.invert(normalMatrix, modelViewMatrix)
        mat4.transpose(normalMatrix, normalMatrix)

        // Bude rotovať!
        mat4.rotate(        // Z
            modelViewMatrix,
            modelViewMatrix,
            rotZ,
            [0, 0, -1]
        )
        mat4.rotate(        // Y
            modelViewMatrix,
            modelViewMatrix,
            rotY,
            [0, 1, 0]
        )
        mat4.rotate(        // X
            modelViewMatrix,
            modelViewMatrix,
            rotX,
            [-1, 0, 0]
        )
        
        

        this._SetPositionAttribute(gl, programInfo, buffers)
        this._SetColorAttribute(gl, programInfo, buffers)
        this._SetNormalAttribute(gl, programInfo, buffers)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

        gl.useProgram(programInfo.program)


        // Aplikuje matice?
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
        )
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        )
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix,
        )


        {
            // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            gl.drawElements(gl.TRIANGLES, amount, gl.UNSIGNED_SHORT, 0)
        }
    }

    _SetPositionAttribute(gl, programInfo, buffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            3,
            gl.FLOAT,
            false,
            0,
            0,
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
    }

    _SetColorAttribute(gl, programInfo, buffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            3,
            gl.FLOAT,
            false,
            0,
            0,
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
    }
    
    _SetNormalAttribute(gl, programInfo, buffers) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            3,
            gl.FLOAT,
            false,
            0,
            0,
        )
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
    }
    
}
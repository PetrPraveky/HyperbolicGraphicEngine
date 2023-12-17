import { Hyperbolic3DRender } from "../func/geometry/hyperbolic/HyperbolicRender.mjs"
import { HyperbolicLine } from "../func/geometry/hyperbolic/HyperbolicLine.mjs"
import { Vector3D } from "../func/math/Vector.mjs"
import { HyperbolicPlaneBoundless } from "../func/geometry/hyperbolic/HyperbolicPlane.mjs"

let GEOM

export class INIT {
    constructor() {
        GEOM = new Hyperbolic3DRender(true, true, true)





        let sampleCubeColor = "rgba(255, 255, 255, 0.2)"
        // SAMPLE CUBE OUTLINE
        let cubeArrSample = [
            // || Z
            new HyperbolicLine(GEOM, new Vector3D(-3, -3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 3, -3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 3,  3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D(-3,  3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            // || X
            new HyperbolicLine(GEOM, new Vector3D( 0, -3, -3), new Vector3D(1, 0, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 0, -3,  3), new Vector3D(1, 0, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 0,  3,  3), new Vector3D(1, 0, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 0,  3, -3), new Vector3D(1, 0, 0), sampleCubeColor),
            // || Y
            new HyperbolicLine(GEOM, new Vector3D( 3,  0,  3), new Vector3D(0, 1, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 3,  0, -3), new Vector3D(0, 1, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D(-3,  0, -3), new Vector3D(0, 1, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D(-3,  0,  3), new Vector3D(0, 1, 0), sampleCubeColor),
        ]
        GEOM.RegisterObjects(cubeArrSample)

        let test = new HyperbolicPlaneBoundless(GEOM, new Vector3D(0, 0, 1));
        test.DrawPlane();

        GEOM.DrawAll()
        // this.RotateStart()
    }

    /**
     * Začne rotovat lol
     */
        RotateStart() {
            let aAdd = Math.PI/500
        
            GEOM.RotateAll(aAdd/2, aAdd, 0)
            GEOM.DrawAll()
            
            window.requestAnimationFrame(this.RotateStart.bind(this))
        }
}

new INIT();
import { Vector3D } from "../func/math/Vector.mjs"
import { HyperbolicLine } from "../func/geometry/hyperbolic/HyperbolicLine.mjs";
import { HyperbolicPlane } from "../func/geometry/hyperbolic/HyperbolicPlaneOLD.mjs";
import { Hyperbolic3DRender } from "../func/geometry/hyperbolic/HyperbolicRender.mjs";
import { HyperbolicPlaneBoundless } from "../func/geometry/hyperbolic/HyperbolicPlane.mjs";

let GEOM

export class INIT {
    constructor(GPU) {
        const c = document.getElementById("hyperbolicCanvas")

        const gpu = GPU

        GEOM = new Hyperbolic3DRender(true, true, true)
        GEOM.InitWebGL();

        let sampleCubeColor = "rgba(255, 255, 255, 0.2)"
        // SAMPLE CUBE OUTLINE
        let cubeArrSample = [
            // || Z
            // new HyperbolicLine(GEOM, new Vector3D(-3, -3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D( 3, -3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D( 3,  3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D(-3,  3,  0), new Vector3D(0, 0, 1), sampleCubeColor),
            // // || X
            // new HyperbolicLine(GEOM, new Vector3D( 0, -3, -3), new Vector3D(1, 0, 0), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D( 0, -3,  3), new Vector3D(1, 0, 0), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D( 0,  3,  3), new Vector3D(1, 0, 0), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D( 0,  3, -3), new Vector3D(1, 0, 0), sampleCubeColor),
            // || Y
            // new HyperbolicLine(GEOM, new Vector3D( 3,  0,  3), new Vector3D(0, 1, 0), sampleCubeColor),
            new HyperbolicLine(GEOM, new Vector3D( 3,  0, 0), new Vector3D(0, 1, 0), "rgba(255, 0, 0, 1)"),
            // new HyperbolicLine(GEOM, new Vector3D(-3,  0, -3), new Vector3D(0, 1, 0), sampleCubeColor),
            // new HyperbolicLine(GEOM, new Vector3D(-3,  0,  3), new Vector3D(0, 1, 0), sampleCubeColor),
        ]
        GEOM.RegisterObjects(cubeArrSample)

        
        // let samplePlane = new HyperbolicPlane(GEOM, new Vector3D(0, 0, 1))
        // GEOM.RegisterObject(samplePlane);

        // let samplePlane2 = new HyperbolicPlane(GEOM, new Vector3D(0, 0, -3))
        // GEOM.RegisterObject(samplePlane2);

        let test = new HyperbolicPlaneBoundless(GEOM, new Vector3D(3, 0, 0));
        GEOM.RegisterObject(test)
        
        let test1 = new HyperbolicPlaneBoundless(GEOM, new Vector3D(-3, -2, 3));
        // GEOM.RegisterObject(test1)

        // let samplePlane2 = new HyperbolicPlane(GEOM, new Vector3D(0, 1, 0))
        // GEOM.RegisterObject(samplePlane2);

        /*
        let cube = [
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(0, 0, 3)),
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(0, 0, -3)),
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(3, 0, 0)),
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(-3, 0, 3)),
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(0, 3, 0)),
            new HyperbolicPlaneBoundless(GEOM, new Vector3D(0, -3, 0)),
        ]
        */
        // GEOM.RegisterObjects(cube)

        //samplePlane.DrawPlane();
        /*
        let cubeArrPlanes = [
            new HyperbolicPlane(GEOM, new Vector3D(1, 0, 0)),
            new HyperbolicPlane(GEOM, new Vector3D(-1, 0, 0)),
            new HyperbolicPlane(GEOM, new Vector3D(0, 1, 0)),
            new HyperbolicPlane(GEOM, new Vector3D(0, -1, 0)),
            new HyperbolicPlane(GEOM, new Vector3D(0, 0, 1)),
            new HyperbolicPlane(GEOM, new Vector3D(0, 0, -1)),
            
        ]
        */
        // main()
        
        // GEOM.RegisterObjects(cubeArrPlanes)
        GEOM.DrawAll()
        // this.RotateStart();
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
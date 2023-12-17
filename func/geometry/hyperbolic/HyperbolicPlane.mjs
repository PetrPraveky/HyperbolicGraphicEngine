import { Vector3D, Vector3DFromArray, GetPerpendicularVector } from "../../math/Vector.mjs";
import { Hyperbolic3DRender } from "./HyperbolicRender.mjs";
import { HyperbolicLineData } from "./Space.mjs";
import { Matrix3x3 } from "../../math/Matrix.mjs";
import { HyperbolicLine } from "./HyperbolicLine.mjs";

export class HyperbolicPlaneBoundless {
    /**
     * Vytvoří hyperbolickou rovinu v Poincareho kulovém modelu pomocí vektoru nejkratší vzdálenosti k ní od počátku, stejně jako u přímek.
     * Dále, při jejím vykreslení, se vytvoří několik přímek definující tuto rovinu, množství je definováno v @see Hyperbolic3DRender#planeDetail 
     * parametru. Výsledné bordeli se hodí na WebGL (snad doufám)
     * @param {Hyperbolic3DRender} geometry 
     * @param {Vector3D} pos 
     */
    constructor(geometry, pos) {
        this.geometry = geometry
        this.space = geometry.space

        this.alpha = 0
        this.beta = 0
        this.gamma = 0

        let dir = GetPerpendicularVector(pos);
        dir.normalize()

        // Bordel
        this.pos = pos
        this.dir = dir

        let normal = pos.crossProduct(dir)
        normal.normalize()
        let b1base = pos.copy()
        b1base.normalize()
        let b3base = dir.copy()
        b3base.normalize()

        // Nasetuje vektory báze
        this.b1 = b1base
        this.b2 = b3base
        this.b3 = normal

        // Směrový vektor v bázy má souřadnici (||v||, 0, 0)
        let newPos = new Vector3D(pos.getMagnitude(), 0, 0);

        [this.x0, this.y0, this.ro, this.angleLow, this.angleHig] = HyperbolicLineData(this.space, newPos);


        // Data pro webgl
        this.allTrianglesI = [] // Indexy
        this.allTrianglesV = [] // Vrcholy
        this.allTrianglesN = [] // Normály
        this.allTrianglesC = [] // Barvy

        // Vygeneruje data
        this.CreateWebGLPoints();
    }

    /**
     * Změní úhly, např kvli rotaci
     * @param {number} a 
     * @param {number} b 
     * @param {number} g 
     */
    ChangeAngle(alpha, beta, gamma) {
        /*
        this.alpha += alpha % (2 * Math.PI);
        this.beta += beta % (2 * Math.PI);
        this.gamma += gamma % (2 * Math.PI);
        */
        this.alpha = (this.alpha > 2*Math.PI) ?  alpha : alpha + this.alpha
        this.beta = (this.beta > 2*Math.PI) ?  beta : beta + this.beta
        this.gamma = (this.gamma > 2*Math.PI) ? gamma : gamma + this.gamma
        
        let clear = "clear: both;"
        console.log("%c"+this.alpha, clear)
        console.log("%c"+this.beta, clear)
        console.log("%c"+this.gamma, clear)
    }

    CreateWebGLPoints() {
        let pointsBase = [
            this.x0 * this.b1.x,
            this.x0 * this.b1.y,
            this.x0 * this.b1.z,
        ]

        // let diff = (Math.abs(this.angleHig-this.angleLow))/(1/this.geometry.planeDetail);
        let m = this.geometry.planeDetail
        let diff = (Math.PI * 2) / m

        // Bodíky linie
        let firstLine = new HyperbolicLine(this.geometry, this.pos, this.dir);
        let points1 = firstLine.GetAllLinePoints(1 / this.geometry.planeDetail);

        let p = points1.length

        // Loopando
        for (let q = 0, i = 0; q < Math.PI * 2; q += diff, i++) {
            // Rotační matice podle osy X pro přímku
            let rotateXLine = new Matrix3x3(
                new Vector3D(1, 0, 0),
                new Vector3D(0, Math.cos(q), -Math.sin(q)),
                new Vector3D(0, Math.sin(q), Math.cos(q))
            )

            // Výroba bodů
            for (let i = 0; i < p; i++) {
                // Přepočítá bodíky :D
                let pB = Vector3DFromArray(points1[i]).multiplyByMatrix(rotateXLine).toArray();
                pB = [
                    (pointsBase[0] + (pB[0] * this.b1.x) + (pB[1] * this.b2.x) + (pB[2] * this.b3.x)) / this.geometry.r,
                    (pointsBase[1] + (pB[0] * this.b1.y) + (pB[1] * this.b2.y) + (pB[2] * this.b3.y))  / this.geometry.r,
                    (pointsBase[2] + (pB[0] * this.b1.z) + (pB[1] * this.b2.z) + (pB[2] * this.b3.z)) / this.geometry.r
                ]

                this.allTrianglesV.push(
                    ...[
                        pB[0], pB[1], -pB[2],
                    ]
                )

                this.allTrianglesC.push(
                    ...[
                        0.0, 1.0, 0.0,
                    ]
                )

                // Normálové vektory
                let n = Vector3DFromArray([
                    pB[0]*this.geometry.r - pointsBase[0],
                    pB[1]*this.geometry.r - pointsBase[1],
                    pB[2]*this.geometry.r - pointsBase[2],
                ])
                n.normalize()
                this.allTrianglesN.push(
                    ...[
                        -n.x,
                        -n.y,
                        n.z,
                    ]
                )
            }

            // Výroba indexů
            let n = i
            for (let j = 0; j < p - 1; j++) {
                // n * p -> "počet"
                // + j
                let b1 = n * p + j
                let b2 = n * p + j + 1
                let b3 = ((n + 1) % m) * p + j
                let b4 = ((n + 1) % m) * p + j + 1

                this.allTrianglesI.push(
                    ...[
                        b1, b2, b3,
                        b2, b3, b4
                    ]
                )
            }
        }
        this.allV = this.allTrianglesI.length
    }
}

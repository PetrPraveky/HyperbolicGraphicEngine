import { GetPerpendicularVector, Vector3D, Vector3DFromArray } from "../../math/Vector.mjs";
import { HyperbolicLineData } from "./Space.mjs";
import { Matrix3x3 } from "../../math/Matrix.mjs";
import { Hyperbolic3DRender } from "./HyperbolicRender.mjs";
import { HyperbolicLine } from "./HyperbolicLine.mjs";

export class HyperbolicPlane {
    /**
     * Vytvoří hyperbolickou rovinu v Poincareho kulovém modelu pomocí vektoru nejkratší vzdálenosti k ní od počátku, stejně jako u přímek.
     * Dále, při jejím vykreslení, se vytvoří několik přímek definující tuto rovinu, množství je definováno v @see Hyperbolic3DRender#planeDetail 
     * parametru. Vykresluje se pomocé trojúhelníků a jejich křízového součinu, jakožto ztmavntí/zesvětlení
     * @param {Hyperbolic3DRender} geometry 
     * @param {Vector3D} pos 
     * @param {string} color 
     * @param {string} name 
     */
    constructor(geometry, pos, color="white", name="") {
        this.geometry = geometry
        this.space = geometry.space

        this.color = color
        this.name = name

        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;

        this.triangles = []

        let dir = GetPerpendicularVector(pos);

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
    }

    /**
     * Vykreslí linii přes CPU
     */
    DrawPlane(color = this.color) {
        this.color = color;

        let pointBase = [
            this.x0*this.b1.x+this.y0*this.b2.x,
            this.x0*this.b1.y+this.y0*this.b2.y,
            this.x0*this.b1.z+this.y0*this.b2.z
        ]

        // Definice směru přímky
        let dir = this.dir;

        // Vytvoří body základní přímky
        let firstLine = new HyperbolicLine(this.geometry, this.pos, dir);
        let points1 = firstLine.GetAllLinePoints(this.geometry.planeDetail);

        let diff = (Math.abs(this.angleHig-this.angleLow))/(1/this.geometry.planeDetail);
        
        if (this.triangles.length == 0) {
            // Započne cykl generace
            for (let q = diff; q < Math.PI * 2-diff; q += diff) {
                // Rotační matice podle osy X pro přímku
                let rotateXLine = new Matrix3x3(
                    new Vector3D(1, 0, 0),
                    new Vector3D(0, Math.cos(diff), -Math.sin(diff)),
                    new Vector3D(0, Math.sin(diff), Math.cos(diff))
                )
    
                // Body druhé přímky
                let points2 = []
                for (let i = 0; i < points1.length; i++) {
                    // console.log(Vector3DFromArray(points1[i]))
                    // console.log(Vector3DFromArray(points1[i]).multiplyByMatrix(rotateXLine))
                    // console.log();
                    points2.push(Vector3DFromArray(points1[i]).multiplyByMatrix(rotateXLine).toArray())
                }
                //let points2 = secondLine.GetAllLinePoints(this.geometry.planeDetail);
    
                // PŘEPOČET BODŮ
                let P1 = []; let P2 = []; let P3 = []; let P4 = []
                for (let i = 0; i < points1.length-1; i++) {
                    // První bod
                    let p1 = CreatePoint(
                        points1[i], this.b1, this.b2, this.b3, pointBase
                    )
                    // První bod
                    let p2 = CreatePoint(
                        points2[i], this.b1, this.b2, this.b3, pointBase
                    )
                    // První bod
                    let p3 = CreatePoint(
                        points1[i+1], this.b1, this.b2, this.b3, pointBase
                    )
                    // První bod
                    let p4 = CreatePoint(
                        points2[i+1], this.b1, this.b2, this.b3, pointBase
                    )
                    P1.push(p1); P2.push(p2); P3.push(p3); P4.push(p4)
    
                    // console.log(p1)
                    // console.log(p2)
                    // console.log(p3)
                    // console.log(p4)
                    // console.log("\n")
                }

                // VYKRESLENÍ
                // this.DrawTriangles(P1, P2, P3, P4)
                this.triangles.push(...CreateTriangles(P1, P2, P3, P4))
                points1 = [...points2]
                // break
            }
            
        }
        console.log(this.triangles)
        this.DrawTriangles()


        /**
         * @param {Array<number>} points 
         * @param {Vector3D} b1 
         * @param {Vector3D} b2 
         * @param {Vector3D} bP 
         * @param {Matrix3x3} rX 
         * @param {Matrix3x3} rY 
         * @param {Matrix3x3} rZ 
         */
        function CreatePoint(points, b1, b2, b3, bP) {
            let P = [
                b1.x*points[0]+b2.x*points[1]+b3.x*points[2],
                b1.y*points[0]+b2.y*points[1]+b3.y*points[2],
                b1.z*points[0]+b2.z*points[1]+b3.z*points[2],
            ]
            let point = new Vector3D(
                bP[0]+P[0],
                bP[1]+P[1],
                bP[2]+P[2]
            ).toArray();

            return point;
        }

        /**
         * @param {Array<Array<number>>} P1 
         * @param {Array<Array<number>>} P2 
         * @param {Array<Array<number>>} P3 
         * @param {Array<Array<number>>} P4 
         */
        function CreateTriangles(P1, P2, P3, P4) {
            let triangles = []
            for (let i = 0; i < P1.length; i++) {
                let p1 = P1[i]
                let p2 = P2[i]
                let p3 = P3[i]
                let p4 = P4[i]

                // Bordel věci na osvětlení
                let a1 = new Vector3D(
                    p3[0]-p1[0],
                    p3[1]-p1[1],
                    p3[2]-p1[2],
                )
                let b1 = new Vector3D(
                    p2[0]-p1[0],
                    p2[1]-p1[1],
                    p2[2]-p1[2],
                )

                let a2 = new Vector3D(
                    p3[0]-p4[0],
                    p3[1]-p4[1],
                    p3[2]-p4[2],
                )
                let b2 = new Vector3D(
                    p2[0]-p4[0],
                    p2[1]-p4[1],
                    p2[2]-p4[2],
                )

                let n1 = a1.crossProduct(b1)
                n1.normalize();
                let n2 = b2.crossProduct(a2)
                n2.normalize();

                let s1 = [
                    (p1[0]+p2[0]+p3[0])/3,
                    (p1[1]+p2[1]+p3[1])/3,
                    (p1[2]+p2[2]+p3[2])/3,
                ]
                let s2 = [
                    (p2[0]+p3[0]+p4[0])/3,
                    (p2[1]+p3[1]+p4[1])/3,
                    (p2[2]+p3[2]+p4[2])/3,
                ]

                triangles.push([p1, p2, p3, n1.toArray(), s1])
                triangles.push([p2, p3, p4, n2.toArray(), s2])
            }
            return triangles
        }
    }


    DrawTriangles() {
        // Rotace
        // Podle osy X
        let rotationMatrixX = new Matrix3x3(
            new Vector3D(1, 0, 0),
            new Vector3D(0, Math.cos(this.alpha), -Math.sin(this.alpha)),
            new Vector3D(0, Math.sin(this.alpha), Math.cos(this.alpha))
        )
        // Podle osy Y
        let rotationMatrixY = new Matrix3x3(
            new Vector3D(Math.cos(this.beta), 0, -Math.sin(this.beta)),
            new Vector3D(0, 1, 0),
            new Vector3D(Math.sin(this.beta), 0, Math.cos(this.beta))
        )
        // Podle osy Z
        let rotationMatrixZ = new Matrix3x3(
            new Vector3D(Math.cos(this.gamma), -Math.sin(this.gamma), 0),
            new Vector3D(Math.sin(this.gamma), Math.cos(this.gamma), 0),
            new Vector3D(0, 0, 1)
        )

        let newTriangles = []
        for (let t = 0; t < this.triangles.length; t++) {
            let triangle = this.triangles[t]
            // Aplikuje rotace na body
            let points = []
            for (let i = 0; i < triangle.length; i++) {
                points.push(
                    Vector3DFromArray(triangle[i])
                        .multiplyByMatrix(rotationMatrixX)
                        .multiplyByMatrix(rotationMatrixY)
                        .multiplyByMatrix(rotationMatrixZ)
                        .toArray()
                )
            }
            newTriangles.push(points)
        }
        // Nasortuje podle vzdálenosti jeji středu na ose Z
        newTriangles.sort(function(a, b) {return a[4] - b[4]})


        // Vykreslí
        for (let t = 0; t < newTriangles.length; t++) {
            let triangle = newTriangles[t]
            let opacity = -Vector3DFromArray(triangle[3]).dotProduct(this.geometry.cameraVector)
            
            if (opacity < 0.2) continue

            

            let p1 = RecalculatePointPos(triangle[0], this.geometry)
            let p2 = RecalculatePointPos(triangle[1], this.geometry)
            let p3 = RecalculatePointPos(triangle[2], this.geometry)

            this.geometry.ctx.beginPath()
            this.geometry.ctx.moveTo(p1[0], p1[1])
            this.geometry.ctx.lineTo(p2[0], p2[1])
            this.geometry.ctx.lineTo(p3[0], p3[1])
            this.geometry.ctx.closePath()
            
            this.geometry.ctx.fillStyle = `rgba(0,${255*opacity},0,1)`
            this.geometry.ctx.fill();
        }

        function RecalculatePointPos(point, geom) {
            return [
                point[0]*geom.scale+geom.center.x,
                geom.center.y-point[1]*geom.scale,
            ]
        }
    }











    DrawTrianglesOld(P1, P2, P3, P4) {
        for (let i = 0; i < P1.length; i++) {
            let p1 = P1[i]
            let p2 = P2[i]
            let p3 = P3[i]
            let p4 = P4[i]


            // Bordel věci na osvětlení
            let a1 = new Vector3D(
                p3[0]-p1[0],
                p3[1]-p1[1],
                p3[2]-p1[2],
            )
            let b1 = new Vector3D(
                p2[0]-p1[0],
                p2[1]-p1[1],
                p2[2]-p1[2],
            )

            let a2 = new Vector3D(
                p3[0]-p4[0],
                p3[1]-p4[1],
                p3[2]-p4[2],
            )
            let b2 = new Vector3D(
                p2[0]-p4[0],
                p2[1]-p4[1],
                p2[2]-p4[2],
            )



            let n1 = a1.crossProduct(b1)
            n1.normalize();
            let n2 = b2.crossProduct(a2)
            n2.normalize();

            let opacity1 = n1.dotProduct(this.geometry.cameraVector)
            let opacity2 = n2.dotProduct(this.geometry.cameraVector)

            // console.log([opacity1, opacity2])
            
            p1 = RecalculatePointPos(p1, this.geometry);
            p2 = RecalculatePointPos(p2, this.geometry);
            p3 = RecalculatePointPos(p3, this.geometry);
            p4 = RecalculatePointPos(p4, this.geometry);
            
            if (opacity1 == NaN) opacity1 = 0;
            if (opacity2 == NaN) opacity2 = 0;

            // Vykreslí bordel
            if (opacity1 >= 0) {
                this.geometry.ctx.beginPath()
                this.geometry.ctx.moveTo(p1[0], p1[1])
                this.geometry.ctx.lineTo(p2[0], p2[1])
                this.geometry.ctx.lineTo(p3[0], p3[1])
                this.geometry.ctx.closePath()
    
                this.geometry.ctx.fillStyle = `rgba(0,${255*opacity1},0,1)`
                this.geometry.ctx.fill();
            }

            if (opacity2 >= 0) {
                this.geometry.ctx.beginPath()
                this.geometry.ctx.moveTo(p4[0], p4[1])
                this.geometry.ctx.lineTo(p2[0], p2[1])
                this.geometry.ctx.lineTo(p3[0], p3[1])
                this.geometry.ctx.closePath()
                
                this.geometry.ctx.fillStyle = `rgba=(0,${255*opacity2},0,1)`
                this.geometry.ctx.fill();
            }


        }
        function RecalculatePointPos(point, geom) {
            return [
                point[0]*geom.scale+geom.center.x,
                geom.center.y-point[1]*geom.scale,
            ]
        }
    }

    /**
     * Nastaví úhly na nové úhly, pro rotaci např
     * @param {number} alpha 
     * @param {number} beta 
     * @param {number} gamma 
     */
    ChangeAngle(alpha, beta, gamma) {
        this.alpha += alpha
        this.beta += beta
        this.gamma += gamma
    }
}
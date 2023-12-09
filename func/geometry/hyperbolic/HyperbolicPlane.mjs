import { GetPerpendicularVector, Vector3D } from "../Vector.mjs";
import { HyperbolicLineData } from "./Space.mjs";
import { Matrix3x3 } from "../Matrix.mjs";
import { Hyperbolic3DRender } from "./HyperbolicRender.mjs";

export class HyperbolicPlane {
    constructor(geometry, pos, color="white", name="") {
        this.geometry = geometry
        this.space = geometry.space

        this.color = color
        this.name = name

        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;

        let dir = GetPerpendicularVector(pos);

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

        let pointBase = [
            this.x0*this.b1.x+this.y0*this.b2.x,
            this.x0*this.b1.y+this.y0*this.b2.y,
            this.x0*this.b1.z+this.y0*this.b2.z
        ]


        // Vykreslí trojúhelníčky :D
        /*
        let start = this.angleHig-Math.PI
        let end = this.angleHig
        
        
        let r = Math.abs(this.y0+this.ro*Math.sin(this.angleLow))
        let diff = (r*2)/(1/this.geometry.planeDetail);
        
        // Body kružnice :D
        let pointsLine = []
        for (let y = -r, i = 0; y <= r; y += diff, i++) {


            // Bodíky
            let points = []
            for (let z = -Math.sqrt(Math.pow(r, 2)-Math.pow(y, 2)); z <= Math.sqrt(Math.pow(r, 2)-Math.pow(y, 2)); z += diff) {
                let x = Math.sqrt(Math.pow(this.ro, 2)-Math.pow(y, 2)-Math.pow(z, 2))

                let X = -(x-this.ro)*this.b1.x + y*this.b2.x + z*this.b3.x
                let Y = -(x-this.ro)*this.b1.y + y*this.b2.y + z*this.b3.y
                let Z = -(x-this.ro)*this.b1.z + y*this.b2.z + z*this.b3.z

                let p = new Vector3D(X, Y, Z)
                p = p
                    .multiplyByMatrix(rotationMatrixX)
                    .multiplyByMatrix(rotationMatrixY)
                    .multiplyByMatrix(rotationMatrixZ)
                    .toArray()

                points.push(p)
            }
            pointsLine.push(points)
        }
        
        console.log(pointsLine)

        console.log(this.ro)
        */

        /*
        for (let q = 0; q < end-diff; q += diff) {
            let P1 = []; let P2 = []
            // První řada bodů
            for (let t = this.angleLow; t < this.angleHig-diff; t += diff) {
                let add1 = [
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.x+this.ro*Math.sin(t)*Math.sin(q)*this.b2.x+this.ro*Math.cos(q)*this.b3.x,
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.y+this.ro*Math.sin(t)*Math.sin(q)*this.b2.y+this.ro*Math.cos(q)*this.b3.y,
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.z+this.ro*Math.sin(t)*Math.sin(q)*this.b2.z+this.ro*Math.cos(q)*this.b3.z
                ]
                let add2 = [
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.x+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.x+this.ro*Math.cos(q)*this.b3.x,
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.y+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.y+this.ro*Math.cos(q)*this.b3.y,
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.z+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.z+this.ro*Math.cos(q)*this.b3.z
                ]
    
                let point1 = new Vector3D(
                    pointBase[0]+add1[0],
                    pointBase[1]+add1[1],
                    pointBase[2]+add1[2]
                )
                let point2 = new Vector3D(
                    pointBase[0]+add2[0],
                    pointBase[1]+add2[1],
                    pointBase[2]+add2[2]
                )
                
    
                point1 = point1
                    .multiplyByMatrix(rotationMatrixX)
                    .multiplyByMatrix(rotationMatrixY)
                    .multiplyByMatrix(rotationMatrixZ)
                    .toArray()
    
                point2 = point2
                    .multiplyByMatrix(rotationMatrixX)
                    .multiplyByMatrix(rotationMatrixY)
                    .multiplyByMatrix(rotationMatrixZ)
                    .toArray()

                P1.push(point1); P2.push(point2)
            }

            q += diff;

            // Druhá řada bodů
            let P3 = []; let P4 = []
            for (let t = this.angleLow; t < this.angleHig-diff; t += diff) {
                let add1 = [
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.x+this.ro*Math.sin(t)*Math.sin(q)*this.b2.x+this.ro*Math.cos(q)*this.b3.x,
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.y+this.ro*Math.sin(t)*Math.sin(q)*this.b2.y+this.ro*Math.cos(q)*this.b3.y,
                    this.ro*Math.cos(t)*Math.sin(q)*this.b1.z+this.ro*Math.sin(t)*Math.sin(q)*this.b2.z+this.ro*Math.cos(q)*this.b3.z
                ]
                let add2 = [
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.x+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.x+this.ro*Math.cos(q)*this.b3.x,
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.y+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.y+this.ro*Math.cos(q)*this.b3.y,
                    this.ro*Math.cos(t+diff)*Math.sin(q)*this.b1.z+this.ro*Math.sin(t+diff)*Math.sin(q)*this.b2.z+this.ro*Math.cos(q)*this.b3.z
                ]
    
                let point1 = new Vector3D(
                    pointBase[0]+add1[0],
                    pointBase[1]+add1[1],
                    pointBase[2]+add1[2]
                )
                let point2 = new Vector3D(
                    pointBase[0]+add2[0],
                    pointBase[1]+add2[1],
                    pointBase[2]+add2[2]
                )
                
    
                point1 = point1
                    .multiplyByMatrix(rotationMatrixX)
                    .multiplyByMatrix(rotationMatrixY)
                    .multiplyByMatrix(rotationMatrixZ)
                    .toArray()
    
                point2 = point2
                    .multiplyByMatrix(rotationMatrixX)
                    .multiplyByMatrix(rotationMatrixY)
                    .multiplyByMatrix(rotationMatrixZ)
                    .toArray()

                P3.push(point1); P4.push(point2)
            }
            q -= diff;
            this.DrawTriangles(P1, P2, P3, P4)
        }
        */
    }

    DrawTriangles(P1, P2, P3, P4) {
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
            let n2 = a2.crossProduct(b2)
            n2.normalize();

            let opacity1 = n1.dotProduct(this.geometry.cameraVector)
            let opacity2 = n2.dotProduct(this.geometry.cameraVector)
            
            p1 = RecalculatePointPos(p1, this.geometry);
            p2 = RecalculatePointPos(p2, this.geometry);
            p3 = RecalculatePointPos(p3, this.geometry);
            p4 = RecalculatePointPos(p4, this.geometry);
            
            if (opacity1 == NaN) opacity1 = 0;
            if (opacity2 == NaN) opacity2 = 0;

            // Vykreslí bordel
            this.geometry.ctx.beginPath()
            this.geometry.ctx.moveTo(p1[0], p1[1])
            this.geometry.ctx.lineTo(p2[0], p2[1])
            this.geometry.ctx.lineTo(p3[0], p3[1])
            this.geometry.ctx.closePath()
            
            this.geometry.ctx.fillStyle = `rgba(0,${255*Math.abs(opacity1)},0,1)`
            this.geometry.ctx.fill();


            this.geometry.ctx.beginPath()
            this.geometry.ctx.moveTo(p4[0], p4[1])
            this.geometry.ctx.lineTo(p2[0], p2[1])
            this.geometry.ctx.lineTo(p3[0], p3[1])
            this.geometry.ctx.closePath()
            
            this.geometry.ctx.fillStyle = `rgba=(0,${255*Math.abs(opacity2)},0,1)`
            this.geometry.ctx.fill();
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
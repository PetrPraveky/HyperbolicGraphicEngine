import { Vector3D } from "../geometry/Vector.mjs";
import { HyperbolicLineData } from "./Space.mjs";
import { Matrix3x3 } from "../geometry/Matrix.mjs";
import { GPU_HyperbolicLineDraw } from "../GPU/HyperbolicLineDraw.mjs";
import { Hyperbolic3DRender } from "./hyperbolicRender.mjs";

export class HyperbolicLine {
    /**
     * Vytvoří hyperbolickou linii pomocí vektoru kolmého na ní -> nejhratší vzdálenost 
     * od bodu (0,0,0) a jejího směrového vektoru
     * @param {Hyperbolic3DRender} geometry 
     * @param {Vector3D} dir 
     * @param {Vector3D} pos 
     * 
     * Linie se vytvoří pomocí vypočtení vektorového součinu vstupních vektorů a jejich následnou
     * normalizací -> vzniknou vektory nové báze podprostoru prostoru ℝ³, která splňuje následující podmínky:
     *      (1) Nový podprostor je pouze otočením základního prostoru o nějaké úhly α, β, γ podle souřadnicových os
     *      (2) V novém podprostoru je vektor a směrový vektor přímky v půdorysně (množina vektorů se z = 0), proto
     *          se může použít řešení z desmosu, viz funkce v @function CalculateLinePoints()
     * Vektor se přepočítá do souřadnic v rámci nové báze a v těchto souřadnicích jsou i výstumní body linie/křivky.
     * Tyto body se přepočítají jako nějaký vektory, který je vysledkem lineární kombinace vektorů báze a skalárů,
     * které se vezmou z položek souřadnicového vektorů
     * 
     * Body výsledné linie/křivky jsou vráceny pomocí inverzní matice transformace bází
     */
    constructor(geometry, pos, dir, color="white", name="") {
        this.geometry = geometry
        this.space = geometry.space

        this.color = color
        this.name = name

        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;

        this.savedPoints = new Map();

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


    DrawLineGPU(color = this.color) {
        GPU_HyperbolicLineDraw(this);
    }

    /**
     * Vykreslí linii přes CPU
     */
    DrawLine(color = this.color) {
        this.color = color
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

        if (this.savedPoints.size == 0) {
            let diff = (Math.abs(this.angleHig-this.angleLow))/(1/this.space.distribution)
            // Mělo by generovat, snad
            let pointBase = [
                this.x0*this.b1.x+this.y0*this.b2.x,
                this.x0*this.b1.y+this.y0*this.b2.y,
                this.x0*this.b1.z+this.y0*this.b2.z
            ]
    
            this.geometry.ctx.beginPath();
            // Zkontroluje, jestli musí body spočítat
            let i = 0;
            for (let t = this.angleLow; t < this.angleHig; t += diff) {            
                let add1 = [
                    this.ro*Math.cos(t)*this.b1.x+this.ro*Math.sin(t)*this.b2.x,
                    this.ro*Math.cos(t)*this.b1.y+this.ro*Math.sin(t)*this.b2.y,
                    this.ro*Math.cos(t)*this.b1.z+this.ro*Math.sin(t)*this.b2.z
                ]
                let add2 = [
                    this.ro*Math.cos(t+diff)*this.b1.x+this.ro*Math.sin(t+diff)*this.b2.x,
                    this.ro*Math.cos(t+diff)*this.b1.y+this.ro*Math.sin(t+diff)*this.b2.y,
                    this.ro*Math.cos(t+diff)*this.b1.z+this.ro*Math.sin(t+diff)*this.b2.z
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
                this.savedPoints.set(i, point1)
                i++;
                this._DrawMiniLines(point1, point2, rotationMatrixX, rotationMatrixY, rotationMatrixZ)
            }
            this.geometry.ctx.stroke();   
        } else {
            console.log("woo")
            let lastKey = -1;
            for (const [key, value] of this.savedPoints) {
                if (lastKey == -1) {
                    lastKey = key
                    continue
                } else {
                    this._DrawMiniLines(this.savedPoints.get(lastKey), value, rotationMatrixX, rotationMatrixY, rotationMatrixZ)
                    lastKey = key
                }
            }
            this.geometry.ctx.stroke(); 
        }
        
        



    }

    _DrawMiniLines(point1, point2, rotationMatrixX, rotationMatrixY, rotationMatrixZ) {
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

        
        point1 = RecalculatePointPos(point1, this.geometry)
        point2 = RecalculatePointPos(point2, this.geometry)

        this.geometry.ctx.strokeStyle = this.color
        this.geometry.ctx.moveTo(Math.floor(point1[0]), Math.floor(point1[1]));
        this.geometry.ctx.lineTo(Math.floor(point2[0]), Math.floor(point2[1]))

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
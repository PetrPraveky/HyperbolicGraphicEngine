import { Matrix3x3 } from "../../math/Matrix.mjs";
import { Vector3D, Vector3DFromArray } from "../../math/Vector.mjs";
import { WebGLSetup } from "../../webgl/WebGLStartup.mjs";
import { HyperbolicLine } from "./HyperbolicLine.mjs"
import { HyperbolicPlaneBoundless } from "./HyperbolicPlane.mjs";
import { HyperbolicPlane } from "./HyperbolicPlaneOLD.mjs"
import { Space } from "./Space.mjs"



export class Hyperbolic3DRender {
    DEFAULT_BORDER = "white"
    DEFAULT_OUTLINE = "rgba(255, 255, 255, 0.25)"
    DEFAULT_BGC = "black"
    DEFAULT_COLOR = "white"
    /**
     * Konstruktor pro 2D hyperbolický render. Vytvoří základní věci, pokud chceme.
     * - hasBorder -> vykreslí kolem prostoru border
     * - hasOutlines -> vykreslí základní outliny (směry)
     * - hasBackground -> vytvoří background
     * 
     * Jak vypadá prostor?
     * A y
     * |
     * |     z
     * |  /
     * | /
     * |/
     * 0-----------------> x
     * 
     * Základní barvy: border: bílá, outlines: bílá (a = .25), background: černá
     * @param {canvas} canvas
     * @param {boolean} hasBorder 
     * @param {boolean} hasOutlines 
     * @param {boolean} hasBackground 
     */
    constructor (hasBorder, hasOutlines, hasBackground, gpu) {
        this.canvas = document.getElementById("hyperbolicCanvas")
        this.mainCanvas = document.getElementById("hyperbolicCanvasMain")

        this.ctx = this.canvas.getContext("2d")
        this.mainCtx = this.mainCanvas.getContext("2d")

        this.saved = new Map();
        this.slot = 0

        // Základní barvy
        this.borderColor = "white"
        this.outlinColor = "rgba(255, 255, 255, 0.25)"
        this.backgrColor = "black"

        this.hasBorder = hasBorder;
        this.hasOutlines = hasOutlines;
        this.hasBackground = hasBackground;

        // Detaily
        this.planeDetail = 30;
        this.lineDetail = 30;

        // Základní vlastnosti
        this.center = new Vector3D(this.canvas.width/2, this.canvas.height/2, 0)
        this.r = 10
        this.scale = this.center.x/this.r
        this.space = new Space(this.r)

        // Rerender
        this._Render()
    }

    InitWebGL() {
        this.webgl = new WebGLSetup();
        this.webgl.InitShaderProgram();
    }

    /**
     * Funkce na rerender -> pokud je třeba aktualizace barev, etc
     * NEPOUŽÍVÁ SE, PRO PŘERENDEROVÁNÍ POUŽÍT Rerender()
     */
    _Render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


        // Pozadí
        /*
        if (this.hasBackground) {
            this.ctx.fillStyle = this.backgrColor
            this.ctx.beginPath()
            this.ctx.arc(this.center.x, this.center.y, this.center.x,0,2*Math.PI);
            this.ctx.fill()
        }
        */

        // Border
        if (this.hasBorder) {
            this.ctx.strokeStyle = this.borderColor
            this.ctx.beginPath()
            this.ctx.arc(this.center.x, this.center.y, this.center.x,0,2*Math.PI);
            this.ctx.stroke()
        }

        // Outlines
        if (this.hasOutlines) {

        }

        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
        this.ctx.fill()
    }
    /**
     * POUŽÍVÁ SE INTERNĚ, SPOJÍ CANVASY
     */
    _Combine() {
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
        this.mainCtx.drawImage(document.getElementById("hyperbolicCanvasWebGL"), 0, 0)
        this.mainCtx.drawImage(this.canvas, 0, 0);
    }


    /**
     * Vše převykreslí/vykreslí
     */
    DrawAll() {
        this._Render();
        for (const [slot, obj] of this.saved) {
            this.Draw(obj)
        }
        this._Combine()
    }

    /**
     * Vykreslí objekt v 3D Hyperbolickém prostoru.
     * @param {*} obj 
     */
    Draw(obj, color="", single=false) {
        if (obj instanceof HyperbolicLine) {
            if (color == "") color = obj.color
            obj.DrawLine(color);
        } else if (obj instanceof HyperbolicPlaneBoundless) {
            // Vykreslí přes openGL
            

            this.webgl.DrawTriangles(
                obj.allTrianglesI,
                obj.allTrianglesV,
                obj.allTrianglesN,
                obj.allTrianglesC,
                obj.allTrianglesI.length,
                obj.alpha,
                obj.beta,
                obj.gamma
            )
            
        } else {
            // OUTPUT ERR
            console.log((typeof obj).toString()+" : Není renderovatelný")
        }
        if (single) {
            this._Combine()
        }
    }

    /**
     * Uloží data objektu v hyperbolickým rendereru
     * @param {*} obj 
     */
    RegisterObjects(objs) {
        objs.forEach(item => {
            this.RegisterObject(item)
        })
    }

    /**
     * Uloží data objektu v hyperbolickým rendereru
     * @param {*} obj 
     */
    RegisterObject(obj, color="white") {
        let name = obj.name
        if (this.saved.get(obj.name) != undefined) {
            // OUTPUT ERR
            obj.name = ""
        }
        if (obj.name == "") {
            name = this.slot 
            this.slot++
        }

        this.saved.set(name, obj)
        return "Registered"
    }

    /**
     * Otočí itemy v prosotru o úhel -> bude potřeba znovu zavolat @method DrawAll()
     * @param {number} alpha 
     * @param {number} beta 
     * @param {number} gamma 
     */
    RotateAll(alpha, beta, gamma) {
        this.webgl.GLReset();
        for (const [slot, obj] of this.saved) {
            obj.ChangeAngle(alpha, beta, gamma)
            if (obj instanceof HyperbolicPlaneBoundless) {
                this.Draw(obj)
            }
        }
    }
}

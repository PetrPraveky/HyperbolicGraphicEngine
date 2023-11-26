import { Matrix3x3 } from "../Matrix.mjs"
import { Vector3D, Vector3DFromArray } from "../Vector.mjs"
import { HyperbolicLine } from "./HyperbolicLine.mjs"
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
    constructor (canvas, hasBorder, hasOutlines, hasBackground, gpu) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")

        this.saved = new Map();
        this.slot = 0

        // Základní barvy
        this.borderColor = "white"
        this.outlinColor = "rgba(255, 255, 255, 0.25)"
        this.backgrColor = "black"

        this.hasBorder = hasBorder;
        this.hasOutlines = hasOutlines;
        this.hasBackground = hasBackground;

        // Rerender
        this._Render()
    }

    /**
     * Funkce na rerender -> pokud je třeba aktualizace barev, etc
     * NEPOUŽÍVÁ SE, PRO PŘERENDEROVÁNÍ POUŽÍT Rerender()
     */
    _Render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // Základní vlastnosti
        this.center = new Vector3D(this.canvas.width/2, this.canvas.height/2, 0)
        this.r = 10
        this.scale = this.center.x/this.r
        this.space = new Space(this.r)

        // Pozadí
        if (this.hasBackground) {
            this.ctx.fillStyle = this.backgrColor
            this.ctx.beginPath()
            this.ctx.arc(this.center.x, this.center.y, this.center.x,0,2*Math.PI);
            this.ctx.fill()
        }

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
     * Vše převykreslí/vykreslí
     */
    DrawAll() {
        this._Render();
        for (const [slot, obj] of this.saved) {
            this.Draw(obj)
        }
    }

    /**
     * Vykreslí objekt v 3D Hyperbolickém prostoru.
     * @param {*} obj 
     */
    Draw(obj, color="") {
        if (obj instanceof HyperbolicLine) {
            if (color == "") color = obj.color
            obj.DrawLine(color);
        } else {
            // OUTPUT ERR
            console.log((typeof obj).toString()+" : Není renderovatelný")
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
        for (const [slot, obj] of this.saved) {
            obj.ChangeAngle(alpha, beta, gamma)
        }
    }
}

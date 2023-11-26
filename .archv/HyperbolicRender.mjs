import { Matrix3x3 } from "../geometry/Matrix.mjs"
import { Vector3D, Vector3DFromArray } from "../geometry/Vector.mjs"
import { CalculateLinePoints, CalculateLinePointsInSpace, Space } from "./Space.mjs"

export class StartHyperbolic2DRender {
    DEFAULT_BORDER = "white"
    DEFAULT_OUTLINE = "rgba(255, 255, 255, 0.25)"
    DEFAULT_BGC = "black"
    /**
     * Konstruktor pro 2D hyperbolický render. Vytvoří základní věci, pokud chceme.
     * - hasBorder -> vykreslí kolem prostoru border
     * - hasOutlines -> vykreslí základní outliny (směry)
     * - hasBackground -> vytvoří background
     * Základní barvy: border: bílá, outlines: bílá (a = .25), background: černá
     * @param canvas 
     * @param {boolean} hasBorder 
     * @param {boolean} hasOutlines 
     * @param {boolean} hasBackground 
     */
    constructor (canvas, hasBorder, hasOutlines, hasBackground) {
        // Basic hodnoty
        this.SAVEDPOINTS = new Map();


        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")

        // Základní barvy
        this.borderColor = "white"
        this.outlinColor = "rgba(255, 255, 255, 0.25)"
        this.backgrColor = "black"

        this.hasBorder = hasBorder;
        this.hasOutlines = hasOutlines;
        this.hasBackground = hasBackground;

        // Rerender
        this.Rerender()
        // Listener (na test) na přidávání při kliku
        this.canvas.addEventListener("mousedown", (e) => this.Click(e))
    }
    /**
     * Čistě testovací funkce -> !!! NEPOUŽÍVAT
     */
    Click(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x = e.clientX-rect.left;
        let y = e.clientY-rect.top;
    
        // Úplnej základ
        x = (x-this.center.x)/this.scale
        y = (this.center.y-y)/this.scale
    
        //this.ctx.strokeStyle = "#"+Math.floor(Math.random()*16777215).toString(16)
        this.ctx.strokeStyle = "red"
        this.DrawLine(new Vector3D(x, y, 0))
    }

    /**
     * Funkce na rerender -> pokud je třeba aktualizace barev, etc
     * Volá se vždy při reloadu a znovu sestavení
     */
    Rerender() {
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

        // Outline
        if (this.hasOutlines) {
            // Základní vektory, pro vytvoření outline
            let outlineVecs = [
                new Vector3D(-1, 0, 0),
                new Vector3D(1, 0, 0),
                new Vector3D(0, -1, 0),
                new Vector3D(0, 1, 0),
            ]

            this.ctx.strokeStyle = this.outlinColor
            // Vykreslí osy X a Y
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.center.y);
            this.ctx.lineTo(this.center.x*2, this.center.y)
            this.ctx.moveTo(this.center.x, 0);
            this.ctx.lineTo(this.center.x, this.center.y*2)
            this.ctx.stroke(); 
            // Vykreslení s 0.5 vzdáleností (z 10)
            for (let m = 0.5; m < this.r; m += 0.5) {
                outlineVecs.forEach(outline => {
                    let vec = outline.copy();
                    vec.scale(m)
                    vec = this.space.RecalculateVectorHyperDistance(vec)
                    //console.log(vec)
                    this.DrawLine(vec)
                })
            }
        }
    }

    /**
     * Vykreslí čáru s vektorem -> vektor by měl být v hyperbolické formě
     * @param {*} ctx 
     * @param {Space} space 
     * @param {Vector3D} vector 
     */
    DrawLine(vector) {
        let circlePoints = CalculateLinePoints(this.space, vector)
        
        let firstPoint = [
            circlePoints[0][0]*this.scale+this.center.x,
            this.center.y-circlePoints[0][1]*this.scale,
        ]
        
        this.ctx.beginPath();
        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        for (let i = 1; i < circlePoints.length; i++) {
            let point = [
                circlePoints[i][0]*this.scale+this.center.x,
                this.center.y-circlePoints[i][1]*this.scale,
            ]
            this.ctx.lineTo(point[0], point[1])
        }
        this.ctx.stroke()
    }
}

// ##################################################################################################
// ##################################################################################################
// ##################################################################################################


// ##################################################################################################
// ##################################################################################################
// ##################################################################################################

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
     * @param canvas 
     * @param {boolean} hasBorder 
     * @param {boolean} hasOutlines 
     * @param {boolean} hasBackground 
     */
    constructor (canvas, hasBorder, hasOutlines, hasBackground) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext("2d")

        // Základní barvy
        this.borderColor = "white"
        this.outlinColor = "rgba(255, 255, 255, 0.25)"
        this.backgrColor = "black"

        this.hasBorder = hasBorder;
        this.hasOutlines = hasOutlines;
        this.hasBackground = hasBackground;

        // Rerender
        this._Render()
        // Listener (na test) na přidávání při kliku
        //this.canvas.addEventListener("mousedown", (e) => this.Click(e))
    }

    /**
     * Funkce na rerender -> pokud je třeba aktualizace barev, etc
     * NEPOUŽÍVÁ SE, PRO PŘERENDEROVÁNÍ POUŽÍT Rerender()
     */
    _Render() {
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
            /*
            let allOutlineVectors = []
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    for (let k = -1; k < 2; k++) {
                        // Pokud střed, čau
                        if (i == 0 && j == 0 && k == 0) {
                            continue
                        }
                        allOutlineVectors.push(new Vector3D(i, j, k))
                    }
                }
            }
    
            // Vykreslí basic linie
            allOutlineVectors.forEach(item => {
                this.DrawLine(item, 0, "rgba(255, 255, 255, 0.25)", true, "__base_outline")
                this.DrawLine(item, Math.PI/2, "rgba(255, 255, 255, 0.25)", true, "__base_outline")
            })
            */
            // this.DrawLine(new Vector3D(1, 1, 1), 0, "rgba(205, 50, 0, 0.5)", true, "__base_outline")
            // this.DrawLine(new Vector3D(-1, -1, -1), 0, "rgba(255, 0, 0, 0.5)", true, "__base_outline")
            //this.DrawLine(new Vector3D(1, 1, 1), 0, "rgba(155, 100, 0, 0.5)", true, "__base_outline")
            //this.DrawLine(new Vector3D(0, 1, 1), 0, "rgba(0, 255, 0, 0.25)", true, "__base_outline")
            // this.DrawLine(new Vector3D(1, 0, 1), Math.PI/2, "rgba(0, 0, 255, 0.25)", true, "__base_outline")

            // this.DrawLine(new Vector3D(1, 0, 0), 0, "red", true)
            // this.DrawLine(new Vector3D(0, 1, 0), 0, "red", true)
        }

        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
        this.ctx.fill()

    }


    /**
     * Provede aktualizaci renderu -> !! Vykreslí pouze uložená data
     */
    Rerender() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

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

        for (let [key, value] of this.SAVEDPOINTS) {
            let color = key.split("{")[1].split("}")[0]
            this.RedrawLine(value, color)
        }

        this.ctx.fillStyle = "white"
        this.ctx.beginPath()
        this.ctx.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
        this.ctx.fill()
    }



    /**
     * Vykreslí linii v 3D Hyperbolickém prosotru. Udělá to pomocí vektoru !koulmého na linii -> nejhratší vzdálenost od středu
     * a úhel směrového vektoru přímky
     * Barva je ve stringu, jako v CSS
     * @param {Vector3D} pos
     * @param {number} angle 
     * @param {String} color  
     * @param {boolean} [save=false] 
     * @param {string} [name=""] 
     */
    DrawLine(pos, angle, color, save=false, name="") {
        let allPointsRight = []

        // Prohodí souřadnice, protože lenost
        // Změní velikost vektoru -> ať je správná
        let rightVector = pos.copy()
        rightVector = this.space.RecalculateVectorHyperDistance(rightVector)

        console.log(pos)
        console.log(rightVector)

        // Přehodí správně souřadnice
        let allPointsWrong = CalculateLinePointsInSpace(this.space, rightVector, angle)

        allPointsRight = []
        allPointsWrong.forEach(point => {
            allPointsRight.push([
                point[0], point[1], point[2]
            ])
        })

        // Začne kreslit
        let firstPoint = RecalculatePointPos(allPointsRight[0], this)
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        allPointsRight.forEach(point => {
            let rightPoint = RecalculatePointPos(point, this)
            this.ctx.lineTo(rightPoint[0], rightPoint[1])
        })
        this.ctx.stroke()

        // Uloží
        if (save) {
            this.SavePointsByName(allPointsRight, name, color)
        }


        this.ctx.strokeStyle = this.DEFAULT_COLOR

        // Pouze pomocná funkce
        function RecalculatePointPos(point, geom) {
            return [
                point[0]*geom.scale+geom.center.x,
                geom.center.y-point[1]*geom.scale,
            ]
        }
    }

    /**
     * Znovu vykreslí linii. Potřebuje array bodů ve formě arraye
     * @param {Array} points 
     * @param {String} color 
     */
    RedrawLine(points, color) {
        // Začne kreslit
        let firstPoint = RecalculatePointPos(points[0], this)
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.moveTo(firstPoint[0], firstPoint[1])
        points.forEach(point => {
            let rightPoint = RecalculatePointPos(point, this)
            this.ctx.lineTo(rightPoint[0], rightPoint[1])
        })
        this.ctx.stroke()

        // Pouze pomocná funkce
        function RecalculatePointPos(point, geom) {
            return [
                point[0]*geom.scale+geom.center.x,
                geom.center.y-point[1]*geom.scale,
            ]
        }
    }

    /**
     * Uloží Array Arrayů bodů za jméno, rgba, pokud je, a 
     * @param {Array} points 
     * @param {String} name 
     * @param {string} [color="white"] 
     */
    SavePointsByName(points, name, color="white") {
        if (this.SAVEDPOINTS === undefined) {
            this.SAVEDPOINTS = new Map()
        }
        this.SAVEDPOINTS.set(name+"_{"+color+"}"+"__"+this._generateUUIDv4(), points)
    }


    /**
     * Otočí celý prostor o úhel po osách x, y, z
     * @param {number} xA 
     * @param {number} yA 
     * @param {number} zA 
     */
    RotateSpace(xA, yA, zA) {
        // Rotační matrix
        let rotationMatrixY = new Matrix3x3(
            new Vector3D(Math.cos(yA), 0, -Math.sin(yA)),
            new Vector3D(0, 1, 0),
            new Vector3D(Math.sin(yA), 0, Math.cos(yA))
        )
        let rotationMatrixX = new Matrix3x3(
            new Vector3D(1, 0, 0),
            new Vector3D(0, Math.cos(xA), -Math.sin(xA)),
            new Vector3D(0, Math.sin(xA), Math.cos(xA))
        )
        let rotationMatrixZ = new Matrix3x3(
            new Vector3D(Math.cos(zA), -Math.sin(zA), 0),
            new Vector3D(Math.sin(zA), Math.cos(zA), 0),
            new Vector3D(0, 0, 1)
        )
        
        for (let [key, value] of this.SAVEDPOINTS) {
            let newPoints = []
            value.forEach(point => {
                let pointVec = Vector3DFromArray(point)
                let rotatedVec = pointVec.multiplyByMatrix(rotationMatrixX).multiplyByMatrix(rotationMatrixY).multiplyByMatrix(rotationMatrixZ)

                newPoints.push([rotatedVec.x, rotatedVec.y, rotatedVec.z])
            })
            this.SAVEDPOINTS.set(key, newPoints)
        }
    }


    _generateUUIDv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}

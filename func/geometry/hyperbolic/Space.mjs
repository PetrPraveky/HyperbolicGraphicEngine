import { Matrix3x3 } from "../Matrix.mjs";
import { Vector3D, Vector3DFromArray } from "../Vector.mjs";

export class Space {
    /**
     * Konsturktor na vytvoření základu pro hyperbolický prostor -> všechny vnitřní metody se budeou snad zpracováváat ručně, 
     * jen se budou vracet metody na vykreslení (jiný modul)
     * 
     * Vše je vytvořené na bázi Poincarre modelu, úplná inspirace je jeho diskový model
     * @param {float} r 
     */
    constructor(r) {
        this.r = r;
        this.r2 = r*r;

        this.distribution = 0.1e-1;
    }
}


/**
 * Vytvoří linii na hyperbolické ploše na bázi linie v euklidovském prostoru. Vstupem je vektor, který je nejkratší a ukazuje na tu linii kolmo.
 * @param {Space} space 
 * @param {Vector3D} vector 
 */
export function HyperbolicLineData(space, vector) {
    // Nějaké základní kraviny -> brané z mého výpočtu v Desmosu
    // https://www.desmos.com/calculator/gymjqu8iun
    let r = space.r     // Z prostoru
    let d1 = vector.x   // Z Vektoru
    let d2 = vector.y
    vector = new Vector3D(vector.x, vector.y, 0)
    let d = vector.getMagnitude()

    // x0, y0 -> střed "kruhu", jehož oblouk bude linie
    let x0 = Math.sqrt((Math.pow(r, 4) + 2*Math.pow(r, 2)*Math.pow(d, 2) + Math.pow(d, 4))/(4*Math.pow(d, 2)))*(d1/d)
    let y0 = Math.sqrt((Math.pow(r, 4) + 2*Math.pow(r, 2)*Math.pow(d, 2) + Math.pow(d, 4))/(4*Math.pow(d, 2)))*(d2/d)

    // Ró -> poloměr toho "kruhu"
    let ro = Math.sqrt(Math.pow(x0, 2) + Math.pow(y0, 2)) - d

    // Vypočítá body průniku B[x1, y1], A[x2, y2]
    let x1 = 0
    let x2 = 0
    let y1 = 0
    let y2 = 0
    // Pokud y0 není 0, pak by se dělilo 0
    if (y0 != 0) {
        // Kraviny na přímku, viz desmos
        let m = -(x0/y0)
        let c = (Math.pow(ro, 2) - (Math.pow(x0, 2) + Math.pow(y0, 2) + Math.pow(r, 2)))/(-2*y0)

        x1 = (-2*m*c + Math.sqrt(Math.pow(2*m*c, 2) - 4*(1 + Math.pow(m, 2))*(Math.pow(c, 2) - Math.pow(r, 2))))/(2*(1 + Math.pow(m ,2)))
        x2 = (-2*m*c - Math.sqrt(Math.pow(2*m*c, 2) - 4*(1 + Math.pow(m, 2))*(Math.pow(c, 2) - Math.pow(r, 2))))/(2*(1 + Math.pow(m ,2)))

        y1 = m*x1 + c
        y2 = m*x2 + c
    } else {
        x1 = (Math.pow(ro, 2) - Math.pow(x0, 2) - Math.pow(r, 2))/(-2*x0)
        x2 = (Math.pow(ro, 2) - Math.pow(x0, 2) - Math.pow(r, 2))/(-2*x0)

        y1 = -Math.sqrt(Math.pow(r, 2) - Math.pow(((Math.pow(ro, 2) - Math.pow(x0, 2) - Math.pow(r, 2))/(-2*x0)), 2))
        y2 = Math.sqrt(Math.pow(r, 2) - Math.pow(((Math.pow(ro, 2) - Math.pow(x0, 2) - Math.pow(r, 2))/(-2*x0)), 2))
    }

    // Úhly bordel to je
    // Úhel pro A
    let AangleD = Math.atan2(y2-y0, x2-x0)
    let Aangle = 0
    if (AangleD >= 0) {
        Aangle = AangleD
    } else {
        Aangle = 2*Math.PI+AangleD
    }
    // Úhel pro B
    let BangleD = Math.atan2(y1-y0, x1-x0)
    let Bangle = 0
    if (y0 > 0 || (x0 > 0 & y0 == 0)) {
        Bangle = 2*Math.PI+BangleD
    } else {
        Bangle = BangleD
    }

    // Horní a dolní limita úhlu
    let low = Math.min(Aangle, Bangle)
    let hig = Math.max(Aangle, Bangle)

    return [x0, y0, ro, low, hig]
}
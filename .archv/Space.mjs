import { Plane } from "../geometry/3D/Plane.mjs";
import { Matrix3x3 } from "../geometry/Matrix.mjs";
import { Vector3D, Vector3DFromArray } from "../geometry/Vector.mjs";

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

        this.distribution = 0.1e-2;
    }

    /**
     * Přepočítá vektor, aby měl správnou velikost na hyperbolické ploše
     * Vychází z https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model#Distance
     * @param {Vector3D} d 
     */
    RecalculateVectorHyperDistance(d) {
        // let dist = d.getMagnitude()
        
        // let delta = 2*(Math.pow(dist, 2))/(Math.pow(this.r, 2)-Math.pow(dist, 2))

        // let finalDistance = Math.acosh(1+delta)

        // d.normalize()
        // d.scale(finalDistance)

        // return d

        
        let dist = d.getMagnitude()
        let hyperDist = this.HyperLenApprox(dist)

        d.normalize()
        d.scale(hyperDist)

        return d
        
    }

    /**
     * Přepočítá vektor, aby měl správnou velikost na euclidovské ploše
     * Vyhází z LaTeX: \int_0^d (1+\frac{x^2}{1+x^2})^{1/2}dx
     * @param {Vector3D} d 
     */
    RecalculateVectorEuclidDistance(d) {

    }
    /**
     * Aproximační metoda
     * @param {number} x 
     * @returns 
     */
    HyperLenApprox(x) {
        return 1.1221*Math.pow(x, 1.0869)
    }
}

/**
 * Vytvoří linii v hyperbolickém 3D prostoru. Jeho podřadnou funkcí je "CaluclateLinePoints".
 * Vector je sklopen do roviny a výsledné body jsou zpětně promítnuty na rovinu definovanou tímto vektorem
 * Rovina je tvořena vstupním vektorem a směrovým vektorem přímky rovnoběžné s XY (XZ), který je pootožený o
 * úhel alpha -> směrový vektor výsledné přímky
 * @param {Space} space 
 * @param {Vector3D} vector 
 */
export function CalculateLinePointsInSpace(space, vector, angle) {
    if (vector.z == 0) {
        return CalculateLinePoints(space, vector)
    }

    // Rovina kolmá na vstupní vektor -> vytvoření směrového vektoru přímky
    let dirBase = new Vector3D(-vector.y, vector.x, 0)

    if (dirBase.isZero()) {
        dirBase = new Vector3D(1, 0, 0)
    }

    let basePlaneNormalVector = vector.copy()
    basePlaneNormalVector.normalize()
    
    let scale1st = dirBase.copy()
    scale1st.scale(Math.cos(angle))
    let scale2nd = dirBase.copy()
    scale2nd.scale(Math.sin(angle))
    
    let dir = scale1st.add(basePlaneNormalVector.crossProduct(scale2nd))

    // Vytvočí normálový vektor roviny, která porchází počátkem a směrem je vstupní vektor a směrový vektor přímky pootočená o úhel alpha
    let planeNormalVector = vector.crossProduct(dir)

    /**
     * Dir, PlaneNormalVector, Vector -> vektory nové báze
    */
    let e1 = planeNormalVector.copy();
    e1.normalize()
    let e2 = vector.copy();
    e2.normalize()
    let e3 = dir.copy();
    e3.normalize()
    
    // Matice pro přesun
    let matrixToNewBase = new Matrix3x3(e1, e2, e3)
    let matrixToOldBase = matrixToNewBase.getInverse()
    
    // Nový počátek v rovině XY
    let newBase = vector.multiplyByMatrix(matrixToOldBase);

    console.log("--")
    console.log(newBase)

    // Vypočítá body na rovině XY
    //let projectedVector = new Vector3D(vector.x, vector.y, 0)
    let projectedPoints = CalculateLinePoints(space, newBase)

   //console.log(projectedPoints)

    let finalPoints = []
    projectedPoints.forEach(point => {
        let finalPoint = Vector3DFromArray(point).multiplyByMatrix(matrixToNewBase)
        finalPoints.push([
            finalPoint.x,
            finalPoint.z,
            finalPoint.y,
        ])

        
        // console.table(
        //     [
        //         finalPoint.x,
        //         finalPoint.z,
        //         finalPoint.y,
        //     ]
        //     )
    })

    return finalPoints
}

/**
 * Vytvoří linii na hyperbolické ploše na bázi linie v euklidovském prostoru. Vstupem je vektor, který je nejkratší a ukazuje na tu linii kolmo.
 * @param {Space} space 
 * @param {Vector3D} vector 
 */
export function CalculateLinePoints(space, vector) {
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

    // Body pro křivku
    let points = []
    let low = Math.min(Aangle, Bangle)
    let hig = Math.max(Aangle, Bangle)
    let diff = (Math.abs(hig-low))/(1/space.distribution)
    // Mělo by generovat, snad
    for (let t = low; t <= hig; t += diff) {
        points.push([
            x0+ro*Math.cos(t),
            y0+ro*Math.sin(t),
            0
        ])
    }

    return points
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
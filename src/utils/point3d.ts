export default class Point3d {
    constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}
    
    public add(point: Point3d): Point3d{
        return new Point3d(this.x + point.x, this.y + point.y, this.z + point.z);
    }
    
    public multiplyByScalar(scalar: number): Point3d{
        return new Point3d(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    public calculateManhattanDistance(point: Point3d) : number{
        return Math.abs(this.x - point.x) + Math.abs(this.y - point.y) +  Math.abs(this.z - point.z);
    }

    public toString(): string{
        return `(${this.x},${this.y},${this.z})`
    }
}
export default class Point {
    constructor(public readonly x: number, public readonly y: number) {}
    
    public add(point: Point): Point{
        return new Point(this.x + point.x, this.y + point.y);
    }
    
    public multiplyByScalar(scalar: number): Point{
        return new Point(this.x * scalar, this.y * scalar);
    }

    public calculateManhattanDistance(point: Point) : number{
        return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
    }
}
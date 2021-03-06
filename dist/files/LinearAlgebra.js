"use strict";
// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan)
Object.defineProperty(exports, "__esModule", { value: true });
const Pt_1 = require("./Pt");
const Op_1 = require("./Op");
/**
 * Vec provides static function for vector operations. It's not yet optimized but good enough to use.
 */
class Vec {
    /**
     * Add b to vector `a`
     * @returns vector `a`
     */
    static add(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b[i] || 0;
        }
        return a;
    }
    /**
     * Subtract `b` from vector `a`
     * @returns vector `a`
     */
    static subtract(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b[i] || 0;
        }
        return a;
    }
    /**
     * Multiply `b` with vector `a`
     * @returns vector `a`
     */
    static multiply(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise multiply since the array lengths don't match: ${a.toString()} multiply-with ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b[i];
        }
        return a;
    }
    /**
     * Divide `a` over `b`
     * @returns vector `a`
     */
    static divide(a, b) {
        if (typeof b == "number") {
            if (b === 0)
                throw new Error("Cannot divide by zero");
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise divide since the array lengths don't match. ${a.toString()} divide-by ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b[i];
        }
        return a;
    }
    /**
     * Dot product of `a` and `b`
     */
    static dot(a, b) {
        if (a.length != b.length)
            throw new Error("Array lengths don't match");
        let d = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            d += a[i] * b[i];
        }
        return d;
    }
    /**
     * 2D cross product of `a` and `b`
     */
    static cross2D(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    /**
     * 3D Cross product of `a` and `b`
     */
    static cross(a, b) {
        return new Pt_1.Pt((a[1] * b[2] - a[2] * b[1]), (a[2] * b[0] - a[0] * b[2]), (a[0] * b[1] - a[1] * b[0]));
    }
    /**
     * Magnitude of `a`
     */
    static magnitude(a) {
        return Math.sqrt(Vec.dot(a, a));
    }
    /**
     * Unit vector of `a`. If magnitude of `a` is already known, pass it in the second paramter to optimize calculation.
     */
    static unit(a, magnitude = undefined) {
        let m = (magnitude === undefined) ? Vec.magnitude(a) : magnitude;
        if (m === 0)
            throw new Error("Cannot calculate unit vector because magnitude is 0");
        return Vec.divide(a, m);
    }
    /**
     * Set `a` to its absolute value in each dimension
     * @returns vector `a`
     */
    static abs(a) {
        return Vec.map(a, Math.abs);
    }
    /**
     * Set `a` to its floor value in each dimension
     * @returns vector `a`
     */
    static floor(a) {
        return Vec.map(a, Math.floor);
    }
    /**
     * Set `a` to its ceiling value in each dimension
     * @returns vector `a`
     */
    static ceil(a) {
        return Vec.map(a, Math.ceil);
    }
    /**
     * Set `a` to its rounded value in each dimension
     * @returns vector `a`
     */
    static round(a) {
        return Vec.map(a, Math.round);
    }
    /**
     * Find the max value within a vector's dimensions
     * @returns an object with `value` and `index` that specifies the max value and its corresponding dimension.
     */
    static max(a) {
        let m = Number.MIN_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.max(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    /**
     * Find the min value within a vector's dimensions
     * @returns an object with `value` and `index` that specifies the min value and its corresponding dimension.
     */
    static min(a) {
        let m = Number.MAX_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.min(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    /**
     * Sum all the dimensions' values
     */
    static sum(a) {
        let s = 0;
        for (let i = 0, len = a.length; i < len; i++)
            s += a[i];
        return s;
    }
    /**
     * Given a mapping function, update `a`'s value in each dimension
     * @returns vector `a`
     */
    static map(a, fn) {
        for (let i = 0, len = a.length; i < len; i++) {
            a[i] = fn(a[i], i, a);
        }
        return a;
    }
}
exports.Vec = Vec;
/**
 * Mat provides static function for matrix operations. It's not yet optimized but good enough to use.
 */
class Mat {
    /**
     * Matrix additions. Matrices should have the same rows and columns.
     * @param a a group of Pt
     * @param b a scalar number, an array of numeric arrays, or a group of Pt
     * @returns a group with the same rows and columns as a and b
     */
    static add(a, b) {
        if (typeof b != "number") {
            if (a[0].length != b[0].length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
            if (a.length != b.length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
        }
        let g = new Pt_1.Group();
        let isNum = typeof b == "number";
        for (let i = 0, len = a.length; i < len; i++) {
            g.push(a[i].$add((isNum) ? b : b[i]));
        }
        return g;
    }
    /**
     * Matrix multiplication
     * @param a a Group of M Pts, each with K dimensions (M-rows, K-columns)
     * @param b a scalar number, an array of numeric arrays, or a Group of K Pts, each with N dimensions (K-rows, N-columns) -- or if transposed is true, then N Pts with K dimensions
     * @param transposed (Only applicable if it's not elementwise multiplication) If true, then a and b's columns should match (ie, each Pt should have the same dimensions). Default is `false`.
     * @param elementwise if true, then the multiplication is done element-wise. Default is `false`.
     * @returns If not elementwise, this will return a group with M Pt, each with N dimensions (M-rows, N-columns).
     */
    static multiply(a, b, transposed = false, elementwise = false) {
        let g = new Pt_1.Group();
        if (typeof b != "number") {
            if (elementwise) {
                if (a.length != b.length)
                    throw new Error("Cannot multiply matrix element-wise because the matrices' sizes don't match.");
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    g.push(a[ai].$multiply(b[ai]));
                }
            }
            else {
                if (!transposed && a[0].length != b.length)
                    throw new Error("Cannot multiply matrix if rows in matrix-a don't match columns in matrix-b.");
                if (transposed && a[0].length != b[0].length)
                    throw new Error("Cannot multiply matrix if transposed and the columns in both matrices don't match.");
                if (!transposed)
                    b = Mat.transpose(b);
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    let p = Pt_1.Pt.make(b.length, 0);
                    for (let bi = 0, blen = b.length; bi < blen; bi++) {
                        p[bi] = Vec.dot(a[ai], b[bi]);
                    }
                    g.push(p);
                }
            }
        }
        else {
            for (let ai = 0, alen = a.length; ai < alen; ai++) {
                g.push(a[ai].$multiply(b));
            }
        }
        return g;
    }
    /**
     * Zip one slice of an array of Pt. Imagine the Pts are organized in rows, then this function will take the values in a specific column.
     * @param g a group of Pt
     * @param idx index to zip at
     * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
     */
    static zipSlice(g, index, defaultValue = false) {
        let z = [];
        for (let i = 0, len = g.length; i < len; i++) {
            if (g[i].length - 1 < index && defaultValue === false)
                throw `Index ${index} is out of bounds`;
            z.push(g[i][index] || defaultValue);
        }
        return new Pt_1.Pt(z);
    }
    /**
     * Zip a group of Pt. eg, [[1,2],[3,4],[5,6]] => [[1,3,5],[2,4,6]]
     * @param g a group of Pt
     * @param defaultValue a default value to fill if index out of bound. If not provided, it will throw an error instead.
     * @param useLongest If true, find the longest list of values in a Pt and use its length for zipping. Default is false, which uses the first item's length for zipping.
     */
    static zip(g, defaultValue = false, useLongest = false) {
        let ps = new Pt_1.Group();
        let len = (useLongest) ? g.reduce((a, b) => Math.max(a, b.length), 0) : g[0].length;
        for (let i = 0; i < len; i++) {
            ps.push(Mat.zipSlice(g, i, defaultValue));
        }
        return ps;
    }
    /**
     * Same as `zip` function
     */
    static transpose(g, defaultValue = false, useLongest = false) {
        return Mat.zip(g, defaultValue, useLongest);
    }
    /**
     * Transform a 2D point given a 2x3 or 3x3 matrix
     * @param pt a Pt to be transformed
     * @param m 2x3 or 3x3 matrix
     * @returns a new transformed Pt
     */
    static transform2D(pt, m) {
        let x = pt[0] * m[0][0] + pt[1] * m[1][0] + m[2][0];
        let y = pt[0] * m[0][1] + pt[1] * m[1][1] + m[2][1];
        return new Pt_1.Pt(x, y);
    }
    /**
     * Get a scale matrix for use in `transform2D`
     */
    static scale2DMatrix(x, y) {
        return new Pt_1.Group(new Pt_1.Pt(x, 0, 0), new Pt_1.Pt(0, y, 0), new Pt_1.Pt(0, 0, 1));
    }
    /**
     * Get a rotate matrix for use in `transform2D`
     */
    static rotate2DMatrix(cosA, sinA) {
        return new Pt_1.Group(new Pt_1.Pt(cosA, sinA, 0), new Pt_1.Pt(-sinA, cosA, 0), new Pt_1.Pt(0, 0, 1));
    }
    /**
     * Get a shear matrix for use in `transform2D`
     */
    static shear2DMatrix(tanX, tanY) {
        return new Pt_1.Group(new Pt_1.Pt(1, tanX, 0), new Pt_1.Pt(tanY, 1, 0), new Pt_1.Pt(0, 0, 1));
    }
    /**
     * Get a translate matrix for use in `transform2D`
     */
    static translate2DMatrix(x, y) {
        return new Pt_1.Group(new Pt_1.Pt(1, 0, 0), new Pt_1.Pt(0, 1, 0), new Pt_1.Pt(x, y, 1));
    }
    /**
     * Get a matrix to scale a point from an origin point. For use in `transform2D`
     */
    static scaleAt2DMatrix(sx, sy, at) {
        let m = Mat.scale2DMatrix(sx, sy);
        m[2][0] = -at[0] * sx + at[0];
        m[2][1] = -at[1] * sy + at[1];
        return m;
    }
    /**
     * Get a matrix to rotate a point from an origin point. For use in `transform2D`
     */
    static rotateAt2DMatrix(cosA, sinA, at) {
        let m = Mat.rotate2DMatrix(cosA, sinA);
        m[2][0] = at[0] * (1 - cosA) + at[1] * sinA;
        m[2][1] = at[1] * (1 - cosA) - at[0] * sinA;
        return m;
    }
    /**
     * Get a matrix to shear a point from an origin point. For use in `transform2D`
     */
    static shearAt2DMatrix(tanX, tanY, at) {
        let m = Mat.shear2DMatrix(tanX, tanY);
        m[2][0] = -at[1] * tanY;
        m[2][1] = -at[0] * tanX;
        return m;
    }
    /**
     * Get a matrix to reflect a point along a line. For use in `transform2D`
     * @param p1 first end point to define the reflection line
     * @param p1 second end point to define the reflection line
     */
    static reflectAt2DMatrix(p1, p2) {
        let intercept = Op_1.Line.intercept(p1, p2);
        if (intercept == undefined) {
            return [
                new Pt_1.Pt([-1, 0, 0]),
                new Pt_1.Pt([0, 1, 0]),
                new Pt_1.Pt([p1[0] + p2[0], 0, 1])
            ];
        }
        else {
            let yi = intercept.yi;
            let ang2 = Math.atan(intercept.slope) * 2;
            let cosA = Math.cos(ang2);
            let sinA = Math.sin(ang2);
            return [
                new Pt_1.Pt([cosA, sinA, 0]),
                new Pt_1.Pt([sinA, -cosA, 0]),
                new Pt_1.Pt([-yi * sinA, yi + yi * cosA, 1])
            ];
        }
    }
}
exports.Mat = Mat;
//# sourceMappingURL=LinearAlgebra.js.map

const compose = (a, b) => x => a(b(x));
const flipMatrixHorizontally = array => [...array].reverse();
const flipMatrixVertically = array => [...array].map(row => [...row].reverse());
const get = id => array => array[id];
const map = (fn, array) => array.map(fn);
const extractColumn = (index, data) => map(get(index), data);
const rangeFrom = ({length}) => [...Array(length).keys()];
const flipMatrixDiagonally = matrix => (
  map(index => extractColumn(index, matrix), rangeFrom(matrix))
);
const rotateMatrix = compose(flipMatrixDiagonally, flipMatrixHorizontally);
//const flipMatrixCounterClockwise = compose(flipMatrixHorizontally, rotateMatrix);
const rotateMatrixCounterClockwise = compose(flipMatrixHorizontally, flipMatrixDiagonally);
const generateAllMatrixPermutations = array => {
    const result = [];
    result.push(array);
    result.push(rotateMatrix(array));
    result.push(rotateMatrix(result[1]));
    result.push(rotateMatrix(result[2]));
    return result.reduce((result, matrix) => {
        result.push(matrix);
        result.push(flipMatrixHorizontally(matrix));
        result.push(flipMatrixVertically(matrix));
        return result; 
    }, []);
}

export {rotateMatrix, flipMatrixHorizontally, flipMatrixDiagonally, flipMatrixVertically, rotateMatrixCounterClockwise, generateAllMatrixPermutations}
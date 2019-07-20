//======================================================================
/*
 Generate array with nRows+2 & nCols +2 so that it's easier to calculate smooth noise without boundary checking.
 Smooth noise -> make the position influenced by the nearest 8 cells.
*/
//=====================================================================
const PI = (3.14159265359)
function LERP(a, b, f) { return (a * (1.0 - f) + b * f) }
function cosLerp(a, b, f) {
    var angle = f * PI;
    var newF = (Math.cos(angle) + 1.0) * 0.5;
    var result = LERP(b, a, newF);
    return result;
}
function SmoothNoiseGenerator(nRows, nCols, Roughness, nOctaves) {
    this.nRows = nRows;
    this.nCols = nCols;
    this.Roughness = Roughness;
    this.nOctaves = nOctaves;
    this.noiseArr = [];
    this.smoothNoiseArr = [];
    //can't seed random number generator in js
    initNoiseArr(this);
    initSmoothNoiseArr(this);
}

function initNoiseArr(generator) {
    for (var i = 0; i < generator.nRows + 2; i++) {
        var currentRow = i * generator.nCols;
        for (var j = 0; j < generator.nCols + 2; j++) {
            generator.noiseArr[j + currentRow] = Math.random();
        }
    }
}
function initSmoothNoiseArr(generator) {
    //==========================
	/*
			x	x	x
			x	?	x
			x	x	x
	influence '?' by each 'x'
	*/
    //=========================
    const CORNER_FACTOR = 16.0;
    const SIDES_FACTOR = 8.0;
    const CENTER_FACTOR = 4.0;

    var max = -1;
    for (var i = 0, k = 1; i < generator.nRows; i++ , k++) {
        var noiseArrRowWidth = generator.nCols + 2;
        var currNoiseRow = k * (noiseArrRowWidth);
        var currRow = i * generator.nCols;
        var upperRow, downRow;
        for (var j = 0, m = 1; j < generator.nCols; j++ , m++) {
            generator.smoothNoiseArr[j + (currRow)] = 0;
            //upper row
            upperRow = currNoiseRow - (noiseArrRowWidth);
            generator.smoothNoiseArr[j + (currRow)] += generator.noiseArr[m + (upperRow) - 1] / CORNER_FACTOR +
                generator.noiseArr[m + (upperRow)] / SIDES_FACTOR +
                generator.noiseArr[m + (upperRow) + 1] / CORNER_FACTOR;
            //current row
            generator.smoothNoiseArr[j + (currRow)] += generator.noiseArr[m + (currRow) - 1] / SIDES_FACTOR +
                generator.noiseArr[m + (currRow)] / CENTER_FACTOR +
                generator.noiseArr[m + (currRow) + 1] / SIDES_FACTOR;
            //down row
            downRow = currNoiseRow + noiseArrRowWidth;
            generator.smoothNoiseArr[j + (currRow)] += generator.noiseArr[m + (downRow) - 1] / CORNER_FACTOR +
                generator.noiseArr[m + (downRow)] / SIDES_FACTOR +
                generator.noiseArr[m + (downRow) + 1] / CORNER_FACTOR;

            if (max < generator.smoothNoiseArr[j + (currRow)]) max = generator.smoothNoiseArr[j + (currRow)];
        }
    }
    var totalLen = generator.nRows * generator.nCols;
    for (var i = 0; i < totalLen; i++) {
        generator.smoothNoiseArr[i] /= max;
    }
}
function getValue(generator, x, y) {

    var intX = Math.floor(x);
    var intY = Math.floor(y);
    var floatX = x - intX;
    var floatY = y - intY;

    var nextCol = (intX + 1) % generator.nCols;
    var nextRow = (intY + 1) % generator.nRows;
    var lerpXR1 = cosLerp(generator.smoothNoiseArr[intX + intY * generator.nCols],
        generator.smoothNoiseArr[nextCol + intY * generator.nCols],
        floatX);
    var lerpXR2 = cosLerp(generator.smoothNoiseArr[intX + nextRow * generator.nCols],
        generator.smoothNoiseArr[nextCol + nextRow * generator.nCols],
        floatX);

    return cosLerp(lerpXR1, lerpXR2, floatY);
}
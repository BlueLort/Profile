var canvas = document.getElementById("imageGeneratedCanvas");
var ctx = canvas.getContext("2d");
function generateImage(data, width, height) {
    var p = new PNGlib(width, height, 256); // construcor takes height, weight and color-depth
    var background = p.color(0, 0, 0, 0); // set the background transparent
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var val = 255 * data[j + i * width];
            p.buffer[p.index(j, i)] = p.color(val, val, val);
        }
    }
    return p.getBase64();
}
$("#roughness").change(function () {
    $("#" + this.id + "Val").html(this.value / 100);
});
$("#octaves").change(function () {
    $("#" + this.id + "Val").html(this.value);
});
$("#widthhmap").change(function () {
    $("#" + this.id + "Val").html(this.value);
});
$("#heighthmap").change(function () {
    $("#" + this.id + "Val").html(this.value);
});
$("#generateHMap").click(function () {
    var width = parseInt($("#widthhmapVal").text());
    var height = parseInt($("#heighthmapVal").text());
    var roughness = parseFloat($("#roughnessVal").text());
    var octaves = parseInt($("#octavesVal").text());
    var generator = new SmoothNoiseGenerator(height, width, roughness, octaves);
    var data = [];
    var max = -1;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var roughVal = 1;
            var freq = 1.0 / Math.pow(2, octaves + 1);
            data[j + i * width] = getValue(generator, j * freq, i * freq) * roughVal;
            freq *= 2.0;
            roughVal *= roughness;
            for (var k = 0; k < octaves; k++) {
                data[j + i * width] += getValue(generator, j * freq, i * freq) * roughVal;
                freq *= 2.0;
                roughVal *= roughness;
            }
            if (max < data[j + i * width]) max = data[j + i * width];
        }
    }
    var totalLen = width * height;
    for (var i = 0; i < totalLen; i++) {
        data[i] /= max;
    }
    var imgBase64 = generateImage(data, width, height);
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, width, height, 0, 0, 300, 250);
    };
    image.src = "data:image/png;base64," + imgBase64;
    $("#imgLink").attr("href", 'data:application/octet-stream;base64,' + imgBase64);
});

//start with white canvas
var p = new PNGlib(400, 400, 256); // construcor takes height, weight and color-depth
var background = p.color(0, 0, 0, 0); // set the background transparent
for (var i = 0; i < 400; i++) {
    for (var j = 0; j < 400; j++) {
        p.buffer[p.index(j, i)] = p.color(0xff, 0xff, 0xff);
    }
}
var image = new Image();
image.onload = function () {
    ctx.drawImage(image, 0, 0);
};
image.src = "data:image/png;base64," + p.getBase64();
$("#imgLink").attr("href", 'data:application/octet-stream;base64,' + p.getBase64());




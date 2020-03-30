var fs = require("fs");
const globby = require("globby");
const del = require('delete');
const jimp = require("jimp");

const JPG_PATTERN = "**/*.jpg";
const PNG_PATTERN = "**/*.png";

const IGNORE_PNG_PATTERN = "**/*.min.png";
const IGNORE_JPG_PATTERN = "**/*.min.jpg";
const IGNORE_NODE_MODULES = "node_modules/**/*.*";

const model = {}
model.images = []
let imageString = ''
const paths = globby.sync(
  [PNG_PATTERN, JPG_PATTERN], 
  {ignore: [IGNORE_NODE_MODULES, IGNORE_PNG_PATTERN, IGNORE_JPG_PATTERN]});
console.log(paths);
paths.forEach(path => {
  console.log(path)
  imageString+=getImageString(path)
  console.log(imageString)
  //const resizePath = resize(path)
  model.images.push(path)
//  model.images.push(resizePath)
});

fs.writeFileSync('model.json', JSON.stringify(model))
fs.writeFileSync('index.html', getIndexHtml(imageString))

/**
 * Get the file extension
 *
 * @param {*} path
 */
function getExtension(path) {
  return path.split(".").pop();
}

function getImageString(path) {
  const s = `<img src="https://fireflysemantics.github.io/i/${path}" width="200px" height="200px">`
  return s
}

function getIndexHtml(images) {
return `
  <!doctype html>
  <html>
    <head>
      <title>webpage!</title>
    </head>
    <body style="display: flex">
       ${images}
    </body>
  </html>
  `
}

function resize(path) {
  const extension = getExtension(path);
  const outputPath = path.replace(extension, `min.${extension}`);
  del.sync(outputPath)

  jimp.read(path, (err, img) => {
    if (err) throw err;
    img
      .resize(64, 36) // resize 16/9
      .quality(20) // set JPEG quality
      .greyscale() // set greyscale
      .write(outputPath);
  });
  return outputPath
}

const CleanCSS = require("clean-css");
const fs = require("fs");

const fileBuffer = fs.readFileSync(__dirname + "/main.css");
const styles = fileBuffer.toString();

const cleanCSSOptions = {};
const cleanCSSOutput = new CleanCSS(cleanCSSOptions).minify(styles);

module.exports = cleanCSSOutput.styles;
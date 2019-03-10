const CleanCSS = require("clean-css");
const fs = require("fs");

function getStyles() {
  const fileBuffer = fs.readFileSync(__dirname + "/../main.css");
  const styles = fileBuffer.toString();

  const cleanCSSOptions = {};
  const cleanCSSOutput = new CleanCSS(cleanCSSOptions).minify(styles);

  return cleanCSSOutput.styles
}

module.exports = getStyles;
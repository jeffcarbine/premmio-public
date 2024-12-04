// Standard Library Imports
import fs from "fs";

/**
 * Creates an object containing SVG icons and writes it to a file.
 *
 * @param {string} __dirname - The directory name.
 * @param {Object} path - The path module.
 */
export const createIconObject = (__dirname, path) => {
  const iconDir = path.join(__dirname, "/premmio/public/components/icon/icons");
  const iconFiles = fs.readdirSync(iconDir);

  let js = "export const icons = {\n";

  iconFiles.forEach((file) => {
    let svg = fs.readFileSync(`${iconDir}/${file}`, "utf8");

    // Remove the XML declaration if it exists
    svg = svg.replace(/<\?xml[^>]*\?>/, "");

    // Remove the opening <svg> tag and its attributes
    let svgInnerContent = svg.replace(/<svg[^>]*>/, "").replace("</svg>", "");

    // Remove unnecessary whitespace but retain line breaks
    svgInnerContent = svgInnerContent.replace(/[ \t]+/g, " ").trim();

    // Replace singleton tags with opening and closing tags
    svgInnerContent = svgInnerContent.replace(
      /<(\w+)([^>]*)\/>/g,
      "<$1$2></$1>"
    );

    const name = file.split(".")[0];

    // check to see if there is a _color on the icon name
    // if so, don't remove the defs
    if (name.indexOf("_color") > -1) {
      // we need to make the classes specific to this icon, so append
      // the icon name to each of the classes inside of the svg
      const svgWithIconName = svgInnerContent.replace(
        /cls-/g,
        `cls-${name.split("_").join("-").toLowerCase()}-`
      );

      js += `  ${name}: \`${svgWithIconName}\`,\n`;
    } else {
      // remove the defs tag from inside the svg
      const startDefs = svgInnerContent.indexOf("<defs");
      const endDefs = svgInnerContent.lastIndexOf("</defs>");

      const svgWithoutDefs =
        svgInnerContent.slice(0, startDefs) +
        svgInnerContent.slice(endDefs + 7);

      // remove all the class="cls-0", class="cls-1", etc.
      const svgWithoutClasses = svgWithoutDefs.replace(/ class="cls-\d+"/g, "");

      js += `  ${name}: \`${svgWithoutClasses}\`,\n`;
    }
  });

  js += "};";

  fs.writeFileSync(
    path.join(__dirname, `/premmio/public/components/icon/icons.js`),
    js
  );
};

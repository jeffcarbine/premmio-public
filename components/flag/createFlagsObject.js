// Standard Library Imports
import fs from "fs";
import path from "path";

// Modules
import { lowerAlphaNumOnly } from "../../modules/formatString/formatString.js";

/**
 * Creates an object containing SVG flags and writes it to a file.
 *
 * @param {string} __dirname - The directory name.
 * @param {Object} path - The path module.
 */
export const createFlagsObject = (__dirname, path) => {
  const iconDir = path.join(__dirname, "/premmio/public/components/flag/flags");
  const iconFiles = fs.readdirSync(iconDir);

  let js = "export const flags = {\n";

  iconFiles.forEach((file) => {
    const svg = fs.readFileSync(`${iconDir}/${file}`, "utf8");

    const name = lowerAlphaNumOnly(file.split(".")[0]);

    js += `  ${name}: \`${svg}\`,\n`;
  });

  js += "};";

  fs.writeFileSync(
    path.join(__dirname, `/premmio/public/components/flag/flags.js`),
    js
  );
};

/**
 * Creates an object containing SVG flag squares and writes it to a file.
 *
 * @param {string} __dirname - The directory name.
 * @param {Object} path - The path module.
 */
export const createFlagSquaresObject = (__dirname, path) => {
  const iconDir = path.join(
    __dirname,
    "/premmio/public/components/flag/flagSquares"
  );
  const iconFiles = fs.readdirSync(iconDir);

  let js = "export const flagSquares = {\n";

  iconFiles.forEach((file) => {
    const svg = fs.readFileSync(`${iconDir}/${file}`, "utf8");

    const name = lowerAlphaNumOnly(file.split(".")[0]);

    js += `  ${name}: \`${svg}\`,\n`;
  });

  js += "};";

  fs.writeFileSync(
    path.join(__dirname, `/premmio/public/components/flag/flagSquares.js`),
    js
  );
};

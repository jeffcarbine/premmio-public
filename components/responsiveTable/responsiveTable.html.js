// Components
import { Table } from "../../template/elements.html.js";

/**
 * Creates a responsive table component.
 *
 * @param {Object} options - The options for the responsive table.
 * @param {Array<Object>} options.headers - The headers for the table.
 * @param {Array<Array<Object>>} options.rows - The rows for the table.
 * @param {string} [options.className=""] - Additional class names for the table.
 * @returns {Table} The responsive table component.
 */
export class ResponsiveTable {
  constructor(params) {
    this.class = "responsiveTable";
    this.child = new Table(params);
  }
}

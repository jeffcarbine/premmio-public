// Elements
import { Pre } from "../../template/elements.html.js";

/**
 * Class representing a code block.
 *
 * @extends Pre
 */
export class CodeBlock extends Pre {
  /**
   * Creates an instance of CodeBlock.
   *
   * @param {Object} params - The parameters for the code block.
   */
  constructor(params) {
    super(params);

    this.child = {
      class: "code",
      textContent: params,
    };
  }
}

import 'dotenv/config';

/**
 * @class UtilHelp
 */
class UtilHelp {
  /**
   * @static
   * @description a simple function that trims a string
   * @param {string} param
   * @returns {string} in a template literal
   */
  static trimMe(param) {
    return param.trim();
  }

  /**
   * @static
   * @description a function for sanitising an array of input strings
   * @param {object} textObj
   * @returns {object} sanitised text
   */
  static cleanInput(textObj) {
    const newObj = {};
    const entries = Object.entries(textObj);
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of entries) {
      const newVal = value.trim().toLowerCase();
      newObj[key] = newVal;
    }
    return newObj;
  }

  /**
   * @static
   * @description a function for sanitising input fields in express-validator schema
   * @param {string} param
   * @returns {string} in a template literal
   */
  static sanitize(param) {
    return `options: ${param} => (typeof ${param} === 'string' ? ${param}.trim() : null)`;
  }
}

export default UtilHelp;

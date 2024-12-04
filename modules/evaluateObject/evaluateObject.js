/**
 *
 * @param {object} obj the object to evaluate
 * @param {string} keys the keys to evaluate, separated by periods
 * @returns whether the object has the keys
 */

export const evaluateObject = (obj, keys) => {
  // split the keys into individual keys
  const keyList = keys.split(".");

  // default the value to the object itself
  let value = obj;

  // check the current property
  const checkProperty = (property, index) => {
    // if the property exists
    if (value[property] !== undefined) {
      // if the property is the last one, return true
      if (index === keyList.length - 1) {
        return value[property];
      } else {
        // otherwise, set the value to the property and check the next property
        value = value[property];
        const i = index + 1;
        return checkProperty(keyList[i], i);
      }
    } else {
      // if the property doesn't exist, return false
      return false;
    }
  };

  return checkProperty(keyList[0], 0);
};

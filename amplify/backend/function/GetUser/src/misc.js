/**
 * Get the first value from `target` where the `key` exists with an entry in `suffixes` added.
 * @param {object} target 
 * @param {string} key 
 * @param {string[]} suffixes 
 * @returns {*}
 */
function getValueWithSuffix(target, key, suffixes) {
    for (let i=0; i < suffixes.length; i++) {
        const current = key + suffixes[i];
        if (target.hasOwnProperty(current)) {
            return target[current];
        }
    }
    return null;
}

/**
 * Get a required environment variable.
 * @param {string} name 
 * @returns {string}
 */
function getEnvVar(name) {
    const variable = process.env[name];
    if (!variable) throw new Error(`Function requires environment variable: '${name}'.`);
    return variable;
}

/**
 * Remove the passed `removables` from the passed `str`.
 * @param {string} original 
 * @param {string[]} removables 
 * @returns {string}
 */
function removeStrings(original, removables) {
    return removables.reduce( (result, removable) => result.replace(removable, ''), original );
}

/**
 * Get a value from an object by its keys.
 * @param {object} object 
 * @param  {...string} keys 
 * @returns {*}
 */
function getProperty(object, ...keys) {
    return keys.reduce(
        (value, key) => (value && typeof value === 'object') ? value[key] : undefined,
        object || {}
    );
}

/**
 * Returns true if the passed object has no properties.
 * @param {object} obj 
 * @returns {boolean} 
 */
function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}

module.exports = { getValueWithSuffix, getEnvVar, removeStrings, getProperty, isEmpty };

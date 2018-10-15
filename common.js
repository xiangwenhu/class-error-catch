module.exports.isDescriptor = function isDescriptor(desc) {
    if (!desc || !desc.hasOwnProperty) {
        return false
    }
    const keys = ['value', 'initializer', 'get', 'set']
    for (let i = 0, l = keys.length; i < l; i++) {
        if (desc.hasOwnProperty(keys[i])) {
            return true
        }
    }
    return false;
}

module.exports.createDefaultSetter = function createDefaultSetter(key) {
    return function set(newValue) {
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue
        });
        return newValue;
    };
}
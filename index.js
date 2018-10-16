
const { isDescriptor, createDefaultSetter } = require('./common')

const {
    getOwnPropertyDescriptors,
    defineProperty,
    getPrototypeOf
} = Object

const WHITE_LIST = ['constructor']

/**
 * 默认错误处理函数
 * @param {Error} err 
 * @param {Object} target 
 * @param {String} methodName 
 * @param  {...any} params 
 */
function defaultErrorHanlder(err, target, methodName, ...params) {
    console.log('error catched by catchError decotator', err, target, methodName, ...params)
}

/**
 * 检查是不是需要代理
 * @param {Function} method 
 * @param {Object} descriptor 
 */
function defaultFilter(property, descriptor) {
    return descriptor.configurable
        && !WHITE_LIST.includes(property)
}

function observerHandler(fn, context, callback) {
    return async function (...args) {
        try {
            const r = await fn.call(context, ...args)
            return r
        } catch (err) {
            callback(err)
        }
    }
}


module.exports = function createCatchError({
    errorHandler = defaultErrorHanlder,
    filter
}) {

    function catchProperty(target, key, descriptor, ...params) {
        if (descriptor.initializer && typeof descriptor.initializer() === 'function') {
            return catchInitializer(target, key, descriptor, ...params)
        } else if (typeof descriptor.value === 'function') {
            return catchMethod(target, key, descriptor, ...params)
        } else if (typeof descriptor.get === 'function') {
            return catchGetter(target, key, descriptor, ...params)
        }
        return descriptor
    }

    function catchInitializer(target, key, descriptor, ...params) {
        const initValue = descriptor.initializer()
        if (typeof initValue !== 'function') {
            return descriptor
        }

        descriptor.initializer = function () {
            initValue.bound = true
            return observerHandler(initValue, this, error => {
                errorHandler(error, target, key, ...params)
            })
        }
        return descriptor
    }

    function catchMethod(target, key, descriptor, ...params) {
        if (typeof descriptor.value !== 'function') {
            return descriptor
        }
        const { value: fn } = descriptor

        defineProperty(descriptor, 'value', {
            value: function () {
                const boundFn = observerHandler(fn, this, err => {
                    errorHandler(err, target, key, ...params)
                })
                boundFn.bound = true
                return boundFn()
            }
        })

        return descriptor
    }

    function catchGetter(target, key, descriptor, ...params) {

        const { constructor } = target
        const { get: fn } = descriptor
      
        defineProperty(descriptor, 'get', {
            value: function () {
                // Class.prototype.key lookup
                // Someone accesses the property directly on the prototype on which it is
                // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
                if (this === target) {
                    return fn;
                }
                // Class.prototype.key lookup
                // Someone accesses the property directly on a prototype but it was found
                // up the chain, not defined directly on it
                // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
                if (this.constructor !== constructor && getPrototypeOf(this).constructor === constructor) {
                    return fn;
                }
                const boundFn = observerHandler(fn, this, err => {
                    errorHandler(err, target, key, ...params)
                })
                defineProperty(this, key, {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: boundFn
                });
                boundFn.bound = true
                return boundFn;
            }
        })

        return descriptor
    }

    function catchClass(targetArg, ...params) {
        // 获得所有自定义方法，未处理Symbols
        const target = targetArg.prototype || targetArg
        let descriptors = getOwnPropertyDescriptors(target)
        for (let [property, descriptor] of Object.entries(descriptors)) {
            if (defaultFilter(property, descriptor) &&
                (!filter || filter && typeof filter === 'function' && !!filter(property, descriptor))) {
                defineProperty(target, property, catchProperty(target, property, descriptors[property], ...params))
            }
        }
    }

    return function catchError(...args) {
        const lastArg = args[args.length - 1]
        // 无参数方法
        if (isDescriptor(lastArg)) {
            return catchProperty(...args)
        } else {
            // 无参数class?? 需要改进
            if (args.length === 1 && typeof args[0] !== 'string') {
                return catchClass(...args)
            }
            // 有参
            return (...argsList) => {
                // 有参数方法
                if (isDescriptor(argsList[argsList.length - 1])) {
                    return catchProperty(...[...argsList, ...args])
                }
                // 有参数class
                return catchClass(...[...argsList, ...args])
            }
        }
    }
}




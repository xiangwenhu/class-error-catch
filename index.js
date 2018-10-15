
const { isDescriptor } = require('./common')


const {
    getOwnPropertyDescriptors,
    defineProperty
} = Object


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
function defaultShouldProxy(method, descriptor) {
    return typeof descriptor.value === 'function'
        && descriptor.configurable
        && descriptor.writable
        && !descriptor.value.bound
}


module.exports = function createCatchError({
    errorHandler = defaultErrorHanlder,
    shouldProxy
}) {

    function observerHandler(fn, context, callback) {
        return function (...args) {
            try {
                return fn.call(context, ...args)
            } catch (err) {
                callback(err)
            }
        }
    }


    function catchProperty(target, key, descriptor, ...params) {
        if (descriptor.initializer && typeof descriptor.initializer() === 'function') {
            catchInitializer(target, key, descriptor, ...params)
        } else if (typeof descriptor.value === 'function') {
            catchMethod(target, key, descriptor, ...params)
        }
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

        descriptor.value = function () {
            const boundFn = observerHandler(fn, this, err => {
                errorHandler(err, target, key, ...params)
            })
            boundFn.bound = true
            return boundFn()
        }

        return descriptor
    }

    function catchClass(targetArg, ...params) {
        // 获得所有自定义方法，未处理Symbols
        const target = targetArg.prototype || targetArg
        let descriptors = getOwnPropertyDescriptors(target)
        for (let [method, descriptor] of Object.entries(descriptors)) {
            if (defaultShouldProxy(method, descriptor) &&
                (!shouldProxy || shouldProxy && typeof shouldProxy === 'function' && !!shouldProxy(method, descriptor))) {
                defineProperty(target, method, catchMethod(target, method, descriptors[method], ...params))
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




const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)

class DemoClass {
    @catchError('Error from property sayHi ')
    sayHi = () => {
        console.log(this.xxx.xxx)
    }
}
new DemoClass().sayHi()
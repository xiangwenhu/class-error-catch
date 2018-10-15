const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)

@catchError('DemoClass3 error')
class DemoClass3 {
    sayHi() {
        console.log(this.xxx.xxx)
    }

}
new DemoClass3().sayHi()

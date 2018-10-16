const createCatchError = require('../')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\t`, message) //, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)

class DemoClass {

    @catchError('error from DemoClass getter method sayHi')
    get sayHi() {
        console.log(this.xxx.xxx)
    }
   
}

const demoClass = new DemoClass()
demoClass.sayHi()

const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`) //, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)

@catchError('error from class')
class DemoClass {

    sayHi() {
        console.log(this.xxx.xxx)
    }

    static sayHi2() {
        console.log(this.xxx.xxx)
    }

    sayHi3 = () => {
        console.log(this.xxx.xxx)
    }

    get sayHi4(){
        console.log(this.xxx.xxx)
    }

}
const demoClass = new DemoClass()
demoClass.sayHi()   // caught
demoClass.sayHi4()   //  caught

// DemoClass.sayHi2() // can not be caught
// demoClass.sayHi3()  // can not be caught



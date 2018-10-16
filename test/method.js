const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)


function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('超时错误'))
        },1000)
    })
}

class DemoClass {
    @catchError('Error from method sayHi')
    sayHi() {
        console.log(this.xxx.xxx)
    }

    @catchError('Error from async method sayHi2')
    async sayHi2() {
        const r = await getPromise()
        console.log('result', r)
    }
}
const demoClass = new DemoClass()
demoClass.sayHi()
demoClass.sayHi2()
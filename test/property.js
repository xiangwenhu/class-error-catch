const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\t`, `自定义消息:${message}\t`, `更多细节:${err.message}`) // , ${err.stack}`)
    }
}

const catchError = createCatchError(config)


function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('超时错误'))
        }, 1000)
    })
}

class DemoClass {
    @catchError('Error from property sayHi ')
    sayHi = () => {
        console.log(this.xxx.xxx)
    }

    @catchError('Error from async method sayHi2')
    sayHi2 = async () => {
        const r = await getPromise()
        console.log('result', r)
    }
}
const demoClass = new DemoClass()
demoClass.sayHi()
demoClass.sayHi2()
const createCatchError = require('../index')

const config = {
    errorHandler: function(
        err,
        target,
        context,
        methodName,
        message,
        ...others
    ) {
        console.log('==========================================================================')
        console.log("err:", err);
        console.log("target:", target);
        console.log("context:", context);
        console.log("methodName:", methodName);
        console.log("message:", message);
        console.log("others:", others);
        console.log('==========================================================================')
    }
};

const catchError = createCatchError(config)


function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('超时错误'))
        },1000)
    })
}

class DemoClass {

    constructor(){
        this.name = 'DemoClass'
    }

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
const createCatchError = require('../')

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

class DemoClass {

    @catchError('error from DemoClass getter method sayHi')
    get sayHi() {
        console.log(this.xxx.xxx)
    }
   
}

const demoClass = new DemoClass()
demoClass.sayHi()

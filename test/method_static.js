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

class DemoClass {
    
    @catchError('error from DemoClass static method sayHi')
    static sayHi() {
        console.log(this.xxx.xxx)
    }
}

DemoClass.sayHi()
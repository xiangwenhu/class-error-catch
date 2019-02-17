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



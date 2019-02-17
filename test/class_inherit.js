const createCatchError = require("../");

const config = {
    errorHandler: function(
        err,
        target,
        context,
        methodName,
        message,
        ...others
    ) {
        //console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`) //, `更多细节:${err.message} , ${err.stack}`)
        console.log("err:", err);
        console.log("target:", target);
        console.log("context:", context);
        console.log("methodName:", methodName);
        console.log("message:", message);
        console.log("others:", others);
    }
};

const catchError = createCatchError(config);

class SuperClass {
    constructor() {
        this.name = "SuperClass";
    }

    @catchError("Error catch from SuperClass sayHi")
    sayHi() {
        console.log(this.xxx.xxx);
    }
}

class SubClass extends SuperClass {
    constructor() {
        super();
        this.name = "SubClass";
    }

    @catchError("Error catch from SubClass sayBye")
    sayBye() {
        console.log(this.sub.sub);
    }
}

const subClass = new SubClass();

subClass.sayHi();
subClass.sayBye();

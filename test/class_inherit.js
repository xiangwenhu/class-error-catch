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

基于 decorator 的错误捕捉  
支持方法,getter,class

## Installation

### Node

```
npm install class-error-catch --save
```

## Options

createCatchError supports the following options:

-   errorHandler: 错误处理函数  
    默认处理函数如下

```js
/**
 * 默认错误处理函数
 * @param {Error} err  错误信息
 * @param {Class} target 错误发生所在的Class
 * @param {Class Instance} context  错误发生所在的Class实例对象
 * @param {String} methodName   错误发生的方法名
 * @param  {...any} params  其他自定义参数
 */
function defaultErrorHanlder(err, target, context, methodName, ...params) {
    console.log(
        "error catched by catchError decotator",
        err,
        target,
        context,
        methodName,
        ...params
    );
}
```

-   filter: 当装饰 class 时有用, 过滤哪些方法需要捕捉错误

## Demo

-   [method](https://github.com/xiangwenhu/class-error-catch-demo/blob/master/test/method.js)
-   [static method](https://github.com/xiangwenhu/class-error-catch-demo/blob/master/test/method_static.js)
-   [property](https://github.com/xiangwenhu/class-error-catch-demo/blob/master/test/property.js)
-   [getter](https://github.com/xiangwenhu/class-error-catch-demo/blob/master/test/getter.js)
-   [class](https://github.com/xiangwenhu/class-error-catch-demo/blob/master/test/class.js)

## Usage

基本使用

```js
const createCatchError = require("class-error-catch");

const config = {
    errorHandler: function(
        err,
        target,
        context,
        methodName,
        message,
    ) {
        console.log("err:", err); //错误信息
        console.log("target:", target); //错误发生所在的Class
        console.log("context:", context); // 错误发生所在的Class实例对象
        console.log("methodName:", methodName); // 错误发生的方法名
        console.log("message:", message); // 自定义的错误消息
    }
};

const catchError = createCatchError(config);

function getPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("超时错误"));
        }, 1000);
    });
}

class DemoClass {

    @catchError("Error from method sayHi")
    sayHi() {
        console.log(this.xxx.xxx);
    }

    @catchError("Error from async method sayHi2")
    async sayHi2() {
        const r = await getPromise();
        console.log("result", r);
    }
}
const demoClass = new DemoClass();
demoClass.sayHi();
demoClass.sayHi2();

//输出
//sayHi in  DemoClass
//自定义消息:Error from method sayHi

//sayHi2 in  DemoClass
//自定义消息:Error from async method sayHi2
```

react 中使用

```js
import React, { Component } from "react";

import createCatchError from "class-error-catch";

const BUILTIN_METHODS = [
    "constructor",
    "render",
    "replaceState",
    "setState",
    "isMounted",
    "replaceState"
];

const PREFIX = ["component", "unsafe_"];
function customFilter(propertyName, descriptor) {
    if (typeof name !== "string" || name.trim() === "") {
        return false;
    }
    // 以component或者unsafe_开头
    if (PREFIX.some(prefix => name.startsWith(prefix))) {
        return true;
    }
    // 其他内置方法
    if (BUILTIN_METHODS.includes(name)) {
        return true;
    }
    return false;
}
const config = {
    errorHandler: function(
        err,
        target,
        context,
        methodName,
        message
    ) {
        console.log("err:", err); //错误信息
        console.log("target:", target); //错误发生所在的Class
        console.log("context:", context); // 错误发生所在的Class实例对象
        console.log("methodName:", methodName); // 错误发生的方法名
        console.log("message:", message); // 自定义的错误消息
    },
    filter: function(propertyName, descriptor) {
        return !customFilter(propertyName);
    }
};

const catchError = createCatchError(config);

class App extends Component {

    state = {
        xxx: "xxx"
    };

    @catchError("发生异常了啊 onClick_Initializer")
    onClick_Initializer = e => {
        console.log(window.onClick_Initializer.xxx);
    };

    @catchError("发生异常了啊 onClick_Fun")
    onClick_Fun() {
        console.log("xxx");
        console.log(window.onClick_Fun.xxxxx);
        this.setState({ xxx: "yyyy" }, () => {
            console.log(this.state);
        });
    }

    render() {
        const { onClick_Initializer, onClick_Fun } = this;
        return (
            <div className="App">
                <input
                    type="button"
                    value="initializer catch"
                    onClick={onClick_Initializer}
                />
                <input
                    type="button"
                    value="fun catch"
                    onClick={() => onClick_Fun.bind(this)()}
                />
            </div>
        );
    }
}

export default App;
```

## Typings

none

## License

MIT

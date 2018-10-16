基于decorator的错误捕捉   
支持方法,getter,class

## Installation

### Node

```
npm install class-error-catch --save
```

## Options
createCatchError supports the following options:
* errorHandler:  错误处理函数   
默认处理函数如下
```js
function defaultErrorHanlder(err, target, methodName, ...params) {
    console.log('error catched by catchError decotator', err, target, methodName, ...params)
}
```
* filter:  当装饰class时有用, 过滤哪些方法需要捕捉错误 

## Usage



1. 装饰方法
```js
const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, methodName, message)
    }
}
const catchError = createCatchError(config)

class DemoClass {
    
    @catchError('error from DemoClass static method sayHi')
    static sayHi() {
        console.log(this.xxx.xxx)
    }
}

DemoClass.sayHi()
```

2. 装饰属性
```js
const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\t`, 
        `自定义消息:${message}\t`, `更多细节:${err.message}`) // , ${err.stack}`)
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
```

3. 装饰静态方法
```js
const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, 
        `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}
const catchError = createCatchError(config)

class DemoClass {
    
    @catchError('error from DemoClass static method sayHi')
    static sayHi() {
        console.log(this.xxx.xxx)
    }
}

DemoClass.sayHi()
```

4. 装饰gettter
```js
const createCatchError = require('..')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\t`, message)
    }
}

const catchError = createCatchError(config)

class DemoClass {

    @catchError('error from DemoClass getter method sayHi')
    get sayHi() {
        console.log(this.xxx.xxx)
    }
   
}

const demoClass = new DemoClass()
demoClass.sayHi()

```

5. 装饰class
```js
const createCatchError = require('../index')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`)
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
```


6. used in react
```js
import React, { Component } from 'react';

import createCatchError from 'class-error-catch'

const BUILTIN_METHODS = [
    'constructor',
    'render',
    'replaceState',
    'setState',
    'isMounted',
    'replaceState'
]

const PREFIX = ['component', 'unsafe_']
function isBuiltinMethods(name) {
    if (typeof name !== 'string' || name.trim() === '') {
        return false
    }
    // 以component或者unsafe_开头
    if (PREFIX.some(prefix => name.startsWith(prefix))) {
        return true
    }
    // 其他内置方法
    if (BUILTIN_METHODS.includes(name)) {
        return true
    }
    return false
}
const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`
        , `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    },
    shouldProxy: function (methodName, descriptor) {
        return !isBuiltinMethods(methodName)
    }
}

const catchError = createCatchError(config)

class App extends Component {


    state = {
        xxx: 'xxx'
    }
    @catchError('发生异常了啊 onClick_Initializer')
    onClick_Initializer = e => {
        console.log(window.onClick_Initializer.xxx)
    }

    @catchError('发生异常了啊 onClick_Fun')
    onClick_Fun() {
        console.log('xxx')
        console.log(window.onClick_Fun.xxxxx)
        this.setState({ xxx: 'yyyy' }, () => {
            console.log(this.state)
        })
    }


    render() {
        const { onClick_Initializer, onClick_Fun } = this
        return (
            <div className="App">
                <input type="button" value="initializer catch" onClick={onClick_Initializer} />
                <input type="button" value="fun catch" onClick={() => onClick_Fun.bind(this)()} />
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

捕捉class的错误, 支持方法,class

## Installation

### Node

```
npm install class-error-catch --save
```

## Usage


1. used in class
```javascript
const createCatchError = require('class-error-catch')

const config = {
    errorHandler: function (err, target, methodName, message) {
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
    }
}

const catchError = createCatchError(config)

class DemoClass1 {

    @catchError('sayHi Error')
    sayHi() {
        console.log(this.xxx.xxx)
    }

}

new DemoClass1().sayHi()


class DemoClass2 {       
    @catchError('error from DemoClass2 sayHi')
    sayHi = ()=> {
        console.log(this.xxx.xxx)
    }
}

new DemoClass2().sayHi()


@catchError('error from DemoClass2')
class DemoClass3 {   
    sayHi() {
        console.log(this.xxx.xxx)
    }
}

new DemoClass3().sayHi()
```

2. used in react
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
        console.log(`${methodName} in  ${target.constructor.name}\r\n`, `自定义消息:${message}\r\n`, `更多细节:${err.message} , ${err.stack}`)
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
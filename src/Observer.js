class Observer {
    constructor(data) {
        this.observer(data)
    }
    observer(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key])
            })
        }
    }
    defineReactive(obj, key, value) {
        this.observer(value) // 递归劫持所有的属性

        const dep = new Dep()

        Object.defineProperty(obj, key, {
            enumerable: true, // 描述属性是否会出现在for in 或者 Object.keys()的遍历中
            configurable: true, // 描述属性是否配置，以及可否删除
            get() {
                Dep.target && dep.addSub(Dep.target) // 订阅数据发生变化，添加观察
                return value
            },
            set: (newValue)=> {
                if (value !== newValue) {
                    value = newValue
                    this.observer(newValue) // 劫持新的数据
                    dep.notify()
                }
            }
        })
    }
}
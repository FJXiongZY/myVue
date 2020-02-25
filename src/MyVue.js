class MyVue{
    constructor(options) {
        this.$el = UtilsBasic.isElement(options.el) ? options.el : document.querySelector(options.el)
        this.$data = options.data
        this.$options = options
        new Observer(this.$data)
        new Compile(this.$el, this)
        this.proxyData(this.$data)
    }
    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true, // 描述属性是否会出现在for in 或者 Object.keys()的遍历中
                configurable: true, // 描述属性是否配置，以及可否删除
                get() {
                    return data[key]
                },
                set(newVal) {
                    if (data[key] !== newVal) return data[key] = newVal
                }
            })
        })
    }
}

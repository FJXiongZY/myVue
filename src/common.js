class UtilsBasic {
    // 判断是否是元素节点
    static isElement(el) {
        return el.nodeType === 1
    }
    // 判断是否是一个指令
    static isDirective(attrName) {
        return typeof attrName === 'string' && attrName.startsWith('v-')
    }
    // 判断是否是v-on的缩写@
    static isEventAbbr(attrName) {
        return typeof attrName === 'string' && attrName.startsWith('@')
    }
    // 判断是否是 : 开头的属性
    static isAttrAbbr(attrName) {
        return typeof attrName === 'string' && attrName.startsWith(':')
    }
    // 深度获取对象的值
    static getValue(vm, expr) {
        return expr.split('.').reduce((data, currentKey) => {
            return data[currentKey]
        }, vm.$data)
    }
    static getContentVal(vm, expr) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
            return this.getValue(vm, arg[1])
        })
    }
    // 深度设置新值
    static setValue(vm, expr, value) {
        const exprArray = expr.split('.')
        const LENGTH = exprArray.length
        return exprArray.reduce((data, currentKey, index) => {
            if (index === LENGTH - 1) {
                data[currentKey] = value
            } else {
                return data[currentKey]
            }
        }, vm.$data)
    }
}

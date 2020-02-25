class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        this.oldVal = this.getOldVal()
    }
    // 获取旧值
    getOldVal() {
        Dep.target = this
        const oldVal = UtilsBasic.getValue(this.vm, this.expr)
        Dep.target = null
        return oldVal
    }
    // 更新
    update(){
        const newVal = UtilsBasic.getValue(this.vm, this.expr)
        if (newVal !== this.oldVal) {
            this.cb(newVal)
        }
    }
}

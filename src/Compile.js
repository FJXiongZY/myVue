const Directive = {
    /**
     * 编译文本的指令
     * @param { Element } node 当前编译文本的节点 <p v-text="txt"></p> <p v-text="person.name"></p>
     * @param { String } expr v-text属性的value部分 txt | person.name
     * @param { Vue } vm 当前Vue的实例对象
     * @returns { any } 返回在data中的值
    */
    text: function(node, expr, vm) {
        let value;
        if (expr.includes('{{')) {
            value = expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
                new Watcher(vm, arg[1], ()=> {
                    Updater.textUpdate(node, UtilsBasic.getContentVal(vm, expr))
                })
                return UtilsBasic.getValue(vm, arg[1])
            })
        } else {
            new Watcher(vm, expr, (newVal)=> {
                Updater.textUpdate(node, newVal)
            })
            value = UtilsBasic.getValue(vm, expr)
        }
        Updater.textUpdate(node, value)
    },
    html: function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)
        new Watcher(vm, expr, function(newVal) {
            Updater.htmlUpdate(node, newVal)
        })
        Updater.htmlUpdate(node, value)
    },
    show: function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)
        Updater.showUpdater(node, value)
    },
    if: function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)
        Updater.ifUpdater(node, value)
    },
    'else-if': function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)
        Updater.ifUpdater(node, value)
    },
    else: function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)
        Updater.ifUpdater(node, value)
    },
    model: function(node, expr, vm) {
        const value = UtilsBasic.getValue(vm, expr)

        new Watcher(vm, expr, function(newVal) {
            Updater.modelUpdate(node, newVal)
        })

        node.addEventListener('input', function(e) {
            UtilsBasic.setValue(vm, expr, e.target.value)
        }, false)

        Updater.modelUpdate(node, value)
    },
    bind: function(node, expr, vm, attrName) {
        const value = UtilsBasic.getValue(vm, expr)
        Updater.bindUpdate(node, value, attrName)
    },
    on: function(node, expr, vm, EventType) {
        const fn = vm.$options.methods && vm.$options.methods[expr]
        node.addEventListener(EventType, fn.bind(vm), false)
    }
}

class Compile{
    constructor($el, vm) {
        this.el = $el
        this.vm = vm

        // 1.获取文档碎片 放入内存中 节省页面的回流和重绘
        const fragment = this.node2Fragment($el)

        // 2.编译
        this.compile(fragment)

        // 3.将文档碎片放回挂载的节点
        this.el.appendChild(fragment)
    }

    /**
     * 执行编译
     * @param { Fragment } fragment 文档碎片
    */
    compile(fragment) {
        let childNodes = fragment.childNodes
        Array.from(childNodes).forEach(child => {
            if (UtilsBasic.isElement(child)) { // 编译节点
                this.compileElement(child)
            } else { // 编译文本
                this.compileText(child)
            }

            // 递归遍历所有节点的子节点
            if (child.childNodes && child.childNodes.length) {
                this.compile(child)
            }
        })
    }

    /**
     * 编译文本
    */
    compileText(node) {
        const content = node.textContent // 获取文本节点的 文本内容
        if (/\{\{(.+?)\}\}/g.test(content)) { // 正则匹配是否是{{ ... }}
            Directive['text'](node, content, this.vm)
        }
    }
    /**
     * 编译节点，主要是编译节点上的指令（v-text、v-model、v-html、v-show、v-if...）和方法（v-on:click、@click）和自定义指令等
     * @param { Element } node 当前编译文本的节点 <p v-text="txt"></p> <p v-text="person.name"></p>
    */
    compileElement(node) {
        const attributes = node.attributes; // 返回一个伪数组对象，存放节点的属性
        [...attributes].forEach(({ name, value }) => { // name = abc | data-name | v-text，value = person.name | aaa
            if (UtilsBasic.isDirective(name)) { // 判断是否是指令 v-开头 v-on | v-bind | v-text | v-clock | v-slot | v-once | v-for | v-model | v-pre
                const [, directive] = name.split('v-') // 取到指令名 v-text中的text | v-no
                const [dTName, dTEventAttr] = directive.split(':') // 分割 v-on:click v-bind:src，如果是v-text那么 directiveName 就是text
                Directive[dTName] && Directive[dTName](node, value, this.vm, dTEventAttr) // 执行指令解析
            } else if (UtilsBasic.isEventAbbr(name)) { // 判断是否是 @开头的方法
                const dTEvent = name.split('@')[1] // 拿到方法名称 click
                Directive['on'](node, value, this.vm, dTEvent) // 执行指令解析 on
            } else if (UtilsBasic.isAttrAbbr(name)) { // 判断如果是 :开头的属性
                const DTAttr = name.split(':')[1]
                Directive['bind'](node, value, this.vm, DTAttr)
            }
        })
    }

    /**
     * 将节点及其子节点都放入文档碎片中
     * @param { HtmlElement } el 初始化时挂载的节点
     * @return { Fragmenet} 创建的文档碎片及存储的子节点
    */
    node2Fragment(el) {
        const f = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            f.append(firstChild)
        }
        return f
    }
}

class Updater{
    // 更新文本节点
    static textUpdate(node, value) {
        node.textContent = value
    }
    // 更新元素节点
    static htmlUpdate(node, value) {
        node.innerHTML = value
    }
    // 控制节点显示
    static showUpdater(node, value) {
        const display = Boolean(value) ? 'block' : 'none'
        node.style.display = display
    }
    static ifUpdater(node, value) {
        if (Boolean(value)) node.remove()
    }
    static modelUpdate(node, value) {
        node.value = value
    }
    static bindUpdate(node, value, attr) {
        node.setAttribute(attr, value)
    }
}

import Dot9 from './dist/src/Dot9';

function bind(el, binding, vnode) {
    (async () => {
        //监听元素宽高变化,绘制背景图片
        if ('ResizeObserver' in window === false) {
            const module = await import('@juggle/resize-observer');
            window.ResizeObserver = module.ResizeObserver;
        }
        el.ro = new ResizeObserver(() => {
            el.dot9 = new Dot9(el, binding.value);
            el.dot9.create();
            if (binding.value.resizable === false) {
                el.ro.disconnect()
            }
        });
        el.ro.observe(el);
    })();
    //监听source的变化,重新绘制背景
    el.unwatch = vnode.context.$watch(() => binding.value.source, (val) => {
        el.dot9 = new Dot9(el, binding.value);
        el.dot9.create();
    })
}

function unbind(el) {
    el.ro && el.ro.disconnect()
    el.unwatch && el.unwatch()
}

const plugin = {
    install(Vue) {
        Vue.directive('dot9', { bind, unbind });
    }
}

export default plugin;
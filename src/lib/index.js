/*
 * @Descripttion: 
 * @Date: 2020-07-25 15:59:21
 */
import Dot9 from './dist/src/Dot9';

function bind(el, binding) {
    (async () => {
        if ('ResizeObserver' in window === false) {
            const module = await import('@juggle/resize-observer');
            window.ResizeObserver = module.ResizeObserver;
        }
        el.ro = new ResizeObserver(() => {
            const dot9 = new Dot9(el, binding.value);
            dot9.create();
            if(binding.value.resizable === false){
                el.ro.disconnect()
            }
        });
        el.ro.observe(el);
    })();
}

function unbind(el, binding) {
    if (el.ro) {
        el.ro.disconnect()
    }
}

const plugin = {
    install(Vue) {
        Vue.directive('dot9', { bind, unbind })
    }
}

export default plugin;
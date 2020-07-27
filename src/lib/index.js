import Dot9 from './src/Dot9';

function bind(el, binding) {
    const dot9 = new Dot9(el, binding.value);
    dot9.create();
}

function unbind(el, binding) {
    console.log(el, binding);
}

const dot9 = {
    install(Vue) {
        Vue.directive('dot9', { bind, unbind })
    }
}

export default dot9;
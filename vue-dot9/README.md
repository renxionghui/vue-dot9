## <center>Web端.9背景图片</center>
基于vue 2.x的一个生成背景图片的一个插件,类似于Android的.9图片和CSS3中的border-image-slice,当图片背景需要适应多种尺寸大小,且不想令图片看起来模糊,可以尝试使用这个插件,生成的最终图片是base64数据

### 安装插件

```shell
npm i vue-dot9
```
### 基本使用

```javascript
import Vue from 'vue';
import dot9 from 'vue-dot9';

Vue.use(dot9);
```

```html
<div class="box3" v-dot9='option'></div>
```

```javascript
data() {
    return {
        option: {
            source:require('../assets/border.png',
            resizable: false,
            sliceHorizontal: [24, 48],
            sliceVertical: [24, 48]
        }
    }
}
```

### 参数说明

参数 | 说明 | 类型 | 是否必须
---|---|---|---
source | 图片地址,如果是src里面的图片,需要使用require引入,已实现响应式 | string | 是
resizable | 是否可缩放,当设置成flase之后改变元素大小背景图片不会跟着变化 | boolean | 否
sliceHorizontal | 水平方向上需要被拉伸的位置,默认是中间位置 | Array<number> | 否
sliceVertical | 垂直方向上需要被拉伸的位置,默认是中间位置 | Array<number> | 否

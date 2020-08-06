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

### 实现原理
原图72\*72的图片,需要拉伸成240\*240的背景图片
##### 1. 原图72\*72
![原图](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/grid.jpeg)

##### 2. 目标240*240,将原图根据sliceHorizontal: [24, 48],sliceVertical: [24, 48]进行分割,在水平方向上24,与48位置将图片分割成[0 ~ 23, 24 ~ 47,48 ~ 71]三块,垂直方向同理.
![分割图](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/slice.png)

##### 3. 剩下空白区域取对应位置上的一个像素的图片数据进行复制与填充

- ###### X轴取一个像素宽,24像素高(由sliceVertical决定),往水平方向复制拉伸
![X轴](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/sliceX.png)

- ###### Y轴取一个像素高,24像素宽(由sliceHorizontal决定),往垂直方向复制拉伸
![Y轴](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/sliceY.png)

- ###### X轴,Y轴取一个像素宽,一个像素高,往XY轴拉伸复制
![XY轴](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/sliceXY.png)

- ###### 最终效果
![最终效果](https://github.com/renxionghui/vue-dot9/blob/master/screenshort/target.png)

### 其他说明
欢迎指正,邮箱:renxionghui@126.com

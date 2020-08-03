<!--
 * @Descripttion: 
 * @Date: 2020-07-25 15:55:19
--> 
<template>
    <div class="home">
        <div class="box1" v-dot9='option1' @click='handleClick' :style='{width:width+"px",height:height+"px"}'>

        </div>

        <div class="box2" v-dot9='option2'>

        </div>

        <div class="box3" v-dot9='option3'>

        </div>

        <div class="box4" v-dot9='option4'>

        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            width: 72,
            height: 72,
            option1: {
                source: require('../assets/border.png'),
                resizable: false,
            },
            option2: {
                source: require('../assets/border.png'),
                sliceHorizontal: [24,48],
                // source: require('../assets/grid.jpeg'),
            },
            option3: {
                source: require('../assets/border.png'),
                sliceVertical: [24, 36, 48],
                // source: require('../assets/grid.jpeg'),
            },
            option4: {
                source: require('../assets/border.png'),
                sliceVertical: [24, 48],
                sliceHorizontal: [24, 48],
                // source: require('../assets/grid.jpeg'),
            },
        }
    },
    methods: {
        handleClick() {
            this.width += 10
            this.height += 10
        },
    },
}
</script>

<style scoped>
.home div {
    margin: 12px;
    background-color: #aaa;
}

.box2 {
    width: 600px;
    height: 72px;
}

.box3 {
    width: 72px;
    height: 600px;
}

.box4 {
    width: 400px;
    height: 300px;
}
</style>

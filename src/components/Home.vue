<!--
 * @Descripttion: 
 * @Date: 2020-07-25 15:55:19
--> 
<template>
    <div class="home">
        <!-- <div class="box1" v-dot9='option1' @click='handleClick' :style='{width:width+"px",height:height+"px"}'>

        </div>

        <div class="box2" v-dot9='option2'>

        </div>

        <div class="box3" v-dot9='option3'>

        </div>

        <div class="box4" v-dot9='option4'>

        </div> -->
        <div class="box5" v-dot9='option5'>

        </div>

        <div class='box6'></div>
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
            },
            option3: {
                source: require('../assets/border.png'),
                sliceVertical: [24, 36, 48],
            },
            option4: {
                source: require('../assets/border.png'),
                sliceVertical: [24, 48],
                sliceHorizontal: [24, 48],
            },
            option5: {
                source: require('../assets/border2.svg'),
                sliceHorizontal: [100,580],
                // sliceVertical: [100, 160],
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

.box5{
    width: 900px;
    height: 400px;
    
}

.box6{
    width: 680px;
    height: 240px;
    background-color: #282c34;
    background-image: url('../assets/border2.svg');
}


</style>

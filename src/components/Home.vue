<!--
 * @Descripttion: 
 * @Date: 2020-07-25 15:55:19
--> 
<template>
    <div class="home">
        <!-- <div class="box1" v-dot9='option1'>

        </div> -->

        <div class="box2" v-dot9='option2'>

        </div>

        <div class="box3" v-dot9='option3'>

        </div>

        <!-- <div class="box4" v-dot9='option4'>

        </div> -->
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            option1: {
                source: require('../assets/border.png'),
            },
            option2: {
                source: require('../assets/border.png'),
                sliceVertical: [18, 36, 54],
                // source: require('../assets/grid.jpeg'),
                // sliceOption:{
                //     x:[28,36,46,54]
                // }
            },
            option3: {
                source: require('../assets/border.png'),
                sliceHorizontal: [24, 36, 48],
                // source: require('../assets/grid.jpeg'),
            },
            option4: {
                source: require('../assets/border.png'),
                // source: require('../assets/grid.jpeg'),
            },
        }
    },
}
</script>

<style scoped>
.home div {
    margin: 12px;
    background-color: #aaa;
}
.box1 {
    width: 72px;
    height: 72px;
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

<template>
    <div class="home" v-dot9='options'>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            options: {
                url: require('../assets/border.png'),
            },
        }
    },
}
</script>

<style scoped>
</style>

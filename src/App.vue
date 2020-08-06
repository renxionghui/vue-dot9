<template>
    <div id="app">
      <home></home>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {
        home: () => import('./components/Home.vue'),
    },
}
</script>

<style>
body canvas{
    margin: 12px;
}
</style>

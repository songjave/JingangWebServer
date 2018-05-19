<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <v-browser></v-browser>
        <div class="content">
            <transition name="move" mode="out-in"><router-view :key="key"></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vBrowser from './BrowserFit.vue';
    export default {
        components: {
            vHead, vSidebar, vBrowser
        },
        computed: {
            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            }
        }
    }
</script>

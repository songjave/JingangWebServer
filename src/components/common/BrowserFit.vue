<template>
</template>
<script>
    export default {
        data() {
            return {
                downloadUrl: '/chrome.html'
            }
        },
        created() {
            // 匹配chrome浏览器，低于53
            let s = '';
            s = navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/);
            if (!s || parseInt(s[1]) < 53) {
                // console.log('浏览器版本不匹配');
                location.href = this.downloadUrl;
            }
        },
        computed:{
        },
        methods:{
        }
    }
</script>
<style>
</style>

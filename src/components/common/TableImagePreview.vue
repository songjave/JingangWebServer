<template>
    <div style="display:inline">
        <img :src="url" style="width:40px;height:40px;vertical-align:middle" @click="preview(url)">
        <el-dialog :title="myTitle" :visible.sync="imagePreviewVisible" :size="mySize" >
            <img :src="url" style="width:100%;">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['url', 'size', 'title'],
        data: function(){
            return {
                myTitle: this.title || '',
                mySize: this.size || 'small',
                imagePreviewVisible: false
            }
        },
        methods: {
            preview(url) {
                console.log(url);
                this.imagePreviewVisible = true;
            },
        }
    }
</script>

<style>
</style>

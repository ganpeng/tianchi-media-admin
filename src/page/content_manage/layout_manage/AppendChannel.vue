<template>
    <div>
        <h3 class="text-left">找到以下符合该位置尺寸要求的图片：</h3>
        <ul class="cover-list">
            <li v-for="(item,index) in specPosterImages" :key="index">
                <div
                    :style="{ 'background-image': 'url(' + appendImagePrefix(item.uri) + ')'}"
                    class="image-box"
                    @click="displayImage(index)">
                </div>
                <el-radio
                    v-model="programmeImageUri"
                    :label="item.uri"
                    @change="setCoverImage">
                        {{item.name}}
                </el-radio>
            </li>
        </ul>
        <div class="add-box">
            <el-button type="success" @click="addCover">添加图片</el-button>
        </div>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
        <upload-image
            :size='size'
            title="上传节目封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeSetChannelDialog">取 消</el-button>
            <el-button type="primary" @click="setChannel">确定</el-button>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>

</style>

<template>
    <div class="site-custom-container">
        <div class="content-title">配置定制</div>
        <div class="seperator-line"></div>
        <div class="content">
            <div class="logo">
                <h2 class="content-sub-title">站点Logo</h2>
                <el-button class="btn-style-two" @click="updateSiteCustom(1)">修改</el-button>
            </div>
            <div class="image">
                <h2 class="content-sub-title">开机图片</h2>
                <el-button class="btn-style-two" @click="updateSiteCustom(2)">修改</el-button>
            </div>
            <div class="vid">
                <h2 class="content-sub-title">开机视频</h2>
                <el-button class="btn-style-two" @click="updateSiteCustom(3)">修改</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SiteCustom',
    methods: {
        updateSiteCustom(type) {
            this.$router.push({name: 'EditSiteCustom', query: {type}});
        }
    }
};
</script>
<style lang="scss" scoped>
.site-custom-container {
    .content {
        text-align: left;
    }
}
</style>

<template>
    <div class="banner-container">
        <ul class="banner-list">
            <li v-for="(banner, index) in bannerList" :key="index" class="banner-item"></li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Mfs1',
    data() {
        return {
            bannerList: [
                {
                    index: 1
                },
                {
                    index: 2
                },
                {
                    index: 3
                }
            ]
        };
    }
};
</script>
<style lang="scss" scoped>
.banner-container {
    .banner-list {
        .banner-item {
            width: 900px;
            height: 510px;
            background:rgba(37,45,63,0.5);
            border-radius:10px;
        }
    }
}
</style>

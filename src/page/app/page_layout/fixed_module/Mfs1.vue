<template>
    <div class="banner-container">
        <flickity ref="flickity" :options="flickityOptions">
            <div v-for="(banner, index) in bannerList" :key="index" class="carousel-cell">{{banner.index}}</div>
        </flickity>
    </div>
</template>
<script>
import Flickity from 'vue-flickity';
export default {
    name: 'Mfs1',
    components: {Flickity},
    data() {
        return {
            flickityOptions: {
                initialIndex: 1,
                prevNextButtons: false,
                pageDots: true,
                wrapAround: true
            },
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
    },
    created() {

    }
};
</script>
<style lang="scss" scoped>
.banner-container {
    position: relative;
    height: 510px;
    margin-top: 60px;
    .carousel-cell {
        width: 900px;
        height: 510px;
        background:rgba(37,45,63,0.5);
        border-radius:10px;
        margin-left: 20px;
    }
}
</style>
<style lang="scss">
.banner-container {
    .flickity-page-dots {
        width: 900px;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
        margin-left: 30px;
        .dot {
            width: 8px;
            height: 8px;
            background: rgba(102,119,153,1);
            border-radius: 2px;
            margin: 0;
            margin-right: 8px;
            &.is-selected {
                width: 16px;
                background: rgba(25,137,250,1);
            }
        }
    }
}
</style>

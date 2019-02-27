<template>
    <!-- 单图片的海报组件 -->
    <div class="single-poster-container" :style="containerStyleStr">
        <img v-if="uri" :src="uri" alt="" :style="imgStyleStr">
        <span v-if="uri" class="desc">{{desc}}</span>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'SinglePoster',
    props: {
        img: Object,
        default: () => {}
    },
    computed: {
        uri() {
            let uri = _.get(this.img, 'uri');
            return uri;
        },
        desc() {
            let width = _.get(this.img, 'width');
            let height = _.get(this.img, 'height');
            return `${width} * ${height}`;
        },
        containerStyleStr() {
            try {
                let width = _.get(this.img, 'width');
                return `width: ${parseInt(width) * 0.3}px;`;
            } catch (error) {
                return '';
            }
        },
        imgStyleStr() {
            try {
                let width = _.get(this.img, 'width');
                let height = _.get(this.img, 'height');
                return `width: ${parseInt(width) * 0.3}px;height: ${parseInt(height) * 0.3}px;`;
            } catch (error) {
                return '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.single-poster-container {
    img {
        border: 1px solid #3E495E;
        border-radius: 8px;
        display: block;
    }
    .desc {
        display: block;
        text-align: center;
    }
}
</style>

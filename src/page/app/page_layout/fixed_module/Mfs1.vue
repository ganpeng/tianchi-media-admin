<template>
    <div class="banner-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="swiper-wrapper">
            <swiper class="swiper-container" :options="swiperOption">
                <swiper-slide v-for="(banner, index) in bannerList" :key="index">
                    <span class="inner-bg" :style="styleBgImageStr(index)">
                        <span class="programme-name">
                            {{banner.name}}: {{banner.desc}}
                        </span>
                    </span>
                </swiper-slide>
                <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
            </swiper>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import _ from 'lodash';

import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
    name: 'Mfs1',
    components: {swiper, swiperSlide},
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet(index, className) {
                        return `<span class="${className} swiper-pagination-bullet-custom"></span>`;
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            activeLayout: 'appPageLayout/activeLayout'
        }),
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        },
        bannerList() {
            let bannerList = _.get(this.activeLayout, '0.layoutItemMultiList');
            return bannerList || [];
        }
    },
    methods: {
        editFixedModuleHandler() {
            let id = _.get(this.activeLayout, '0.id');
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditAppFixedModule', params: {navbarId, index: 0}, query: {id} });
        }
    }
};
</script>
<style lang="scss" scoped>
.banner-container {
    position: relative;
    height: 510px;
    .btn-field {
        margin: 10px 0 10px 0;
        display: flex;
        justify-content: flex-end;
    }
    .swiper-wrapper {
        width: 1200px;
        overflow: hidden;
        .swiper-container {
            position: relative;
            width: 900px;
            overflow: visible!important;
            .inner-bg {
                position: relative;
                display: block;
                height: 510px;
                background-repeat: no-repeat;
                background-size: cover;
                .programme-name {
                    position: absolute;
                    bottom: 30px;
                    left: 20px;
                    font-size: 24px;
                    font-weight: 400;
                    color: rgba(255,255,255,1);
                    line-height: 33px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.banner-container {
    .swiper-slide {
        width: 900px!important;
        height: 510px;
        background-color:rgba(37,45,63,0.5);
        border-radius:10px;
    }
    .swiper-pagination-bullets {
        width: auto;
        margin-left: 20px;
        .swiper-pagination-bullet-custom {
            width: 8px;
            height: 8px;
            background: rgba(102,119,153,1);
            border-radius: 2px;
            margin: 0;
            margin-right: 8px;
            &.swiper-pagination-bullet-active {
                width: 16px;
                background: rgba(25,137,250,1);
            }
        }
    }
}
</style>

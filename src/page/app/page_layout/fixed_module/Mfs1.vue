<template>
    <div class="banner-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="swiper-wrapper">
            <swiper class="swiper-container" :options="swiperOption">
                <swiper-slide class="swiper-slide-one" v-if="isRecommend" key="10000000">
                    <div class="channel">
                        <img :src="channel.logoUri" alt="">
                        <div class="text-info">
                            <p class="title">当前直播频道</p>
                            <p class="name">{{channel.no}}&nbsp;&nbsp;{{channel.name}}</p>
                        </div>
                    </div>
                    <div class="live">
                        <svg-icon icon-class="live"></svg-icon>
                    </div>
                </swiper-slide>
                <swiper-slide v-for="(banner, index) in bannerList" :key="index">
                    <span class="inner-bg" :style="styleBgImageStr(index)">
                        <span class="programme-name">
                            {{banner.desc || banner.name}}
                        </span>
                        <span class="linear-mask"></span>
                        <corner-mark :squareIndex="index" :layoutItem="getLayoutItemDetail(navbarId, 0, index)" :cornerMark="getLayoutItemCornerMark(navbarId, 0, index)"></corner-mark>
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

import CornerMark from '@/page/app/page_layout/CornerMark';

export default {
    name: 'Mfs1',
    components: {swiper, swiperSlide, CornerMark},
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            channel: {},
            navbarId: '',
            swiperOption: {
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true,
                autoplay: {
                    delay: 4500,
                    disableOnInteraction: false
                },
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
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
            let res = await this.$service.getAppChannelLayout({navBarId: navbarId});
            if (res && res.code === 0) {
                let obj = res.data.list[0];
                this.channel = obj && obj.channel ? obj.channel : {};
                if (this.delay) {
                    this.autoplay.delay = 0;
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            getLayoutItemCornerMark: 'appPageLayout/getLayoutItemCornerMark',
            getLayoutItemDetail: 'appPageLayout/getLayoutItemDetail',

            activeLayout: 'appPageLayout/activeLayout'
        }),
        delay() {
            let delayFlag = _.every(this.bannerList, (item) => !item.id);
            return delayFlag;
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        },
        isRecommend() {
            let isRecommend = _.get(this.activeLayout, '0.navBarName') === '推荐';
            return isRecommend;
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
            this.$router.push({ name: 'EditAppFixedModule', params: {navbarId, index: 0}, query: {id, isRecommend: this.isRecommend} });
        }
    }
};
</script>
<style lang="scss" scoped>
.banner-container {
    position: relative;
    overflow: hidden;
    .btn-field {
        margin: 10px 0 10px 0;
        display: flex;
        justify-content: flex-end;
    }
    .swiper-wrapper {
        width: 1200px;
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
                border-radius: 10px;
                background-color: rgba(42,48,64,0.5);
                .programme-name {
                    position: absolute;
                    bottom: 10px;
                    left: 0px;
                    font-size: 24px;
                    font-weight: 400;
                    color: rgba(255,255,255,1);
                    width: 100%;
                    height: 72px;
                    line-height: 72px;
                    text-align: left;
                    text-indent: 20px;
                    z-index: 5;
                }
                .linear-mask {
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    width: 100%;
                    height: 72px;
                    background: linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%);
                    z-index: 10;
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
        height: 510px!important;
        background-color:rgba(37,45,63,0.5);
        border-radius:10px;
        &.swiper-slide-one {
            position: relative;
            .live {
                position: absolute;
                bottom: 30px;
                right: 30px;
                .svg-icon {
                    width: 120px;
                    height: 66px;
                }
            }
            .text {
                font-size: 24px;
                color: #6F7480;
            }
            //  频道样式
            .channel {
                position: absolute;
                display: flex;
                top: 20px;
                left: 20px;
                img {
                    display: block;
                    width: 200px;
                    height: 200px;
                    margin-right: 30px;
                    border-radius: 8px;
                }
                .text-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    .title {
                        font-size: 16px;
                        line-height: 22px;
                        color: #6F7480;
                        border-bottom: 1px solid #6F7480;
                    }
                    .name {
                        border: 1px solid #1989FA;
                        border-radius: 8px;
                        font-size: 22px;
                        color: #1989FA;
                        padding: 6px 10px;
                        margin-top: 20px;
                    }
                }
            }
        }
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

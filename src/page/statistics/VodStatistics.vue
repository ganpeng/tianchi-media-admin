<template>
    <div class="vod-statistics-container">
        <div class="vod-top-field">
            <div class="left-field">
                <div class="left-top-field top-field">
                    <div class="field-header">
                        <div class="line"></div>
                        <div class="icon">
                            <svg-icon icon-class="aside_programme"></svg-icon>
                        </div>
                        <div class="title">节目</div>
                    </div>
                    <div class="top-field-content">
                        <div class="left-content">
                            <div class="content-one">
                                <div class="title">
                                    <div class="text">节目总数</div>
                                    <svg-icon icon-class="vod_static_icon_03"></svg-icon>
                                </div>
                                <div class="value">{{summary.totalNumber}}</div>
                            </div>
                            <div class="content-two">
                                <div class="title">
                                    <svg-icon icon-class="vod_static_icon_01"></svg-icon>
                                    <div class="text">已上架节目数</div>
                                </div>
                                <div class="value">{{summary.visibleNumber}}</div>
                            </div>
                            <div class="content-three">
                                <div class="title">
                                    <svg-icon icon-class="vod_static_icon_02"></svg-icon>
                                    <div class="text">已下架节目数</div>
                                </div>
                                <div class="value">{{summary.invisibleNumber}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="splite"></div>
            <div class="right-field">
                <div class="right-top-field top-field">
                    <div class="field-header">
                        <div class="line"></div>
                        <div class="icon">
                            <svg-icon icon-class="aside_video"></svg-icon>
                        </div>
                        <div class="title">视频</div>
                    </div>
                    <div class="top-field-content">
                        <div class="left-content">
                            <div class="content-one">
                                <div class="title">
                                    <div class="text">视频总数</div>
                                    <svg-icon icon-class="vod_static_icon_04"></svg-icon>
                                </div>
                                <div class="value"></div>
                            </div>
                            <div class="content-two">
                                <div class="value">{{videoSummary.totalNumber}}</div>
                            </div>
                        </div>
                        <div class="right-content">
                            <div class="right-top-content">
                                <div class="title">视频<br/>总时长</div>
                                <div class="value">
                                    <div class="text">{{formateSeconds(videoSummary.durationNumber)}}<i>小时</i></div>
                                    <svg-icon icon-class="channel_static_icon_05"></svg-icon>
                                </div>
                            </div>
                            <div class="right-bottom-content">
                                <div class="title">视频<br/>总体积</div>
                                <div class="value">
                                    <div class="text">{{convertFileSize(videoSummary.capacityNumber).value}}<i>{{convertFileSize(videoSummary.capacityNumber).unit}}</i></div>
                                    <svg-icon icon-class="channel_static_icon_06"></svg-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="vod-bottom-field">
            <div class="field-header">
                <div class="line"></div>
                <div class="icon">
                    <svg-icon icon-class="vod_static_icon_05"></svg-icon>
                </div>
                <div class="title">排行榜</div>
                <!-- <div class="desc">*截止今天00:00全部数据*</div> -->
            </div>
            <div class="vod-bottom-content">
                <div class="content-item">
                    <div class="content-item-header">
                        <div class="title">节目点击次数<i class="sub-title">实时更新</i></div>
                    </div>
                    <ul class="sort-list play-count-sort-list">
                        <li class="sort-item">
                            <div class="item">NO.</div>
                            <div class="item">名称</div>
                            <div class="item">分类</div>
                            <div class="item">点击量</div>
                        </li>
                        <li v-for="(top, index) in playCountList" :key="index" class="sort-item sort-item-color">
                            <div class="item">
                                <div class="index">{{index + 1}}</div>
                            </div>
                            <div class="item">{{top.name}}</div>
                            <div class="item">{{getCategory(top.categoryList)}}</div>
                            <div class="item">{{top.playCountReal}}</div>
                        </li>
                    </ul>
                </div>
                <div class="content-item">
                    <div class="content-item-header">
                        <div class="title">节目分类数量<i class="sub-title">实时更新</i></div>
                    </div>
                    <ul class="sort-list">
                        <li class="sort-item">
                            <div class="item no-item">NO.</div>
                            <div class="item">分类</div>
                            <div class="item">节目数量</div>
                        </li>
                        <li v-for="(top, index) in numberList" :key="index" class="sort-item sort-item-color">
                            <div class="item no-item">
                                <div class="index">{{index + 1}}</div>
                            </div>
                            <div class="item">{{top.categoryName}}</div>
                            <div class="item">{{top.programmeNumber}}</div>
                        </li>
                    </ul>
                </div>
                <div class="content-item">
                    <div class="content-item-header">
                        <div class="title">节目分类时长<i class="sub-title">*截止今天00:00全部数据*</i></div>
                        <div class="unit">小时</div>
                    </div>
                    <ul class="sort-list">
                        <li class="sort-item">
                            <div class="item no-item">NO.</div>
                            <div class="item">分类</div>
                            <div class="item">节目时长</div>
                        </li>
                        <li v-for="(top, index) in durationList" :key="index" class="sort-item sort-item-color">
                            <div class="item no-item">
                                <div class="index">{{index + 1}}</div>
                            </div>
                            <div class="item">{{top.categoryName}}</div>
                            <div class="item">{{formateSeconds(top.takeTimeInSec)}}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'VodStatistics',
    data() {
        return {
            videoSummary: {},
            summary: {},
            durationList: [],
            numberList: [],
            playCountList: []
        };
    },
    created() {
        this.getProgrammeStatistics();
        this.getVideoStatistics();
    },
    computed: {
        getCategory() {
            return (categoryList) => {
                return categoryList.map((item) => item.name).join(', ');
            };
        },
        convertFileSize(size) {
            return (size) => {
                let kb = 1024;
                let mb = kb * 1024;
                let gb = mb * 1024;
                let tb = gb * 1024;
                if (!size) {
                    return {
                        value: 0,
                        unit: 'Byte'
                    };
                }
                if (size >= tb) {
                    return {
                        value: Math.round(size / tb),
                        unit: 'TB'
                    };
                } else if (size >= gb) {
                    return {
                        value: Math.round(size / gb),
                        unit: 'GB'
                    };
                } else if (size >= mb) {
                    let f = size / mb;
                    return {
                        value: Math.round(f),
                        unit: 'MB'
                    };
                } else if (size >= kb) {
                    let f = size / kb;
                    return {
                        value: Math.round(f),
                        unit: 'KB'
                    };
                } else {
                    return {
                        value: size,
                        unit: 'Byte'
                    };
                }
            };
        }
    },
    methods: {
        getVideoStatistics() {
            this.$service.getVideoStatistics()
                .then((res) => {
                    if (res && res.code === 0) {
                        let {summary} = res.data;
                        this.videoSummary = _.reduce(summary, (res, val) => _.assign({}, res, val), {});
                    }
                }).catch((err) => {
                    console.log(err);
                });
        },
        getProgrammeStatistics() {
            this.$service.getProgrammeStatistics()
                .then((res) => {
                    if (res && res.code === 0) {
                        let {durationList, numberList, playCountList, summary} = res.data;
                        this.durationList = durationList || [];
                        this.numberList = numberList || [];
                        this.playCountList = _.chain(playCountList).sortBy('playCountReal').reverse().value() || [];
                        this.summary = _.reduce(summary, (res, val) => _.assign({}, res, val), {});
                    }
                }).catch((err) => {
                    console.log(err);
                });
        },
        formateSeconds(endTime) {
            let secondTime = parseInt(endTime);
            let min = 0;
            let h = 0;
            if (secondTime > 60) {
                min = parseInt(secondTime / 60);
                secondTime = parseInt(secondTime % 60);
                if (min > 60) {
                    h = parseInt(min / 60);
                }
            }
            return h;
        }
    }
};
</script>
<style lang="scss" scoped>
.vod-statistics-container {
    .vod-top-field {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 252px;
        padding-bottom: 15px;
        border-bottom: 1px solid #252D3F;
        // height: 100%;
        .left-field {
            flex: 1;
            // height: 100%;
            .left-top-field {
                display: flex;
                flex-direction: column;
                .field-header {
                    .line {
                        background-color: #4A90E2;
                    }
                }
                .top-field-content {
                    display: flex;
                    flex: 1;
                    .left-content {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        background-color: #293550;
                        border-radius: 16px;
                        padding: 0 16px;
                        .content-one {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                            height: 72px;
                            border-bottom: 1px solid #36425C;
                            .title {
                                position: relative;
                                width: 223px;
                                height: 72px;
                                .svg-icon {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 223px;
                                    height: 72px;
                                }
                                .text {
                                    position: absolute;
                                    left: 8px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    font-size: 14px;
                                    font-weight: 600;
                                    color: #A3D0FD;
                                }
                            }
                            .value {
                                font-size: 40px;
                                color: #1989FA;
                            }
                        }
                        .content-two,
                        .content-three {
                            flex: 1;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .title {
                                display: flex;
                                align-items: center;
                                .svg-icon {
                                    width: 32px;
                                    height: 32px;
                                    margin-right: 8px;
                                }
                                .text {
                                    font-size: 12px;
                                    font-weight: 400;
                                    color: #A3D0FD;
                                }
                            }
                        }
                        .content-two {
                            .value {
                                font-size: 28px;
                                color: #00A2DE;
                            }
                        }
                        .content-three {
                            .value {
                                font-size: 28px;
                                color: #FC8C07;
                            }
                        }
                    }
                    .right-content {
                        position: relative;
                        flex: 1;
                        background-color: #293550;
                        border-radius: 16px;
                        padding: 0 16px;
                        .title {
                            position: absolute;
                            top: 16px;
                            left: 16px;
                            font-size: 14px;
                            color: #A3D0FD;
                        }
                        .value {
                            position: absolute;
                            bottom: 16px;
                            left: 16px;
                            font-size: 48px;
                            color: #00ABFF;
                        }
                        .svg-icon {
                            position: absolute;
                            top: 50%;
                            right: 16px;
                            transform: translateY(-50%);
                            width: 147px;
                            height: 163px;
                        }
                    }
                }
            }
            .left-bottom-field {
                // flex: 1;
            }
        }
        .splite {
            width: 1px;
            height: 232px;
            margin: 0 20px;
            background-color: #252D3F;
        }
        .right-field {
            flex: 1;
            height: 100%;
            .right-top-field {
                .field-header {
                    .line {
                        background-color: #639E68;
                    }
                }
                .top-field-content {
                    display: flex;
                    flex: 1;
                    .left-content {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        margin-right: 20px;
                        background-color: #293550;
                        border-radius: 16px;
                        padding: 0 16px;
                        .content-one {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                            height: 72px;
                            border-bottom: 1px solid #36425C;
                            .title {
                                position: relative;
                                width: 223px;
                                height: 72px;
                                .svg-icon {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 223px;
                                    height: 72px;
                                }
                                .text {
                                    position: absolute;
                                    left: 8px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    font-size: 14px;
                                    font-weight: 600;
                                    color: #A3D0FD;
                                }
                            }
                            .value {
                                font-size: 40px;
                                color: #67C23A;
                            }
                        }
                        .content-two {
                            flex: 1;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .value {
                                font-size: 28px;
                                color:#67C23A;
                            }
                        }
                    }
                    .right-content {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        flex: 1;
                        .right-top-content,
                        .right-bottom-content {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            width: 100%;
                            height: 76px;
                            background-color: #26304A;
                            border-radius: 16px;
                            padding: 0 16px;
                            .title {
                                font-size: 14px;
                                color: #A3D0FD;
                                text-align: left;
                            }
                            .value {
                                display: flex;
                                align-items: center;
                                .text {
                                    font-size: 32px;
                                    color: #3AC26F;
                                    i {
                                        font-size: 14px;
                                    }
                                }
                                .svg-icon {
                                    width: 30px;
                                    height: 30px;
                                    margin-left: 8px;
                                }
                            }
                        }
                    }
                }
            }
            .right-bottom-field {
                // flex: 1;
            }
        }
        .top-field {
            display: flex;
            flex-direction: column;
            width: 100%;
            // height: 34.11%;
            // height: 35%;
            height: 232px;
            margin-bottom: 40px;
            .top-field-content {
                flex: 1;
            }
        }
    }
    .vod-bottom-field {
        padding-top: 15px;
        .field-header {
            .icon {
                .svg-icon {
                    width: 40px;
                    height: 38px;
                }
            }
        }
        .vod-bottom-content {
            display: flex;
            .content-item {
                flex: 1;
                .content-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 42px;
                    .title {
                        font-size: 14px;
                        font-weight: 600;
                        color: #A3D0FD;
                        .sub-title {
                            font-size: 12px;
                            font-weight: 400;
                            color: rgba(163, 208, 253, 0.5);
                            margin-left: 10px;
                        }
                    }
                    .unit {
                        color: #A3D0FD;
                        font-size: 12px;
                    }
                }
                .sort-list {
                    .sort-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        width: 100%;
                        height: 40px;
                        padding: 0 15px;
                        border-radius: 8px;
                        .item {
                            // width: 25%;
                            text-align: left;
                            color: #A3D0FD;
                            font-size: 12px;
                            .index {
                                width: 20px;
                                height: 20px;
                                line-height: 20px;
                                border-radius: 50%;
                                color: #fff;
                                text-align: center;
                            }
                            margin-right: 10px;
                            &.no-item {
                                flex: 1;
                            }
                        }
                        .item:nth-of-type(2),
                        .item:nth-of-type(3) {
                            flex: 1;
                        }
                    }
                    &.play-count-sort-list {
                        .item:nth-of-type(1) {
                            width: 30px;
                        }
                        .item:nth-of-type(2) {
                            flex: 4;
                        }
                        .item:nth-of-type(3) {
                            flex: 2
                        }
                        .item:nth-of-type(4) {
                            flex: 1;
                        }
                    }
                    .sort-item + .sort-item {
                        margin-top: 4px;
                    }
                    .sort-item:nth-child(odd) {
                        background-color: rgba(38, 48, 74, 0.5);
                    }
                    .sort-item:nth-child(even) {
                        background-color: rgba(38, 48, 74, 0.8);
                    }
                    .sort-item:nth-of-type(1) {
                        .item {
                            color: #46A0D4;
                            font-size: 12px;
                        }
                    }
                    .sort-item:nth-of-type(2) {
                        .item {
                            .index {
                                background-color: #009FBE;
                            }
                        }
                    }
                    .sort-item:nth-of-type(3) {
                        .item {
                            .index {
                                background-color: rgba(0, 159, 190, 0.6);
                            }
                        }
                    }
                    .sort-item:nth-of-type(4) {
                        .item {
                            .index {
                                background-color: rgba(0, 159, 190, 0.2);
                            }
                        }
                    }
                }
            }
            .content-item + .content-item {
                margin-left: 20px;
            }
        }
    }
    .field-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
        .line {
            width: 4px;
            height: 100%;
            border-radius: 2px;
            background-color: #009FBE;
        }
        .icon {
            margin: 0 8px;
            .svg-icon {
                width: 64px;
                height: 40px;
            }
            .svg-icon-aside_programme {
                fill: #55BDFF;
            }
            .svg-icon-aside_video {
                fill: #639E68;
            }
        }
        .title {
            font-size: 20px;
            font-weight: 400;
            color: #FFF;
        }
        .desc {
            font-size: 12px;
            font-weight: 400;
            color: rgba(163, 208, 253, 0.5);
            margin-left: 20px;
        }
    }
}
</style>

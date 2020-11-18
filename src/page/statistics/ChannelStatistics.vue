<template>
    <div class="channel-statistics-container">
        <div class="left-field">
            <div class="left-top-field top-field">
                <div class="field-header">
                    <div class="line"></div>
                    <div class="icon">
                        <svg-icon icon-class="channel_static_icon_01"></svg-icon>
                    </div>
                    <div class="title">直播</div>
                </div>
                <div class="top-field-content">
                    <div class="left-content">
                        <div class="content-one">
                            <div class="title">
                                <div class="text">直播总数</div>
                                <svg-icon icon-class="channel_static_icon_07"></svg-icon>
                            </div>
                            <div class="value">{{liveSummary.totalNumber}}</div>
                        </div>
                        <div class="content-two">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_03"></svg-icon>
                                <div class="text">TV端直播数</div>
                            </div>
                            <div class="value">{{liveSummary.tvNumber}}</div>
                        </div>
                        <div class="content-three">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_04"></svg-icon>
                                <div class="text">APP端直播数</div>
                            </div>
                            <div class="value">{{liveSummary.appNumber}}</div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="title">开启回看频道</div>
                        <div class="value">{{liveSummary.recordNumber}}</div>
                        <svg-icon icon-class="channel_static_icon_08"></svg-icon>
                    </div>
                </div>
            </div>
            <div class="left-bottom-field bottom-field">
                <div class="chart-header">
                    <div class="title">直播分类</div>
                    <div class="unit">单位：个</div>
                </div>
                <div id="live-data-chart"></div>
            </div>
        </div>
        <div class="splite"></div>
        <div class="right-field">
            <div class="right-top-field top-field">
                <div class="field-header">
                    <div class="line"></div>
                    <div class="icon">
                        <svg-icon icon-class="channel_static_icon_02"></svg-icon>
                    </div>
                    <div class="title">轮播</div>
                </div>
                <div class="top-field-content">
                    <div class="left-content">
                        <div class="content-one">
                            <div class="title">
                                <div class="text">轮播总数</div>
                                <svg-icon icon-class="channel_static_icon_09"></svg-icon>
                            </div>
                            <div class="value">{{carouselSummary.totalNumber}}</div>
                        </div>
                        <div class="content-two">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_03"></svg-icon>
                                <div class="text">TV端轮播数</div>
                            </div>
                            <div class="value">{{carouselSummary.tvNumber}}</div>
                        </div>
                        <div class="content-three">
                            <div class="title">
                                <svg-icon icon-class="channel_static_icon_04"></svg-icon>
                                <div class="text">APP端轮播数</div>
                            </div>
                            <div class="value">{{carouselSummary.appNumber}}</div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="right-top-content">
                            <div class="title">轮播视频总时长</div>
                            <div class="value">
                                <div class="text">{{formateSeconds(carouselSummary.totalTakeSec)}}<i>小时</i></div>
                            </div>
                            <svg-icon icon-class="channel_static_icon_05"></svg-icon>
                        </div>
                        <!--
                        <div class="right-bottom-content">
                            <div class="title">轮播视频<br/>总体积</div>
                            <div class="value">
                                <div class="text">10<i>TB</i></div>
                                <svg-icon icon-class="channel_static_icon_06"></svg-icon>
                            </div>
                        </div>
                        -->
                    </div>
                </div>
            </div>
            <div class="right-bottom-field bottom-field">
                <div class="chart-header">
                    <div class="title">轮播分类</div>
                    <div class="unit">单位：个</div>
                </div>
                <div id="carousel-data-chart"></div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts';
import _ from 'lodash';
export default {
    name: 'ChannelStatistics',
    data() {
        return {
            liveDataChart: null,
            carouselDataChart: null,
            liveSummary: {},
            carouselSummary: {}
        };
    },
    async created() {
        try {
            this.getCarouselStatistics();
            this.getLiveStatistics();
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        getCarouselStatistics() {
            this.$service.getCarouselStatistics()
                .then((res) => {
                    if (res && res.code === 0) {
                        let channelType = _.get(res.data, 'channelType') || [];
                        let summary = _.get(res.data, 'summary') || {};
                        let labelList = _.chain(channelType)
                                         .map((item) => item.id)
                                         .value();
                        let valueList = _.chain(labelList)
                                         .map((id) => {
                                             let item = _.find(channelType, (item) => item.id === id);
                                             return _.get(item, 'number') || 0;
                                         })
                                         .value();
                        this.carouselSummary = _.reduce(summary, (res, val) => _.assign({}, res, val), {});
                        console.log(this.carouselSummary);
                        let data = {labelList, valueList};
                        this.initCarouselDataChart(data);
                    }
                }).catch((err) => {
                    console.log(err);
                });
        },
        getLiveStatistics() {
            this.$service.getLiveStatistics()
                .then((res) => {
                    if (res && res.code === 0) {
                        console.log(res.data);
                        let channelType = _.get(res.data, 'channelType') || [];
                        let summary = _.get(res.data, 'summary') || {};
                        let labelList = _.chain(channelType)
                                         .map((item) => item.id)
                                         .value();
                        let valueList = _.chain(labelList)
                                         .map((id) => {
                                             let item = _.find(channelType, (item) => item.id === id);
                                             return _.get(item, 'number') || 0;
                                         })
                                         .value();
                        this.liveSummary = _.reduce(summary, (res, val) => _.assign({}, res, val), {});
                        console.log(this.liveSummary);
                        let data = {labelList, valueList};
                        this.initLiveDataChart(data);
                    }
                }).catch((err) => {
                    console.log(err);
                });
        },
        async initLiveDataChart(data) {
            try {
                await this.$nextTick();
                let liveDataChartDom = document.querySelector('#live-data-chart');
                let liveDataChart = echarts.init(liveDataChartDom);
                this.liveDataChart = liveDataChart;
                // 为echarts对象加载数据
                liveDataChart.clear();
                liveDataChart.setOption(this.getLiveDataChartConfig(data), true);

                window.addEventListener('resize', () => {
                    this.liveDataChart.resize();
                }, false);
            } catch (err) {
                console.log(err);
            }
        },
        async initCarouselDataChart(data) {
            try {
                await this.$nextTick();
                let carouselDataChartDom = document.querySelector('#carousel-data-chart');
                let carouselDataChart = echarts.init(carouselDataChartDom);
                this.carouselDataChart = carouselDataChart;
                // 为echarts对象加载数据
                carouselDataChart.clear();
                carouselDataChart.setOption(this.getCarouselDataChartConfig(data), true);

                window.addEventListener('resize', () => {
                    this.carouselDataChart.resize();
                }, false);
            } catch (err) {
                console.log(err);
            }
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
        },
        getLiveDataChartConfig(data) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return `<span>${params.name}</span>:
                                <span style="color: ${params.color};">${params.value}</span>`;
                    }
                },
                grid: {
                    top: '10%',
                    left: '5%',
                    right: '2%',
                    bottom: '20%'
                },
                xAxis: {
                    type: 'category',
                    data: data.labelList,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 12,
                        color: '#A3D0FD',
                        interval: 0,
                        rotate: 40
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3E495E'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        fontSize: 12,
                        color: '#A3D0FD'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#3E495E'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#36425C']
                        }
                    }
                },
                series: [
                    {
                        data: data.valueList,
                        type: 'bar',
                        label: {
                            show: true,
                            color: '#FFF',
                            position: 'top'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 6,
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#148EFF'
                                },
                                {
                                    offset: 1,
                                    color: '#18A8FF'
                                }
                                ])
                            }
                        },
                        barWidth: 32,
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(216, 216, 216, 0.1)'
                        }
                    }
                ]
            };
        },
        getCarouselDataChartConfig(data) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        return `<span>${params.name}</span>:
                                <span style="color: ${params.color};">${params.value}</span>`;
                    }
                },
                grid: {
                    top: '10%',
                    left: '5%',
                    right: '2%',
                    bottom: '20%'
                },
                xAxis: {
                    type: 'category',
                    data: data.labelList,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 12,
                        color: '#A3D0FD',
                        interval: 0,
                        rotate: 40
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3E495E'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        fontSize: 12,
                        color: '#A3D0FD'
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#3E495E'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#36425C']
                        }
                    }
                },
                series: [
                    {
                        data: data.valueList,
                        type: 'bar',
                        label: {
                            show: true,
                            color: '#FFF',
                            position: 'top'
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 6,
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#95E3E2'
                                },
                                {
                                    offset: 1,
                                    color: '#62CCCA'
                                }
                                ])
                            }
                        },
                        barWidth: 32,
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(216, 216, 216, 0.1)'
                        }
                    }
                ]
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.channel-statistics-container {
    display: flex;
    width: 100%;
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
        height: 670px;
        // height: 100%;
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
                    .svg-icon {
                        position: absolute;
                        top: 50%;
                        right: 16px;
                        transform: translateY(-50%);
                        width: 147px;
                        height: 163px;
                    }
                }
                // .right-content {
                //     display: flex;
                //     flex-direction: column;
                //     justify-content: space-between;
                //     flex: 1;
                //     .right-top-content,
                //     .right-bottom-content {
                //         display: flex;
                //         justify-content: space-between;
                //         align-items: center;
                //         width: 100%;
                //         height: 76px;
                //         background-color: #26304A;
                //         border-radius: 16px;
                //         padding: 0 16px;
                //         .title {
                //             font-size: 14px;
                //             color: #A3D0FD;
                //             text-align: left;
                //         }
                //         .value {
                //             display: flex;
                //             align-items: center;
                //             .text {
                //                 font-size: 32px;
                //                 color: #3AC26F;
                //                 i {
                //                     font-size: 14px;
                //                 }
                //             }
                //             .svg-icon {
                //                 width: 30px;
                //                 height: 30px;
                //                 margin-left: 8px;
                //             }
                //         }
                //     }
                // }
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
            }
            .icon {
                margin: 0 8px;
                .svg-icon {
                    width: 64px;
                    height: 40px;
                }
            }
            .title {
                font-size: 20px;
                font-weight: 400;
                color: #FFF;
            }
        }
        .top-field-content {
            flex: 1;
        }
    }
    .bottom-field {
        height: 400px;
        padding: 16px 24px;
        border-radius: 16px;
        background-color: #26304A;
        .chart-header {
            display: flex;
            justify-content: space-between;
            // align-items: center;
            width: 100%;
            height: 20%;
            color: #A3D0FD;
            .title {
                font-size: 14px;
                font-weight: 600;
            }
            .unit {
                font-size: 12px;
            }
        }
        #live-data-chart,
        #carousel-data-chart {
            width: 100%;
            height: 80%;
        }
    }
}
</style>

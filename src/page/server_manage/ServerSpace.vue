<!--服务器存储空间组件-->
<template>
    <div>
        <div class="content-title">存储空间</div>
        <div id="serve-space-block" v-if="serveShow">
            <ve-pie
                :data="spaceChartData"
                width="500px"
                height="500px"
                :extend="spaceChartExtend">
            </ve-pie>
            <div class="pie-legend">
                <div>单位：GB</div>
                <div><i></i>已用空间</div>
                <div><i></i>可用空间</div>
                <div><i></i>预留空间</div>
            </div>
            <div class="space-info">
                <div>剩余空间还可存储<label>{{remainHour}}小时</label>的视频（按照 3.6 GB/小时计算）</div>
                <div>当前已经存储视频总时长<label>{{storedVideoDuration}}小时</label></div>
            </div>
        </div>
        <div id="serve-line-block" v-if="serveShow">
            <ve-histogram
                :data="chartData"
                :extend="chartExtend"
                width="700px"
                :settings="chartSettings"
                :textStyle="textStyle"
                :legend="legend">
            </ve-histogram>
        </div>
    </div>
</template>

<script>
    import ECharts from 'vue-echarts';
    import 'echarts/lib/chart/pie';

    export default {
        name: 'ServerSpace',
        components: {
            'v-chart': ECharts
        },
        data() {
            this.spaceChartExtend = {
                legend: {
                    show: false
                },
                color: ['#0062C4', '#74C292', '#008FC4'],
                grid: {
                    top: 0,
                    bottom: 0
                }
            };
            this.chartSettings = {
                stack: {'服务器': ['已用空间', '可用空间', '预留空间']}
            };
            return {
                serveShow: true,
                chartExtend: {
                    color: ['#0062C4', '#74C292', '#008FC4'],
                    xAxis: {
                        axisLabel: {
                            interval: 0,
                            margin: 12
                        }
                    },
                    yAxis: {
                        splitLine: {
                            lineStyle: {color: '#3E495E'}
                        }
                    },
                },
                textStyle: {
                    color: 'rgba(168,171,179,1)'
                },
                legend: {
                    show: false
                },
                storedVideoDuration: '',
                remainHour: 0,
                serverList: [],
                chartData: {
                    columns: ['名称', '已用空间', '可用空间', '预留空间'],
                    rows: []
                },
                spaceChartData: {
                    columns: ['空间', '大小'],
                    rows: [
                        {'空间': '已用空间', '大小': 1393},
                        {'空间': '可用空间', '大小': 3530},
                        {'空间': '预留空间', '大小': 2923}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getServerSpace().then(response => {
                    if (response && response.code === 0) {
                        this.serverList = response.data.serverResourcesList;
                        this.remainHour = response.data.remainHour;
                        this.storedVideoDuration = response.data.storedVideoDuration;
                        this.spaceChartData.rows[0]['大小'] = this.convertToGB(response.data.used);
                        this.spaceChartData.rows[1]['大小'] = this.convertToGB(response.data.free);
                        this.spaceChartData.rows[2]['大小'] = this.convertToGB(response.data.reserve);
                        let data = [];
                        this.serverList.map(item => {
                            data.push({
                                '名称': item.hostname,
                                '已用空间': this.convertToGB(item.value.used),
                                '可用空间': this.convertToGB(item.value.free),
                                '预留空间': this.convertToGB(item.value.reserve)
                            });
                        });
                        this.chartData.rows = data;
                    } else if (response && response.code === 1023) {
                        this.serveShow = false;
                    }
                });
            },
            convertToGB(value) {
                return (value / 1024 / 1024 / 1024).toFixed(0);
            }
        }
    };
</script>

<style scoped lang="less">

    #serve-line-block {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #serve-space-block {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 360px;
        .ve-pie {
            position: relative;
            top: -90px;
        }
        .space-info {
            position: relative;
            top: -250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            div {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 400;
                color: rgba(168, 171, 179, 1);
                &:last-child {
                    margin-top: 10px;
                }
                label {
                    margin: 0 10px;
                    font-size: 18px;
                    font-weight: 400;
                    color: rgba(25, 137, 250, 1);
                }
            }
        }
        .pie-legend {
            position: absolute;
            right: 92px;
            top: 0;
            div {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 12px;
                font-weight: 400;
                color: rgba(168, 171, 179, 1);
                &:nth-child(2) {
                    margin-top: 17px;
                    i {
                        background: rgba(0, 98, 196, 1);
                    }
                }
                &:nth-child(3) {
                    margin-top: 10px;
                    i {
                        background: #74C292;
                    }
                }
                &:nth-child(4) {
                    margin-top: 10px;
                    i {
                        background: #008FC4;
                    }
                }
                i {
                    margin-right: 10px;
                    width: 20px;
                    height: 20px;
                    border-radius: 2px;
                }
            }
        }
    }

</style>

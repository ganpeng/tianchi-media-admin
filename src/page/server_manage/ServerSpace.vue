<!--服务器存储空间组件-->
<template>
    <div>
        <div class="content-title">存储空间</div>
        <div class="text-center" v-if="serveShow">
            <ve-pie :data="chartDataAll" :legend="legend"></ve-pie>
            <div>剩余空间还可存储 {{remainHour}} 小时的视频</div>
            <div>注：按照 3.6 GB/小时计算</div>
        </div>
        <div class="text-center" v-if="serveShow">
            <ve-histogram :data="chartData" :settings="chartSettings" :textStyle="textStyle"
                          :legend="legend"></ve-histogram>
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
            this.chartSettings = {
                stack: {'服务器': ['已用空间', '可用空间', '预留空间']}
            };
            return {
                serveShow: true,
                xAxis: {
                    axisLine: {
                        lineStyle: {
                            width: 50
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            width: 50
                        }
                    }
                },
                textStyle: {
                    color: '#fff'
                },
                legend: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                remainHour: 0,
                serverList: [],
                chartData: {
                    columns: ['名称', '已用空间', '可用空间', '预留空间'],
                    rows: []
                },
                chartDataAll: {
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
                        this.chartDataAll.rows[0]['大小'] = this.convertToGB(response.data.used);
                        this.chartDataAll.rows[1]['大小'] = this.convertToGB(response.data.free);
                        this.chartDataAll.rows[2]['大小'] = this.convertToGB(response.data.reserve);
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

    .echarts {
        display: inline-block;
        width: 400px;
        height: 400px;
    }

    .ve-histogram {
        margin-top: 80px;
        display: inline-block;
        width: 600px !important;
        height: 600px !important;
        * {
            width: 600px !important;
            height: 600px !important;
        }
    }

</style>

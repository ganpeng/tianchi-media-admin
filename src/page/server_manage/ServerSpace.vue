<!--服务器存储空间组件-->
<template>
    <div>
        <div class="content-title">存储空间</div>
        <div class="text-center">
            <v-chart :options="serverData"/>
        </div>
        <div class="text-center">
            <ve-histogram :data="chartData" :settings="chartSettings"></ve-histogram>
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
                serverList: [],
                serverData: {
                    title: {
                        text: '所有存储空间',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['已用空间', '可用空间']
                    },
                    label: {
                        fontSize: 14
                    },
                    series: [
                        {
                            name: '所有存储空间',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            color: ['rgb(0,98,196)', 'rgb(116,194,146)'],
                            data: [
                                {value: 0, name: '已用空间'},
                                {value: 0, name: '可用空间'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                chartData: {
                    columns: ['名称', '已用空间', '可用空间', '预留空间'],
                    rows: [
                        {'名称': '1/1', '已用空间': 1393, '可用空间': 1093, '预留空间': 2000},
                        {'名称': '1/2', '已用空间': 3530, '可用空间': 3230, '预留空间': 0.26},
                        {'名称': '1/3', '已用空间': 2923, '可用空间': 2623, '预留空间': 0.76},
                        {'名称': '1/4', '已用空间': 1723, '可用空间': 1423, '预留空间': 0.49},
                        {'名称': '1/5', '已用空间': 3792, '可用空间': 3492, '预留空间': 0.323},
                        {'名称': '1/6', '已用空间': 4593, '可用空间': 4293, '预留空间': 0.78}
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
                        this.serverList = response.data.serverResourcesVoList;
                        this.serverData.series[0].data[0].value = response.data.used;
                        this.serverData.series[0].data[1].value = response.data.free;
                    }
                });
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
        background-color: white;
        display: inline-block;
        width: 600px !important;
        height: 400px;
        * {
            width: 600px !important;
            height: 400px;
        }
    }

</style>

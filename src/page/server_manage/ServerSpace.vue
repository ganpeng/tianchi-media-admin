<!--服务器存储空间组件-->
<template>
    <div>
        <div class="content-title">存储空间</div>
        <div class="text-center">
            <v-chart :options="serverData"/>
        </div>
        <el-table
            :data="serverList"
            border
            style="width: 100%">
            <el-table-column
                type="index"
                align="center"
                width="80"
                label="序号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="clusterName"
                min-width="120px"
                label="组">
            </el-table-column>
            <el-table-column
                min-width="120px"
                prop="hostname"
                align="center"
                label="服务器">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="value.total"
                label="全部空间">
                <template slot-scope="scope">
                    {{(scope.row.value ? scope.row.value.total : 0) | convertFileSize}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="value.used"
                min-width="140px"
                label="已使用空间">
                <template slot-scope="scope">
                    {{(scope.row.value ? scope.row.value.used : 0) | convertFileSize}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="value.free"
                min-width="130px"
                label="未使用空间">
                <template slot-scope="scope">
                    {{(scope.row.value ? scope.row.value.free : 0) | convertFileSize}}
                </template>
            </el-table-column>
        </el-table>
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

</style>

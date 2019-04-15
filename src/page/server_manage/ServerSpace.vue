<!--服务器存储空间组件-->
<template>
    <div>
        <div class="content-title">存储空间</div>
        <v-chart :options="serverData"/>
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
                prop="groupName"
                min-width="220px"
                label="组">
            </el-table-column>
            <el-table-column
                min-width="60px"
                prop="serverNo"
                align="center"
                label="服务器">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="totalSpace"
                label="全部空间">
            </el-table-column>
            <el-table-column
                align="center"
                prop="usedSpace"
                min-width="140px"
                label="已使用空间">
            </el-table-column>
            <el-table-column
                align="center"
                prop="unusedSpace"
                min-width="130px"
                label="未使用空间">
            </el-table-column>
            <el-table-column
                align="center"
                prop="reservedSpace"
                min-width="130px"
                label="预留空间">
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
            let data = [];
            for (let i = 0; i <= 360; i++) {
                let t = i / 180 * Math.PI;
                let r = Math.sin(2 * t) * Math.cos(2 * t);
                data.push([r, i]);
            }
            return {
                serverList: [
                    {
                        groupName: 'Group1',
                        serverNo: '01',
                        totalSpace: '1024GB',
                        usedSpace: '1000GB',
                        unusedSpace: '12GB',
                        reservedSpace: '12GB'
                    },
                    {
                        groupName: 'Group1',
                        serverNo: '01',
                        totalSpace: '1024GB',
                        usedSpace: '1000GB',
                        unusedSpace: '12GB',
                        reservedSpace: '12GB'
                    },
                    {
                        groupName: 'Group1',
                        serverNo: '01',
                        totalSpace: '1024GB',
                        usedSpace: '1000GB',
                        unusedSpace: '12GB',
                        reservedSpace: '12GB'
                    }
                ],
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
                        data: ['已用空间', '可用空间', '预留空间']
                    },
                    series: [
                        {
                            name: '所有存储空间',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: 4048, name: '已用空间'},
                                {value: 2000, name: '可用空间'},
                                {value: 1000, name: '预留空间'}
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
        methods: {}
    };
</script>

<style scoped lang="less">

    .echarts {
        width: 400px;
        height: 400px;
    }

</style>

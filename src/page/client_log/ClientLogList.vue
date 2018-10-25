<template>
    <div class="client-log-container">
        <h2 class="content-title">客户端日志</h2>
        <el-table
            row-class-name=''
            :header-row-class-name='"common-table-header"'
            class="my-table-style" :data="[]" border>
            <el-table-column align="center" label="时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="系统名称">
                <template slot-scope="scope">
                    {{scope.row.apkName | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="系统版本">
                <template slot-scope="scope">
                    {{scope.row.apkVersion | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="Code">
                <template slot-scope="scope">
                    {{scope.row.apkVersionCode | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="错误类型">
                <template slot-scope="scope">
                    {{scope.row.errorType | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="MAC网卡地址">
                <template slot-scope="scope">
                    {{scope.row.mac | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备序列号">
                <template slot-scope="scope">
                    {{scope.row.no | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="SDK版本号">
                <template slot-scope="scope">
                    {{scope.row.sdkVersion | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备ID">
                <template slot-scope="scope">
                    {{scope.row.stbId | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="型号">
                <template slot-scope="scope">
                    {{scope.row.model | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" label="操作">
                <template slot-scope="scope">
                    <div class="btn-wrapper">
                        <el-button class="text-success" type="text" size="small" @click="display(scope.row.id)">详情</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name: 'ClientLogList',
    data() {
        return {};
    },
    methods: {
        display(id) { }
    }
};
</script>
<style lang="scss" scoped>

</style>

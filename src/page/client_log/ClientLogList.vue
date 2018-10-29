<template>
    <div class="client-log-container">
        <h2 class="content-title">客户端日志</h2>
        <el-table
            row-class-name=''
            :header-row-class-name='"common-table-header"'
            class="my-table-style" :data="state.list" border>
            <el-table-column align="center" label="时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
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
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="state.pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="state.pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.pagination.total">
        </el-pagination>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
    name: 'ClientLogList',
    data() {
        return {};
    },
    created() {
        this.getClientErrorLogList();
    },
    computed: {
        ...mapGetters({
            state: 'clientErrorLog/state'
        })
    },
    methods: {
        ...mapMutations({
            updatePagination: 'clientErrorLog/updatePagination'
        }),
        ...mapActions({
            getClientErrorLogList: 'clientErrorLog/getClientErrorLogList'
        }),
        display(id) { },
        handlePaginationChange(value, key) {
            this.updatePagination({key, value});
            this.getClientErrorLogList();
        }
    }
};
</script>
<style lang="scss" scoped>

</style>

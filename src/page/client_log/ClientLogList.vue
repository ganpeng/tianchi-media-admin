<template>
    <div class="client-log-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.keyword"
                            clearable
                            class="border-input"
                            @input="inputHandler($event, 'keyword')"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" icon="el-icon-search" type="primary" plain>搜索</el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">开始时间</label>
                        <el-date-picker
                            :value="searchFields.startedAt"
                            type="date"
                            clearable
                            style="width:180px;"
                            value-format="timestamp"
                            @input="inputHandler($event, 'startedAt')"
                            placeholder="请选择开始时间">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">结束时间</label>
                        <el-date-picker
                            :value="searchFields.endedAt"
                            type="date"
                            clearable
                            style="width:180px;"
                            value-format="timestamp"
                            @input="inputHandler($event, 'endedAt')"
                            placeholder="请选择结束时间">
                        </el-date-picker>
                    </div>
                    <!--
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            :value="searchFields.errorType"
                            @change="inputHandler($event, 'errorType')"
                            clearable
                            placeholder="请选择状态">
                            <el-option
                                v-for="item in visibleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    -->
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">错误日志列表</h2>
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
                    <el-table-column align="center" label="MAC地址">
                        <template slot-scope="scope">
                            {{scope.row.mac | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="设备序列号">
                        <template slot-scope="scope">
                            {{scope.row.no | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="SDK">
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
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="display(scope.row.id)">查看</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="state.pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="state.pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.pagination.total">
        </el-pagination>
        <el-dialog
            title="日志详情"
            class="my-dialog"
            :visible.sync="dialogVisible"
            :show-close="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form label-width="120px">
                <el-form-item label="时间">
                    <p class="info-value">
                        {{errLog.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="系统名称">
                    <p class="info-value">
                        {{errLog.apkName | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="系统版本">
                    <p class="info-value">
                        {{errLog.apkVersion | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="Code">
                    <p class="info-value">
                        {{errLog.apkVersionCode | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="错误类型">
                    <p class="info-value">
                        {{errLog.errorType | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="MAC">
                    <p class="info-value">
                        {{errLog.mac | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <p class="info-value">
                        {{errLog.no | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="SDK">
                    <p class="info-value">
                        {{errLog.sdkVersion | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="设备ID">
                    <p class="info-value">
                        {{errLog.stbId | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="型号">
                    <p class="info-value">
                        {{errLog.model | padEmpty}}
                    </p>
                </el-form-item>
                <el-form-item label="错误内容">
                    <p class="info-value">
                        {{errLog.errorMsg | padEmpty}}
                    </p>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
export default {
    name: 'ClientLogList',
    data() {
        return {
            dialogVisible: false,
            errLog: {}
        };
    },
    created() {
        this.getClientErrorLogList();
    },
    computed: {
        ...mapGetters({
            state: 'clientErrorLog/state',
            searchFields: 'clientErrorLog/searchFields'
        })
    },
    methods: {
        ...mapMutations({
            updatePagination: 'clientErrorLog/updatePagination',
            updateSearchFields: 'clientErrorLog/updateSearchFields',
            resetSearchFields: 'clientErrorLog/resetSearchFields'
        }),
        ...mapActions({
            getClientErrorLogList: 'clientErrorLog/getClientErrorLogList'
        }),
        display(id) {
            let errLog = this.state.list.find((log) => log.id === id);
            this.errLog = errLog;
            this.dialogVisible = true;
        },
        handlePaginationChange(value, key) {
            this.updatePagination({key, value});
            this.getClientErrorLogList();
        },
        inputHandler(value, key) {
            this.updateSearchFields({key, value});
        },
        searchHandler() {
            this.getClientErrorLogList();
        },
        clearSearchFields() {
            this.resetSearchFields();
        }
    }
};
</script>
<style lang="scss" scoped>
.info-value {
    text-align: left;
    word-break: break-all;
}
</style>

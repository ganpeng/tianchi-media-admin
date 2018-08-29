<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'设备管理'},
            {name:'设备列表'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left" @submit.native.prevent>
            <el-col :span="24" class="float-right">
                <el-form-item class="create-account">
                    <el-button
                        class="page-main-btn create-blue-btn contain-svg-icon"
                        @click="addDeviceHandler">
                        <svg-icon icon-class="add"></svg-icon>
                        新增设备
                    </el-button>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="请输入关键字"
                        @input="inputHandler($event, 'keyword')"
                        clearable
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.deviceType"
                        multiple
                        placeholder="请选择设备类型"
                        @input="inputHandler($event, 'deviceType')"
                    >
                        <el-option
                            v-for="(item, index) in []"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.status"
                        multiple
                        placeholder="请选择设备状态"
                        @input="inputHandler($event, 'status')"
                    >
                        <el-option
                            v-for="(item, index) in []"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="value6"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" type="primary" icon="el-icon-search" plain>搜索</el-button>
                    <el-button class="clear-filter page-main-btn clear-btn" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
            <el-table-column align="center" label="序号"></el-table-column>
            <el-table-column align="center" label="CA卡号"></el-table-column>
            <el-table-column align="center" label="设备类型"></el-table-column>
            <el-table-column align="center" label="创建时间"></el-table-column>
            <el-table-column  align="center" label="状态"></el-table-column>
            <el-table-column align="center" width="300px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">禁用</el-button>
                    <el-button class="text-danger" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="deviceDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="hideDeviceDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    export default {
        name: 'DeviceList',
        components: {},
        data() {
            return {
                value6: [],
                deviceDialogVisible: false,
                dialogTitle: ''
            };
        },
        created() {
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'device/list',
                pagination: 'device/pagination',
                searchFields: 'device/searchFields'
            })
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({}),
            clearSearchFields() {},
            keyupHandler(e) {
                if (e.keyCode === 13) {}
            },
            handlePaginationChange(value, key) { },
            inputHandler(value, key) { },
            addDeviceHandler() {},
            showDeviceDialog() {
                this.deviceDialogVisible = true;
            },
            hideDeviceDialog() {
                this.deviceDialogVisible = false;
            }
        }
    };
</script>
<style scoped lang="less">
</style>

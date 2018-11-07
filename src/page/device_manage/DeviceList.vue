<!--视频列表组件-->
<template>
    <div class="device-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.no"
                            placeholder="请输入关键字"
                            @input="inputSearchFieldHandler($event, 'no')"
                            clearable
                            class="border-input">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" icon="el-icon-search" type="primary" plain>搜索</el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="searchFields.hardWareId"
                            placeholder="请选择设备类型"
                            clearable
                            @input="inputSearchFieldHandler($event, 'hardWareId')"
                        >
                            <el-option
                                v-for="(item, index) in hardwareTypeOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            :value="searchFields.status"
                            placeholder="请选择设备状态"
                            clearable
                            @input="inputSearchFieldHandler($event, 'status')"
                        >
                            <el-option
                                v-for="(item, index) in visibleOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">时间</label>
                        <el-date-picker
                            :value="searchFields.registeredAt"
                            type="daterange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'registeredAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
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
                <h2 class="content-title">设备列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left"></div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="addDeviceHandler">
                                <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                    </div>
                </div>
                <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                    <el-table-column width="60" align="center" label="序号">
                        <template slot-scope="scope">
                            {{getIndex(scope.$index)}}
                        </template>
                    </el-table-column>
                    <el-table-column width="150" align="center" label="序列号">
                        <template slot-scope="scope">
                            {{scope.row.no | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="150" align="center" label="ca卡号">
                        <template slot-scope="scope">
                            {{scope.row.caNo | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120" align="center" label="系统标识">
                        <template slot-scope="scope">
                            {{getType(scope.row.hardWareId) | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="120" align="center" label="系统版本">
                        <template slot-scope="scope">
                            {{scope.row.currentVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="固件版本">
                        <template slot-scope="scope">
                            {{scope.row.currentHardVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="140" align="center" label="MAC地址">
                        <template slot-scope="scope">
                            {{scope.row.mac | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="160" label="最后在线时间">
                        <template slot-scope="scope">
                            {{scope.row.lastOnlineTime | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="注册时间">
                        <template slot-scope="scope">
                            {{scope.row.registeredAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="状态">
                        <template slot-scope="scope">
                            <input
                                class="my-switch switch-anim"
                                type="checkbox"
                                :checked="scope.row.status === 'NORMAL'"
                                @click.prevent="toggleStatusHandler(scope.row.id)"/>
                            <i v-if="scope.row.status === 'NORMAL'" class="on-the-shelf">正常</i>
                            <i v-else class="off-the-shelf">禁止</i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="200px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="updateDeviceHandler(scope.row.id)">编辑</span>
                                <span class="btn-text text-danger" @click="deleteDeviceHandler(scope.row.id)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
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
            :before-close="hideDeviceDialog"
            :show-close="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-form :model="device" :rules="deviceRules" ref="deviceForm" class="form-block" label-width="100px">
                <el-form-item label="CA卡号" prop="caNo">
                    <el-input
                        :value="device.caNo"
                        clearable
                        placeholder="请输入设备CA卡号"
                        @input="inputHandler($event, 'caNo')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="hardWareId">
                    <el-select
                        :value="device.hardWareId"
                        clearable
                        placeholder="请选择内容类型"
                        @input="inputHandler($event, 'hardWareId')"
                    >
                        <el-option
                            v-for="item in hardwareTypeOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备状态">
                    <i v-if="status === 0" class="status-normal">正常</i>
                    <span v-else v-html="getStatus(device.status)"></span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="hideDeviceDialog">关闭</el-button>
                <el-button type="primary" size="medium" @click="deviceEnterHandler">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import role from '@/util/config/role';
    export default {
        name: 'DeviceList',
        components: {},
        data() {
            return {
                value6: [],
                status: 0, // 0 是创建，1 是编辑
                deviceDialogVisible: false,
                hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
                dialogTitle: '',
                visibleOptions: [
                    {value: 'NORMAL', name: '正常'}, {value: 'FORBIDDEN', name: '禁用'}
                ],
                deviceRules: {
                    caNo: [
                        { required: true, message: '请输入设备CA卡号' }
                    ],
                    hardWareId: [
                        { required: true, message: '请选择设备类型' }
                    ]
                }
            };
        },
        created() {
            this.getDeviceList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'device/list',
                pagination: 'device/pagination',
                searchFields: 'device/searchFields',
                device: 'device/device'
            }),
            getIndex() {
                return (index) => {
                    let {pageNum, pageSize} = this.pagination;
                    return index + 1 + (pageNum - 1) * pageSize;
                };
            },
            getType() {
                return (type) => {
                    return type ? (type === 'HARDWARE_3796' ? '3796' : '3798') : '------';
                };
            },
            getStatus() {
                return (status) => {
                    let text = status === 'NORMAL' ? '正常' : '禁用';
                    let className = status === 'NORMAL' ? 'status-normal' : 'status-abnormal';
                    return `<i class="${className}">${text}</i>`;
                };
            }
        },
        methods: {
            ...mapMutations({
                updatePagination: 'device/updatePagination',
                updateSearchFields: 'device/updateSearchFields',
                resetSearchFields: 'device/resetSearchFields',
                updateDevice: 'device/updateDevice',
                setDevice: 'device/setDevice',
                setCurrentId: 'device/setCurrentId',
                resetDevice: 'device/resetDevice'
            }),
            ...mapActions({
                addDevice: 'device/addDevice',
                getDeviceList: 'device/getDeviceList',
                updateDeviceById: 'device/updateDeviceById',
                deleteDeviceById: 'device/deleteDeviceById'
            }),
            clearSearchFields() {
                this.resetSearchFields();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {}
            },
            handlePaginationChange(value, key) {
                this.updatePagination({key, value});
                this.getDeviceList();
            },
            inputSearchFieldHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            inputHandler(value, key) {
                this.updateDevice({key, value});
            },
            addDeviceHandler() {
                this.showDeviceDialog();
                this.dialogTitle = '添加设备';
                this.status = 0;
            },
            updateDeviceHandler(id) {
                this.showDeviceDialog();
                let device = this.list.find((device) => device.id === id);
                this.setDevice({device});
                this.setCurrentId({id});
                this.dialogTitle = '编辑设备';
                this.status = 1;
            },
            showDeviceDialog() {
                this.deviceDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.deviceForm.clearValidate();
                });
            },
            hideDeviceDialog() {
                this.deviceDialogVisible = false;
                this.resetDevice();
            },
            searchHandler() {
                this.getDeviceList();
            },
            deviceEnterHandler() {
                this.$refs.deviceForm.validate(valid => {
                    if (valid) {
                        if (this.status) {
                            //  编辑
                            this.updateDeviceById()
                                .then((res) => {
                                    if (res && res.code === 0) {
                                        this.hideDeviceDialog();
                                        this.getDeviceList();
                                        this.$message.success('设备更新成功');
                                    }
                                });
                        } else {
                            //  新增
                            this.addDevice()
                                .then((res) => {
                                    if (res && res.code === 0) {
                                        this.hideDeviceDialog();
                                        this.getDeviceList();
                                        this.$message.success('设备添加成功');
                                    }
                                });
                        }
                    }
                });
            },
            toggleStatusHandler(id) {
                let _device = this.list.find((device) => device.id === id);
                let isForbidden = _device.status !== 'NORMAL';
                this.$confirm(`您确定要${isForbidden ? '恢复设备' : '禁用设备'}吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    let status = _device.status === 'NORMAL' ? 'FORBIDDEN' : 'NORMAL';
                    let device = JSON.parse(JSON.stringify(_device));
                    device.status = status;
                    this.setDevice({device});
                    this.setCurrentId({id});
                    this.updateDeviceById()
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.getDeviceList();
                                this.$message.success('设备更新成功');
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteDeviceHandler(id) {
                this.$confirm(`您确定要删除该设备吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteDeviceById(id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.getDeviceList();
                                this.$message.success('设备删除成功');
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    };
</script>
<style scoped lang="less">
</style>

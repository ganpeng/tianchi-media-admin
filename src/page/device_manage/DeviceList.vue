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
                    <el-button class="btn-style-one" @click="searchHandler" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">时间</label>
                        <el-date-picker
                            :value="searchFields.registeredAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'registeredAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="searchFields.hardWareId"
                            placeholder="全部"
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
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                    <span
                        @click="toggleSearchField"
                        :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                        更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i
                        v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            :value="searchFields.status"
                            placeholder="全部"
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
                    <div class="search-field-item" v-if="false">
                        <label class="search-field-item-label">固件版本</label>
                        <el-select
                            :value="searchFields.status"
                            placeholder="全部"
                            clearable
                            @input="inputSearchFieldHandler($event, 'status')"
                        >
                            <el-option
                                v-for="(item, index) in []"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">所属区域</label>
                        <el-select
                            :value="searchFields.code"
                            placeholder="全部"
                            clearable
                            @input="inputSearchFieldHandler($event, 'code')"
                        >
                            <el-option
                                v-for="(item, index) in filialeList"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">设备列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <sort-item :sortKeyList="sortKeyList" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                    </div>
                    <div class="float-right">
                        <el-button
                            @click="importDevice"
                            class="btn-style-two contain-svg-icon">
                            <svg-icon icon-class="import"></svg-icon>
                            导入
                        </el-button>
                    </div>
                </div>
                <el-table
                    header-row-class-name="common-table-header"
                    class="my-table-style"
                    @sort-change="sortChangeHandler"
                    :data="list" border>
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
                    <el-table-column min-width="120" align="center" label="固件版本">
                        <template slot-scope="scope">
                            {{scope.row.currentHardVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="所属区域">
                        <template slot-scope="scope">
                            {{getDistrictName(scope.row.districtCode) | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="140" align="center" label="MAC地址">
                        <template slot-scope="scope">
                            {{scope.row.mac | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="140" align="center" label="token">
                        <template slot-scope="scope">
                            {{scope.row.mac | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column sortable align="center" min-width="160" prop="registeredAt" label="注册时间">
                        <template slot-scope="scope">
                            {{scope.row.registeredAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column sortable align="center" min-width="160" prop="lastOnlineTime" label="最后在线时间">
                        <template slot-scope="scope">
                            {{scope.row.lastOnlineTime | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <input
                                class="my-switch switch-anim"
                                type="checkbox"
                                :checked="scope.row.status === 'NORMAL'"
                                @click.prevent="toggleStatusHandler(scope.row.id)"/>
                            <i v-if="scope.row.status === 'NORMAL'" class="on-the-shelf">正常</i>
                            <i v-else class="off-the-shelf">禁用</i>
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
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import _ from 'lodash';
    import role from '@/util/config/role';
    import SortItem from 'sysComponents/custom_components/custom/SortItem';
    export default {
        name: 'DeviceList',
        components: {SortItem},
        data() {
            return {
                searchFieldVisible: false,
                status: 0, // 0 是创建，1 是编辑
                hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
                visibleOptions: [
                    {value: 'NORMAL', name: '正常'}, {value: 'FORBIDDEN', name: '禁用'}
                ],
                sortKeyList: [
                    {
                        label: '注册时间',
                        value: 'REGISTERED_AT'
                    },
                    {
                        label: '最后在线时间',
                        value: 'LAST_ONLINE_TIME'
                    }
                ]
            };
        },
        created() {
            if (!this.$authority.isHasAuthority('user:stb:page')) {
                return;
            }
            this.getDeviceList();
            this.getFilialeList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'device/list',
                filialeList: 'channel/filialeList',
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
                    return type || '------';
                };
            },
            getDistrictName() {
                return (districtCode) => {
                    if (_.isNil(districtCode)) {
                        return '';
                    } else {
                        let district = this.filialeList.find((item) => parseInt(item.code) === parseInt(districtCode));
                        return _.get(district, 'name');
                    }
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
                deleteDeviceById: 'device/deleteDeviceById',
                getFilialeList: 'channel/getFilialeList'
            }),
            importDevice() {
                let routeData = this.$router.resolve({
                    name: 'DeviceImport'
                });
                window.open(routeData.href, '_blank');
            },
            clearSearchFields() {
                if (!this.$authority.isHasAuthority('user:stb:page')) {
                    return;
                }
                this.resetSearchFields();
                this.searchHandler();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                }
            },
            handlePaginationChange(value, key) {
                if (!this.$authority.isHasAuthority('user:stb:page')) {
                    return;
                }
                this.updatePagination({key, value});
                this.getDeviceList();
            },
            inputSearchFieldHandler(value, key) {
                if (!this.$authority.isHasAuthority('user:stb:page')) {
                    return;
                }
                this.updateSearchFields({key, value});
                if (key !== 'no') {
                    this.getDeviceList();
                }
            },
            searchHandler() {
                if (!this.$authority.isHasAuthority('user:stb:page')) {
                    return;
                }
                this.getDeviceList();
            },
            createDevice() {
                if (!this.$authority.isHasAuthority('user:stb:page')) {
                    return;
                }
                this.$router.push({name: 'CreateDevice'});
            },
            editDevice(id) {
                // this.$router.push({name: 'EditDevice', params: {id}});
            },
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            },
            toggleStatusHandler(id) {
                if (!this.$authority.isHasAuthority('user:stb:visible')) {
                    return;
                }
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
                });
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'registeredAt') {
                    let sortedListByCreatedAt = [];
                    if (order === 'ascending') {
                        sortedListByCreatedAt = _.chain(this.list).sortBy('registeredAt').value();
                    } else {
                        sortedListByCreatedAt = _.chain(this.list).sortBy('registeredAt').reverse().value();
                    }
                    this.setList({list: sortedListByCreatedAt});
                }
                if (prop === 'lastOnlineTime') {
                    let sortedListByCreatedAt = [];
                    if (order === 'ascending') {
                        sortedListByCreatedAt = _.chain(this.list).sortBy('lastOnlineTime').value();
                    } else {
                        sortedListByCreatedAt = _.chain(this.list).sortBy('lastOnlineTime').reverse().value();
                    }
                    this.setList({list: sortedListByCreatedAt});
                }
            },
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.updateSearchFields({key: 'sortKey', value: sortKey});
                this.updateSearchFields({key: 'sortDirection', value: sortDirection});
                this.searchHandler();
            }
        }
    };
</script>
<style scoped lang="less">
</style>

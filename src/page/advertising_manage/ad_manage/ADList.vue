<!--广告管理-广告列表（包含开机、屏保、音量条、详情页广告）组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <div class="subject-search-container">
            <div @keyup.enter="getADList" class="text-left filters-container">
                <el-form :inline="true" class="filter-form">
                    <el-form-item>
                        <el-input
                            v-model="listQueryParams.keyword"
                            clearable
                            @change="getADList(true)"
                            class="border-input"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="btn-style-one"
                            @click="getADList(false)"
                            type="primary">
                            <svg-icon icon-class="search"></svg-icon>
                            搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select
                            v-model="listQueryParams.adType"
                            @change="getADList(true)"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in adTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上下架">
                        <el-select
                            v-model="listQueryParams.visible"
                            @change="getADList(true)"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in visibleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select
                            v-model="listQueryParams.adStatus"
                            @change="getADList(true)"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            class="btn-style-one"
                            @click="clearFilters"
                            type="primary">
                            <svg-icon icon-class="reset"></svg-icon>
                            重置
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="text"
                            @click="moreFilters = !moreFilters"
                            class="more-filters"
                            :class="{active:moreFilters}">
                            更多筛选
                            <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                            <i class="el-icon-arrow-down" v-else></i>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
                    <el-form-item label="资源类型">
                        <el-select
                            v-model="listQueryParams.mediaType"
                            @change="getADList(true)"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in mediaTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="createRangeTime"
                            @change="getADList(true)"
                            type="daterange"
                            clearable
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="table-field">
            <h2 class="content-title">广告列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left"></div>
                <div class="float-right">
                    <el-dropdown @command="createAD($event)" placement="bottom">
                        <el-button class="btn-style-two contain-svg-icon">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                            <svg-icon icon-class="arrow_down"></svg-icon>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="BOOT_AD">开机广告</el-dropdown-item>
                            <el-dropdown-item command="PREPOSITION_AD">片头广告</el-dropdown-item>
                            <el-dropdown-item command="VOLUME_AD">音量条广告</el-dropdown-item>
                            <el-dropdown-item command="CHANNEL_SWITCH_AD">换台广告</el-dropdown-item>
                            <el-dropdown-item command="SCREEN_SAVER_AD">屏保广告</el-dropdown-item>
                            <el-dropdown-item command="PROGRAMME_DETAIL_AD">详情页广告</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <el-table
            header-row-class-name="common-table-header"
            :data="adList"
            border
            @sort-change=sortADList
            row-class-name=product-row
            style="width: 100%">
            <el-table-column
                align="center"
                prop="id"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="名称">
                <template slot-scope="scope">
                    <span @click="checkADDetail(scope.row)" class="ellipsis four name">
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adType"
                label="类型">
                <template slot-scope="scope">
                    <label>{{scope.row.adType | getCategoryName}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adMaterialList"
                label="广告主">
                <template slot-scope="scope">
                    <label>{{scope.row.advertiserList | jsonJoin('name')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adMaterialList"
                label="资源个数">
                <template slot-scope="scope">
                    <label>{{scope.row.adMaterialCount}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adMaterialSize"
                label="资源体积">
                <template slot-scope="scope">
                    <label>{{scope.row.adMaterialSize | convertFileSize}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="expiryDate"
                min-width="120px"
                label="有效期">
                <template slot-scope="scope">
                    <div>{{scope.row.applyDateBegin | formatDate('yyyy-MM-DD HH:mm:SS')}}</div>
                    <div>{{scope.row.applyDateEnd | formatDate('yyyy-MM-DD HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.adStatus === 'ACTIVE' && scope.row.visible"
                          class="status-normal">生效</span>
                    <span v-if="scope.row.adStatus === 'WAITING' && scope.row.visible"
                          class="status-deleting">未生效</span>
                    <span v-if="scope.row.adStatus === 'EXPIRED' && scope.row.visible"
                          class="status-abnormal">已失效</span>
                    <span v-if="!scope.row.visible">/</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="上下架">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        :class="{'disabled':(!scope.row.visible || scope.row.visible && scope.row.adStatus === 'EXPIRED')}"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateProductStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf shelf"
                       :class="{'disabled':(!scope.row.visible || scope.row.visible && scope.row.adStatus === 'EXPIRED')}">已上架</i>
                    <i v-else class="off-the-shelf shelf"
                       :class="{'disabled':(!scope.row.visible || scope.row.visible && scope.row.adStatus === 'EXPIRED')}">已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="updatedAt"
                sortable="custom"
                min-width="100px"
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:mm')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="createdAt"
                sortable="custom"
                min-width="100px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="120px"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span
                            class="btn-text"
                            :class="{disabled:scope.row.adStatus === 'EXPIRED' || !scope.row.visible}"
                            @click="editADInfo(scope.row)">
                            编辑
                        </span>
                        <span
                            class="btn-text text-danger"
                            :class="{disabled:scope.row.adStatus !== 'WAITING'}"
                            @click="removeAD(scope.row)">
                            删除
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
    </div>
</template>

<script>

    export default {
        name: 'ADList',
        data() {
            return {
                moreFilters: false,
                listQueryParams: {
                    keyword: '',
                    adType: '',
                    adStatus: '',
                    mediaType: '',
                    createdAtStart: '',
                    createdAtEnd: '',
                    visible: '',
                    pageNum: 1,
                    pageSize: 10,
                    order: 'UPDATED_AT_DESC'
                },
                createRangeTime: [],
                adTypeOptions: [
                    {value: 'BOOT', label: '开机广告'},
                    {value: 'PREPOSITION', label: '片头广告'},
                    {value: 'VOLUME', label: '音量条广告'},
                    {value: 'PROGRAMME_DETAIL', label: '详情页广告'},
                    {value: 'CHANNEL_SWITCH', label: '换台广告'},
                    {value: 'SCREEN_SAVER', label: '屏保广告'}
                ],
                mediaTypeOptions: [
                    {value: 'VIDEO', label: '视频'},
                    {value: 'IMAGE', label: '图片'}
                ],
                statusOptions: [
                    {value: 'ACTIVE', label: '生效'},
                    {value: 'WAITING', label: '未生效'},
                    {value: 'EXPIRED', label: '已失效'}
                ],
                visibleOptions: [
                    {value: true, label: '已上架'},
                    {value: false, label: '已下架'}
                ],
                totalAmount: 0,
                adList: []
            };
        },
        filters: {
            getCategoryName: function (category) {
                switch (category) {
                    case 'BOOT':
                        return '开机广告';
                    case 'PREPOSITION':
                        return '片头广告';
                    case 'PROGRAMME_DETAIL':
                        return '详情页广告';
                    case 'SCREEN_SAVER':
                        return '屏保广告';
                    case 'VOLUME':
                        return '音量条广告';
                    case 'CHANNEL_SWITCH':
                        return '换台广告';
                    default:
                        break;
                }
            }
        },
        mounted() {
            this.getADList();
        },
        methods: {
            getADList(isReset) {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtStart = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$service.getADList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.adList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            // 对列表进行排序
            sortADList(column) {
                if (column.prop === 'createdAt') {
                    this.listQueryParams.order = column.order === 'ascending' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
                } else if (column.prop === 'updatedAt') {
                    this.listQueryParams.order = column.order === 'ascending' ? 'UPDATED_AT_ASC' : 'UPDATED_AT_DESC';
                } else {
                    this.listQueryParams.order = 'ID_ASC';
                }
                if (this.listQueryParams.pageNum === 1) {
                    this.getADList();
                } else {
                    this.listQueryParams.pageNum = 1;
                }
            },
            editADInfo(item) {
                let routeName = '';
                switch (item.adType) {
                    case 'PROGRAMME_DETAIL':
                        routeName = 'EditProgrammeDetailAD';
                        break;
                    case 'VOLUME':
                        routeName = 'EditVolumeAD';
                        break;
                    case 'SCREEN_SAVER':
                        routeName = 'EditScreenSaverAD';
                        break;
                    case 'BOOT':
                        routeName = 'EditBootAD';
                        break;
                    case 'PREPOSITION':
                        routeName = 'EditPrepositionAD';
                        break;
                    case 'CHANNEL_SWITCH':
                        routeName = 'EditChannelSwitchAD';
                        break;
                    default:
                        break;
                }
                this.$router.push({name: routeName, params: {id: item.id}});
            },
            clearFilters() {
                this.listQueryParams.keyword = '';
                this.listQueryParams.adType = '';
                this.listQueryParams.adStatus = '';
                this.listQueryParams.mediaType = '';
                this.listQueryParams.createdAtStart = '';
                this.listQueryParams.createdAtEnd = '';
                this.listQueryParams.visible = '';
                this.createRangeTime = [];
                this.getADList(true);
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getADList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getADList();
            },
            // 查询广告详情
            checkADDetail(item) {
                this.$router.push({name: 'ADDetail', params: {id: item.id}});
            },
            // 未生效的广告可以删除
            removeAD(item) {
                this.$confirm('此操作将删除' + item.name + '广告, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteAD(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '广告删除成功!');
                            this.getADList();
                        }
                    });
                });
            },
            // 设置产品包的上下架
            updateProductStatus(item) {
                if (!item.visible) {
                    this.$message.warning('已下架的广告不能再次上架');
                    return;
                }
                if (item.adStatus === 'EXPIRED') {
                    this.$message.warning('已失效的广告不能进行下架操作');
                    return;
                }
                this.$confirm('此操作将' + (item.visible ? '下架该广告' : '上架该广告') + ', 下架的广告不能再次上架，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    this.$service.setADVisible(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success(item.name + '广告' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            // 创建广告
            createAD(command) {
                switch (command) {
                    case 'BOOT_AD':
                        this.$router.push({name: 'CreateBootAD'});
                        break;
                    case 'PREPOSITION_AD':
                        this.$router.push({name: 'CreatePrepositionAD'});
                        break;
                    case 'SCREEN_SAVER_AD':
                        this.$router.push({name: 'CreateScreenSaverAD'});
                        break;
                    case 'VOLUME_AD':
                        this.$router.push({name: 'CreateVolumeAD'});
                        break;
                    case 'PROGRAMME_DETAIL_AD':
                        this.$router.push({name: 'CreateProgrammeDetailAD'});
                        break;
                    case 'CHANNEL_SWITCH_AD':
                        this.$router.push({name: 'CreateChannelSwitchAD'});
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .subject-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }

        // 按钮
        .more-filters {
            font-size: 12px;
            color: #6F7480;
            &.active {
                color: #1989FA;
                i {
                    color: #6F7480;
                }
            }
            i {
                margin-left: 8px;
            }
        }

        .more-filter-box {
            background: #252C3D;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

    .el-pagination {
        margin-top: 10px;
    }

    .svg-icon-arrow_down {
        margin-left: 5px;
        height: 10px !important;
        width: 10px !important;
    }

    .shelf {
        &.disabled {
            opacity: 0.3;
        }
    }

</style>

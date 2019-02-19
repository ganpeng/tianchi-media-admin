<!--广告管理-广告列表（包含开机、屏保、音量条、详情页广告）组件-->
<template>
    <div>
        <div class="table-container">
            <div class="content-title">搜索筛选</div>
            <div class="search-field">
                <div class="field-row" @keyup.enter="getADList">
                    <div class="search-field-item">
                        <el-input
                            v-model="listQueryParams.keyword"
                            clearable
                            @change="getADList(true)"
                            class="border-input"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button
                        class="btn-style-one"
                        @click="getADList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">创建时间</label>
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
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">广告类型</label>
                        <el-select
                            v-model="listQueryParams.adCategory"
                            @change="getADList(true)"
                            clearable
                            placeholder="请选择广告类型">
                            <el-option
                                v-for="item in adCategoryOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">资源类型</label>
                        <el-select
                            v-model="listQueryParams.resourceCategory"
                            @change="getADList(true)"
                            clearable
                            placeholder="请选择资源类型">
                            <el-option
                                v-for="item in resourceCategoryOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            v-model="listQueryParams.status"
                            @change="getADList(true)"
                            clearable
                            placeholder="请选择状态">
                            <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button
                        class="btn-style-one"
                        type="primary"
                        @click="clearFilters">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
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
                                <el-dropdown-item command="POWER_ON_AD">开机广告</el-dropdown-item>
                                <el-dropdown-item command="VOLUME_AD">音量条广告</el-dropdown-item>
                                <el-dropdown-item command="SWITCH_CHANNEL_AD">换台广告</el-dropdown-item>
                                <el-dropdown-item command="SCREEN_SAVER_AD">屏保广告</el-dropdown-item>
                                <el-dropdown-item command="DEATIL_AD">详情页广告</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
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
                prop="code"
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
                prop="category"
                label="类型">
                <template slot-scope="scope">
                    <label>{{scope.row.category | getCategoryName}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adOwner"
                label="广告主">
                <template slot-scope="scope">
                    <label>{{scope.row.adOwner}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="resourceCount"
                label="资源个数">
                <template slot-scope="scope">
                    <label>{{scope.row.resourceCount}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="expiryDate"
                label="有效期">
                <template slot-scope="scope">
                    <label>{{scope.row.expiryDate}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="resourceSize"
                label="资源体积">
                <template slot-scope="scope">
                    <label>{{scope.row.resourceSize}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="updatedAt"
                sortable="custom"
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:mm')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="createdAt"
                sortable="custom"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateProductStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                    <i v-else class="off-the-shelf">已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="120px"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editADInfo(scope.row)">编辑</span>
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
                listQueryParams: {
                    keyword: '',
                    adCategory: '',
                    resourceCategory: '',
                    createdAtStart: '',
                    createdAtEnd: '',
                    pageNum: 1,
                    pageSize: 10,
                    orderList: 'ID_DESC'
                },
                createRangeTime: [],
                adCategoryOptions: [
                    {value: 'POWER_ON_AD', label: '开机广告'},
                    {value: 'VOLUME_AD', label: '音量条广告'},
                    {value: 'DETAIL_AD', label: '详情页广告'},
                    {value: 'SWITCH_CHANNEL_AD', label: '换台广告'},
                    {value: 'SCREEN_SAVER_AD', label: '屏保广告'}
                ],
                resourceCategoryOptions: [
                    {value: 'VIDEO', label: '视频'},
                    {value: 'PICTURE', label: '图片'}
                ],
                statusOptions: [
                    {value: 'UN_PUBLISHED', label: '未发布'},
                    {value: 'GO_EFFECT', label: '生效'},
                    {value: 'LOSE_EFFECT', label: '失效'},
                    {value: 'UN_SHELEVED', label: '已下架'},
                ],
                totalAmount: 0,
                adList: []
            };
        },
        filters: {
            getCategoryName: function (category) {
                switch (category) {
                    case 'POWER_ON_AD':
                        return '开机广告';
                    case 'DETAIL_AD':
                        return '详情页广告';
                    case 'SCREEN_SAVER_AD':
                        return '屏保广告';
                    case 'VOLUME_AD':
                        return '音量条广告';
                    case 'SWITCH_CHANNEL_AD':
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
                    this.listQueryParams.orderList = column.order === 'ascending' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
                } else if (column.prop === 'updatedAt') {
                    this.listQueryParams.orderList = column.order === 'ascending' ? 'UPDATED_AT_ASC' : 'UPDATED_AT_DESC';
                } else {
                    this.listQueryParams.orderList = 'ID_ASC';
                }
                if (this.listQueryParams.pageNum === 1) {
                    this.getADList();
                } else {
                    this.listQueryParams.pageNum = 1;
                }
            },
            editADInfo(item) {
                let routeName = '';
                switch (item.category) {
                    case 'PROGRAMME_CATEGORY':
                        routeName = 'EditCategoryProduct';
                        break;
                    case 'PROGRAMME':
                        routeName = 'EditProgrammeProduct';
                        break;
                    case 'CAROUSEL':
                        routeName = 'EditCarouselProduct';
                        break;
                    case 'RECORD':
                        routeName = 'EditRecordProduct';
                        break;
                    default:
                        break;
                }
                this.$router.push({name: routeName, params: {id: item.id}});
            },
            clearFilters() {
                this.listQueryParams.keyword = '';
                this.listQueryParams.adCategory = '';
                this.listQueryParams.resourceCategory = '';
                this.listQueryParams.createdAtStart = '';
                this.listQueryParams.createdAtEnd = '';
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
            // 查询产品详情
            checkADDetail(item) {
                let routeName = '';
                switch (item.category) {
                    case 'PROGRAMME_CATEGORY':
                        routeName = 'CategoryProductDetail';
                        break;
                    case 'PROGRAMME':
                        routeName = 'ProgrammeProductDetail';
                        break;
                    case 'CAROUSEL':
                        routeName = 'CarouselProductDetail';
                        break;
                    case 'RECORD':
                        routeName = 'RecordProductDetail';
                        break;
                    default:
                        break;
                }
                this.$router.push({name: routeName, params: {id: item.id}});
            },
            // 设置产品包的上下架
            updateProductStatus(item) {
                this.$confirm('此操作将' + (item.visible ? '下架该产品包' : '上架该产品包') + ', 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    this.$service.setProductVisible({id: item.id}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success(item.name + '产品包' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (item.visible ? '下架' : '上架' + item.name + '产品包')
                    });
                });
            },
            // 创建产品包
            createAD(command) {
                switch (command) {
                    case 'POWER_ON_AD':
                        this.$router.push({name: 'CreatePowerOnAD'});
                        break;
                    case 'SCREEN_SAVER_AD':
                        this.$router.push({name: 'CreateScreenSaverAD'});
                        break;
                    case 'VOLUME_AD':
                        this.$router.push({name: 'CreateVolumeAD'});
                        break;
                    case 'DETAIL_AD':
                        this.$router.push({name: 'CreateDetailAD'});
                        break;
                    case 'SWITCH_CHANNEL_AD':
                        this.$router.push({name: 'CreateSwitchChannelAD'});
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

    .svg-icon-arrow_down {
        margin-left: 5px;
        height: 10px !important;
        width: 10px !important;
    }

</style>

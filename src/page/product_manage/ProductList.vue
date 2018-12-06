<!--产品管理-产品包列表（包含类别包、节目包、轮播频道包、直播回看包）组件-->
<template>
    <div>
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row" @keyup.enter="getProductList">
                    <div class="search-field-item">
                        <el-input
                            v-model="listQueryParams.keyword"
                            @change="getProductList"
                            clearable
                            class="border-input"
                            placeholder="填写产品包编号、名称">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="getProductList" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">时间</label>
                        <el-date-picker
                            v-model="createRangeTime"
                            @change="getProductList"
                            type="daterange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            v-model="listQueryParams.productCategory"
                            @change="getProductList"
                            clearable
                            placeholder="请选择产品包类型">
                            <el-option
                                v-for="item in categoryOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearFilters" plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">产品列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                    </div>
                    <div class="float-right">
                        <el-dropdown
                            @command="createProduct($event)" placement="bottom">
                            <el-button class="btn-style-two contain-svg-icon">
                                <svg-icon icon-class="add"></svg-icon>
                                添加
                                <svg-icon icon-class="arrow_down"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME_CATEGORY">创建类别包</el-dropdown-item>
                                <el-dropdown-item command="PROGRAMME">创建节目包</el-dropdown-item>
                                <el-dropdown-item command="CAROUSEL">创建轮播频道包</el-dropdown-item>
                                <el-dropdown-item command="RECORD">创建直播回看包</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <el-table
            header-row-class-name="common-table-header"
            :data="productList"
            border
            @sort-change=sortProductList
            row-class-name=product-row
            style="width: 100%">
            <el-table-column
                align="center"
                prop="aaaCode"
                width="120px"
                sortable='custom'
                label="编号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="名称">
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
                label="状态">
                <template slot-scope="scope">
                    <i class="status-normal" v-if="scope.row.visible">已上架</i>
                    <i class="status-abnormal" v-else>已下架</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="120px"
                class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="detail-btn" @click="checkProductDetail(scope.row)">
                        查看
                    </el-button>
                    <el-button type="text" size="small" class="detail-btn" @click="editProductInfo(scope.row)">
                        编辑
                    </el-button>
                    <el-button type="text" size="small" @click="setProductVisible(scope.row)">
                        {{scope.row.visible ? '下架' : '上架'}}
                    </el-button>
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
        name: 'ProductList',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    productCategory: '',
                    createdAtStart: '',
                    createdAtEnd: '',
                    pageNum: 1,
                    pageSize: 10,
                    orderList: 'ID_DESC'
                },
                createRangeTime: [],
                categoryOptions: [
                    {value: 'PROGRAMME_CATEGORY', label: '类别包'},
                    {value: 'PROGRAMME', label: '节目包'},
                    {value: 'CAROUSEL', label: '轮播频道包'},
                    {value: 'RECORD', label: '直播回看包'}
                ],
                totalAmount: 0,
                productList: []
            };
        },
        filters: {
            getCategoryName: function (category) {
                switch (category) {
                    case 'PROGRAMME_CATEGORY':
                        return '类别包';
                    case 'PROGRAMME':
                        return '节目包';
                    case 'CAROUSEL':
                        return '轮播频道包';
                    case 'RECORD':
                        return '直播回看包';
                    default:
                        break;
                }
            }
        },
        mounted() {
            this.getProductList();
        },
        methods: {
            getProductList() {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtStart = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$service.getProductList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.productList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            // 对列表进行排序
            sortProductList(column) {
                if (column.prop === 'aaaCode') {
                    this.listQueryParams.orderList = column.order === 'ascending' ? 'ID_ASC' : 'ID_DESC';
                } else if (column.prop === 'createdAt') {
                    this.listQueryParams.orderList = column.order === 'ascending' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
                } else if (column.prop === 'updatedAt') {
                    this.listQueryParams.orderList = column.order === 'ascending' ? 'UPDATED_AT_ASC' : 'UPDATED_AT_DESC';
                } else {
                    this.listQueryParams.orderList = 'ID_ASC';
                }
                if (this.listQueryParams.pageNum === 1) {
                    this.getProductList();
                } else {
                    this.listQueryParams.pageNum = 1;
                }
            },
            editProductInfo(item) {
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
                this.listQueryParams.productCategory = '';
                this.listQueryParams.createdAtStart = '';
                this.listQueryParams.createdAtEnd = '';
                this.createRangeTime = [];
                this.getProductList();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProductList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getProductList();
            },
            // 查询产品详情
            checkProductDetail(item) {
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
            setProductVisible(item) {
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
            createProduct(command) {
                switch (command) {
                    case 'PROGRAMME_CATEGORY':
                        this.$router.push({name: 'CreateCategoryProduct'});
                        break;
                    case 'PROGRAMME':
                        this.$router.push({name: 'CreateProgrammeProduct'});
                        break;
                    case 'CAROUSEL':
                        this.$router.push({name: 'CreateCarouselProduct'});
                        break;
                    case 'RECORD':
                        this.$router.push({name: 'CreateRecordProduct'});
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

</style>

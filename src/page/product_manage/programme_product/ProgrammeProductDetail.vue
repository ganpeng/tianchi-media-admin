<!--节目包详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'节目包详情'}]">
        </custom-breadcrumb>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">节目包信息</h3>
            <el-card>
                <ul>
                    <li><span>产品包类别</span><label>类别包</label></li>
                    <li><span>产品包名称</span><label>{{productInfo.name}}</label></li>
                    <li><span>产品包简介</span><label>{{productInfo.description}}</label></li>
                    <li>
                        <span>产品包状态</span>
                        <label>
                            <i class="status-normal" v-if="productInfo.visible">已上架</i>
                            <i class="status-abnormal" v-else>已下架</i>
                        </label>
                    </li>
                </ul>
            </el-card>
            <div class="vice-block">
                <h3 class="block-vice-title">产品包内节目列表</h3>
                <programme-product-operate-table
                    :programmeList="programmeList">
                </programme-product-operate-table>
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
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editInfo">编辑信息</el-button>
                <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import ProgrammeProductOperateTable from './ProgrammeProductOperateTable';

    export default {
        name: 'ProgrammeProductDetail',
        components: {
            ProgrammeProductOperateTable
        },
        data() {
            return {
                productInfo: {
                    name: '',
                    description: '',
                    visible: true
                },
                programmeList: [],
                listQueryParams: {
                    id: this.$route.params.id,
                    pageSize: 10,
                    pageNum: 1
                },
                totalAmount: 0
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.productInfo = response.data;
                    }
                });
                this.getProductContentList();
            },
            getProductContentList() {
                this.$service.getProgrammeProductContentList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProductContentList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getProductContentList();
            },
            editInfo() {
                this.$router.push({
                    name: 'EditProgrammeProduct', params: this.$route.params
                });
            },
            toProductList() {
                this.$router.push({name: 'ProductList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    #basic-info {
        position: relative;
        padding-top: 80px;
        .el-card {
            width: 600px;
            ul {
                li {
                    display: flex;
                    margin-bottom: 10px;
                    min-height: 32px;
                    flex-direction: row;
                    justify-content: left;
                    align-items: center;
                    > span {
                        width: 120px;
                        flex-shrink: 0;
                        text-align: center;
                        font-size: $largerFontSize;
                        color: $baseGray;
                    }
                    label {
                        width: 380px;
                        font-size: $normalFontSize;
                        color: #909399;
                        flex-shrink: 0;
                        line-height: 2;
                        .el-tag {
                            border: none;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
        .el-table {
            margin: 0px;
            .remove-btn {
                color: $baseRed;
            }
            img {
                width: 70px;
            }
        }
        #operate-list {
            position: absolute;
            right: 0px;
            top: 10px;
        }
    }

</style>

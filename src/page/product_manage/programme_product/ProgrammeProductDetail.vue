<!--节目包详情组件-->
<template>
    <div>
        <div class="content-title">产品包详情</div>
        <!--产品包题目-->
        <div class="detail-title-block">
            <div class="product-status shelve" v-if="productInfo.visible">已上架</div>
            <div class="product-status un-shelve" v-else>已下架</div>
            <div class="title">
                <label>{{productInfo.name}}</label>
                <span>节目包</span>
            </div>
            <div class="product-time">
                <div>创建于{{productInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{productInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-product">
            <div>
                <p>产品包简介</p>
                <span>{{productInfo.description}}</span>
            </div>
        </div>
        <div class="seperator-line"></div>
        <!--节目列表-->
        <div class="content-sub-title">产品包内节目列表</div>
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
        <!--操作-->
        <div class="operate-block">
            <el-button type="primary" class="btn-style-two" @click="editInfo">编辑</el-button>
            <el-button type="primary" plain class="btn-style-three" @click="toProductList">返回列表</el-button>
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

    // 题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .product-status {
            float: left;
            margin-left: 30px;
            margin-right: 40px;
            margin-top: 9px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            border-radius: 4px;
            font-size: 20px;
            text-align: center;
            &.un-shelve {
                color: #6F7480;
                background: #2A3040;
            }
            &.shelve {
                color: #fff;
                background: #3AC26F;
            }
        }

        .title {
            float: left;
            label {
                font-size: 20px;
                color: #FFFFFF;
            }
            span {
                display: inline-block;
                margin-top: 9px;
                margin-left: 20px;
                padding: 2px 10px;
                line-height: 30px;
                background: #D27B25;
                border-radius: 4px;
                font-size: 20px;
                color: #FFFFFF;
            }
        }
        .product-time {
            float: right;
            margin-left: 350px;
            margin-right: 20px;
            div {
                height: 17px;
                line-height: 17px;
                &:first-child {
                    margin-top: 6px;
                    margin-bottom: 3px;
                }
            }
        }
    }

    // 相关信息
    .about-product {
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        div {
            margin-left: 155px;
            height: 100px;
            border-top: 1px solid #252D3F;
            ul {
                margin-top: 10px;
                height: 40px;
                li {
                    float: left;
                    margin-right: 10px;
                    padding: 0px 5px;
                    height: 20px;
                    line-height: 20px;
                    background: #637497;
                    border-radius: 4px;
                    font-size: 10px;
                    color: #FFFFFF;
                }
            }
            p {
                margin-bottom: 9px;
                font-size: 18px;
                color: #A8ABB3;
            }
            span {
                font-size: 14px;
                color: #A8ABB3;
            }
        }
    }

    .el-pagination {
        margin-top: 10px;
    }

    // 操作
    .operate-block {
        position: fixed;
        bottom: 10px;
        left: 0px;
        right: 0px;
        margin: auto;
        width: 500px;
        height: 80px;
        line-height: 90px;
        background: #293550;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.20);
        border-radius: 8px;
        z-index: 600;
        .el-button:last-child {
            margin-left: 40px;
        }
    }

</style>

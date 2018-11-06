<!--轮播频道包详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'轮播频道包详情'}]">
        </custom-breadcrumb>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">轮播频道包信息</h3>
            <el-card>
                <ul>
                    <li><span>产品包类别</span><label>轮播频道包</label></li>
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
                <h3 class="block-vice-title">产品包内轮播频道列表</h3>
                <el-table
                    :data="channelList"
                    header-row-class-name="common-table-header"
                    row-class-name=channel-row
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        width="70px"
                        label="序号">
                        <template slot-scope="scope">
                            <label>{{scope.$index + 1}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="no"
                        width="80px"
                        align="center"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        prop="innerName"
                        width="200px"
                        align="center"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        label="类别">
                        <template slot-scope="scope">
                            <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="multicastIp"
                        label="组播地址">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="80px"
                        prop="multicastPort"
                        label="端口号">
                    </el-table-column>
                    <!--tsId-->
                    <el-table-column
                        align="center"
                        prop="tsId"
                        label="tsId">
                        <template slot-scope="scope">
                            <label>{{scope.row.tsId ? scope.row.tsId : '------'}}</label>
                        </template>
                    </el-table-column>
                    <!--serviceId-->
                    <el-table-column
                        align="center"
                        prop="serviceId"
                        label="serviceId">
                        <template slot-scope="scope">
                            <label>{{scope.row.serviceId ? scope.row.serviceId : '------'}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="pushServer"
                        label="所属服务器">
                        <template slot-scope="scope">
                            <label>{{scope.row.pushServer ? scope.row.pushServer : '------'}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="80px"
                        label="状态">
                        <template slot-scope="scope">
                            <i class="status-normal" v-if="scope.row.visible">正常</i>
                            <i class="status-abnormal" v-else>禁播</i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editInfo">编辑信息</el-button>
                <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'CarouselProductDetail',
        data() {
            return {
                productInfo: {
                    name: '',
                    description: '',
                    visible: true
                },
                channelList: [],
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
                this.$service.getCarouselProductContentList({
                    id: this.$route.params.id,
                    pageNum: 1,
                    pageSize: 1000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                    }
                });
            },
            editInfo() {
                this.$router.push({
                    name: 'EditCarouselProduct', params: this.$route.params
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
        #operate-list {
            position: absolute;
            right: 0px;
            top: 10px;
        }
    }

</style>

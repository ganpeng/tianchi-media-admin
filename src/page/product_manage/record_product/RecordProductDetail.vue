<!--直播回看包详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'直播回看包详情'}]">
        </custom-breadcrumb>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">直播回看包信息</h3>
            <el-card>
                <ul>
                    <li><span>产品包类别</span><label>直播回看包</label></li>
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
                <h3 class="block-vice-title">产品包内直播回看列表</h3>
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
                    <el-table-column prop="code" align="center" width="120px" label="直播频道编号"></el-table-column>
                    <el-table-column prop="no" align="center" width="140px" label="直播频道展示编号"></el-table-column>
                    <el-table-column prop="innerName" align="center" width="120px" label="直播频道名称">
                        <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.innerName}}
                    </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" width="120px" label="直播频道展示名">
                        <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.name}}
                    </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" width="120px" align="center" label="频道类别">
                        <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.typeList | getTypeName}}
                    </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="multicastIp" width="150px" align="center" label="频道IP"></el-table-column>
                    <el-table-column prop="multicastPort" width="100px" align="center" label="频道端口"></el-table-column>
                    <el-table-column prop="pushServer" align="center" label="所属服务器"></el-table-column>
                    <el-table-column align="center" label="是否录制回看">
                        <template slot-scope="scope">
                            {{scope.row.record ? '是' : '否'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="videoPid" align="center" label="videoPid">
                        <template slot-scope="scope">
                            {{scope.row.videoPid | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="audioPid" align="center" label="audioPid">
                        <template slot-scope="scope">
                            {{scope.row.audioPid | padEmpty}}
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
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editInfo">编辑信息</el-button>
                <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'RecordProductDetail',
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
                this.getProductContentListInfo();
            },
            getProductContentListInfo() {
                this.$service.getProductContentListInfo(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data;
                        this.totalAmount = response.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProductContentListInfo();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getProductContentListInfo();
            },
            editInfo() {
                this.$router.push({
                    name: 'EditLookBackProduct', params: this.$route.params
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

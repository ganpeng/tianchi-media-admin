<!--直播回看包详情组件-->
<template>
    <div>
        <div class="content-title">产品包详情</div>
        <!--产品包题目-->
        <div class="detail-title-block">
            <div class="product-status shelve" v-if="productInfo.visible">已上架</div>
            <div class="product-status un-shelve" v-else>已下架</div>
            <div class="title">
                <label>{{productInfo.name}}</label>
                <span>直播回看包</span>
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
        <!--直播频道列表-->
        <div class="content-sub-title">产品包内直播频道列表</div>
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
                prop="code" align="center" width="120px" label="直播频道编号">
            </el-table-column>
            <el-table-column
                prop="no" align="center" width="140px" label="直播频道展示编号">
            </el-table-column>
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
            <el-table-column
                prop="multicastIp" width="150px" align="center" label="频道IP">
            </el-table-column>
            <el-table-column
                prop="multicastPort" width="100px" align="center" label="频道端口">
            </el-table-column>
            <el-table-column
                prop="pushServer" align="center" label="所属服务器">
            </el-table-column>
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
        <!--操作-->
        <div class="operate-block">
            <el-button type="primary" class="btn-style-two" @click="editInfo">编辑</el-button>
            <el-button type="primary" plain class="btn-style-three" @click="toProductList">返回列表</el-button>
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
        filters: {
            getTypeName: function (typeList) {
                let name = '';
                typeList.map(type => {
                    name = '、' + name + type.name;
                });
                return name.slice(1);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 获取基本信息
                this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.productInfo = response.data;
                    }
                });
                // 获取内容列表
                this.$service.getRecordProductContentList({
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
                    name: 'EditRecordProduct', params: this.$route.params
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

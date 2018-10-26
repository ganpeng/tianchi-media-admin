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
                <el-table
                    :data="programmeList"
                    header-row-class-name="common-table-header"
                    row-class-name=programme-row
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
                        align="center"
                        width="120px"
                        prop="code"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        width="100px"
                        align="center"
                        label="图片">
                        <template slot-scope="scope">
                            <img
                                :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                                :alt="scope.row.coverImage.name"
                                v-if="scope.row.coverImage">
                            <label v-else>------</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="主演">
                        <template slot-scope="scope">
                            <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
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
        name: 'ProgrammeProductDetail',
        data() {
            return {
                productInfo: {
                    name: '天龙八部包',
                    description: '这个是天龙八部包',
                    visible: true
                },
                programmeList: []
            };
        },
        methods: {
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
            margin-top: 0px;
        }
        #operate-list {
            position: absolute;
            right: 0px;
            top: 10px;
        }
    }

</style>

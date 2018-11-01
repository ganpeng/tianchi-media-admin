<!--类别包详情组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'产品管理'},
            {name:'类别包详情'}]">
        </custom-breadcrumb>
        <div class="vice-block" id="basic-info">
            <h3 class="block-vice-title">类别包信息</h3>
            <el-card>
                <ul>
                    <li><span>产品包类别</span><label>类别包</label></li>
                    <li><span>产品包名称</span><label>{{productInfo.name}}</label></li>
                    <li><span>产品包简介</span><label>{{productInfo.description}}</label></li>
                    <li>
                        <span>包含类型</span>
                        <label>
                            <el-tag v-for="(item, index) in productInfo.categoryList"
                                    :key="index"
                                    type="info">
                                {{item.name}}
                            </el-tag>
                        </label>
                    </li>
                    <li>
                        <span>产品包状态</span>
                        <label>
                            <i class="status-normal" v-if="productInfo.visible">已上架</i>
                            <i class="status-abnormal" v-else>已下架</i>
                        </label>
                    </li>
                </ul>
            </el-card>
            <div id="operate-list">
                <el-button type="primary" class="page-main-btn" @click="editInfo">编辑信息</el-button>
                <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'TypeProductDetail',
        data() {
            return {
                productInfo: {
                    name: '电影全包',
                    description: '这个是电影券包',
                    categoryList: [
                        {name: '电影'},
                        {name: '电视剧'},
                        {name: '动画片'}
                    ],
                    visible: true
                }
            };
        },
        methods: {
            editInfo() {
                this.$router.push({
                    name: 'EditTypeProduct', params: this.$route.params
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

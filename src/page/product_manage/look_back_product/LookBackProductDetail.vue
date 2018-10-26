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
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LookBackProductDetail',
        data() {
            return {
                productInfo: {
                    name: '',
                    description: '',
                    categoryList: [],
                    visible: true
                }
            };
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

    #basic-info {
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
    }

</style>

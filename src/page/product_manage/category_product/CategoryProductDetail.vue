<!--类别包详情组件-->
<template>
    <div>
        <div class="content-title">产品包详情</div>
        <!--产品包题目-->
        <div class="detail-title-block">
            <div class="product-status shelve" v-if="productInfo.visible">已上架</div>
            <div class="product-status un-shelve" v-else>已下架</div>
            <div class="title">
                <label>{{productInfo.name}}</label>
                <span>类别包</span>
            </div>
            <div class="product-time">
                <div>创建于{{productInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{productInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-product">
            <div>
                <ul>
                    <li v-for="(item, index) in categoryList"
                        :key="index">
                        {{item.name}}
                    </li>
                </ul>
                <p>产品包简介</p>
                <span>{{productInfo.description}}</span>
            </div>
        </div>
        <!--操作-->
        <div class="operate-block">
            <el-button type="primary" class="btn-style-two" @click="editInfo">编辑</el-button>
            <el-button type="primary" plain class="btn-style-three" @click="toProductList">返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'CategoryProductDetail',
        data() {
            return {
                productInfo: {
                    id: '',
                    name: '',
                    description: '',
                    contentIdList: [],
                    visible: true
                },
                categoryOptions: [],
                categoryList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let getProgrammeCategory = this.$service.getProgrammeCategory();
                let getProductInfo = this.$service.getProductInfo({id: this.$route.params.id});
                Promise.all([getProgrammeCategory, getProductInfo]).then(value => {
                    if (value[0] && value[0].code === 0) {
                        this.categoryOptions = value[0].data;
                    }
                    if (value[1] && value[1].code === 0) {
                        this.productInfo = value[1].data;
                    }
                    // 设置包含类别
                    if (this.productInfo.contentIdList) {
                        for (let i = 0; i < this.productInfo.contentIdList.length; i++) {
                            this.categoryOptions.map(category => {
                                if (category.id === this.productInfo.contentIdList[i]) {
                                    this.categoryList.push(category);
                                }
                            });
                        }
                    }
                });
            },
            editInfo() {
                this.$router.push({
                    name: 'EditCategoryProduct', params: this.$route.params
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
            height: 310px;
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

<!--商品详情页面-->
<template>
    <div>
        <div class="content-title">商品详情</div>
        <div class="seperator-line"></div>
        <!--轮播信息-->
        <div class="detail-title-block">
            <div class="channel-status shelve" v-if="goodsInfo.visible">上架</div>
            <div class="channel-status un-shelve" v-else>下架</div>
            <div class="title">
                <label>{{goodsInfo.name}}</label>
            </div>
            <div class="channel-time">
                <div>创建于{{goodsInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{goodsInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-channel">
            <svg-icon icon-class="goods_placeholder"></svg-icon>
            <div class="info-container">
                <div>
                    <ul class="info-list">
                        <li><span>价格：</span><label>{{goodsInfo.price/100}}元</label></li>
                        <li><span>时长：</span><label>{{goodsInfo.validityDays | getGoodsDuration}}</label></li>
                        <li><span>描述：</span><label>{{goodsInfo.description}}</label></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="area-container">
            <h4 class="content-sub-title">
                产品列表&nbsp;&nbsp;
                <span v-if="goodsInfo.productList.length > 0">{{goodsInfo.productList.length}}个</span>
                <span v-if="goodsInfo.productList.length <= 0" class="toggle-btn disabled">
                    展开
                    <i class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
                <span v-if="goodsInfo.productList.length > 0" @click="showProductList = !showProductList"
                      :class="['toggle-btn', showProductList ? 'is-active' : '']">
                    {{showProductList ? '收起' : '展开'}}
                    <i v-if="showProductList" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i>
                    <i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
            </h4>
            <ul v-if="showProductList" class="search-list clearfix">
                <li v-for="(item, index) in goodsInfo.productList" :key="index" :class="['search-item']">
                    <div class="wrapper">
                        <span class="index">{{index + 1}}</span>
                        <span class="search-name my-ellipsis">{{item.name}}</span>
                        <span v-if="item.name.length > 11" class="ellipsis-content">{{item.name}}</span>
                    </div>
                </li>
            </ul>
            <div v-if="goodsInfo.productList.length > 0" class="seperator-line"></div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editInfo">编辑</el-button>
            <el-button class="btn-style-three" @click="toGoodsList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'GoodsDetail',
        data() {
            return {
                showProductList: true,
                goodsInfo: {
                    name: '',
                    description: '',
                    price: '',
                    validityDays: '',
                    productList: [],
                    visible: false
                }
            };
        },
        filters: {
            getGoodsDuration(days) {
                switch (days) {
                    case 30:
                        return '一个月';
                    case 90:
                        return '三个月';
                    case 180:
                        return '半年';
                    case 365:
                        return '一年';
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getGoodsDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.goodsInfo[key] = response.data[key];
                        }
                    }
                });
            },
            // 编辑轮播频道
            editInfo() {
                this.$router.push({
                    name: 'EditGoods',
                    params: {id: this.$route.params.id}
                });
            },
            toGoodsList() {
                this.$router.push({
                    name: 'GoodsList'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 频道题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .channel-status {
            float: left;
            margin-left: 86px;
            margin-right: 94px;
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
            .start-time {
                font-size: 14px;
                color: #A8ABB3;
            }
        }
        .channel-time {
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
    .about-channel {
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        .svg-icon {
            position: absolute;
            top: 0px;
            left: 20px;
            height: 200px !important;
            width: 200px !important;
        }
        .info-container {
            min-width: 1220px;
            margin-left: 260px;
            height: 202px;
            border-top: 1px solid #252D3F;
            > div {
                display: inline-block;
                margin-right: 60px;
            }
            .info-list {
                display: inline-block;
                &.right-info {
                    padding-top: 50px;
                }
                li {
                    margin-bottom: 8px;
                    span {
                        display: inline-block;
                        width: 60px;
                        text-align: right;
                        padding-right: 10px;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                    label {
                        display: inline-block;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                }
            }
        }
    }

    .content-sub-title {
        span:first-child {
            font-size: 20px;
        }
        .toggle-btn {
            font-size: 14px;
            cursor: pointer;
            margin-left: 40px;
            &.is-active,
            &:hover {
                color: $mainColor;
            }
            i {
                color: #3E495E;
            }
            &.disabled {
                opacity: 0.5;
                font-size: 14px;
                cursor: default;
            }
        }
    }

    .svg-icon-arrow_down {
        font-size: 12px;
    }

    .search-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
        .search-item {
            width: 200px;
            height: 34px;
            line-height: 34px;
            border: 1px solid #3E495E;
            background: #2A3040;
            border-radius: 4px;
            margin-right: 20px;
            margin-bottom: 14px;
            .wrapper {
                position: relative;
                display: flex;
                align-items: center;
                height: 32px;
                .index {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    color: #A8ABB3;
                    border-right: 1px solid #3E495E;
                }
                .search-name {
                    color: #A8ABB3;
                    flex: 1;
                    height: 32px;
                    font-size: 14px;
                    line-height: 32px;
                    text-indent: 10px;
                    text-align: left;
                }
                .ellipsis-content {
                    display: none;
                    position: absolute;
                    top: -24px;
                    left: 20px;
                    background: rgba(0, 0, 0, 0.90);
                    box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
                    border-radius: 4px;
                    white-space: nowrap;
                    padding: 0 10px;
                }
                &:hover {
                    .ellipsis-content {
                        display: block;
                    }
                }
            }
        }
    }

</style>

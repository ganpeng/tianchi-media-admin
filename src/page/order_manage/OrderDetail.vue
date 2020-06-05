<!--用户详情组件-->
<template>
    <div class="order-detail-container">
        <h2 class="content-title">用户详情</h2>
        <div class="seperator-line"></div>
        <div>
            <div id="order-status">
                <label>20190324100501001</label>
                <span :class="orderStatus(orderInfo.orderStatus).className">{{orderStatus(orderInfo.orderStatus).text}}</span>
            </div>
            <div class="seperator-line"></div>
            <div id="order-info">
                <ul>
                    <li>
                        <label>产品包：</label>
                        <span>{{orderInfo.subjectName}}</span>
                    </li>
                    <li>
                        <label>订单类型：</label>
                        <span>普通类型</span>
                    </li>
                    <li>
                        <label>支付提交时间：</label>
                        <span>{{orderInfo.createdAt | formatDate('yyyy-MM-DD')}}</span>
                    </li>
                    <li>
                        <label>支付完成时间：</label>
                        <span>{{orderInfo.createdAt | formatDate('yyyy-MM-DD')}}</span>
                    </li>
                </ul>
                <div class="user-info">
                    <label>用户：</label>
                    <span>{{getUserPropByKey('mobile')}}</span>
                    <span v-if="getUserPropByKey('id')" class="name" @click="toUserDetail">查看</span>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div id="order-pay">
                <div>
                    <label>
                        <svg-icon icon-class="wechat"></svg-icon>
                        <svg-icon icon-class="alipay" v-if="false"></svg-icon>
                    </label>
                    <label>订单金额</label>
                    <span>￥{{orderInfo.totalAmount | changeMoney}}</span>
                </div>
                <div>
                    <label>实付金额</label>
                    <span>￥{{orderInfo.totalAmount | changeMoney}}</span>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="toOrderList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';
    export default {
        name: 'OrderDetailInfo',
        data() {
            return {
                orderInfo: {}
            };
        },
        mounted() {
            this.init();
            this.$util.toggleFixedBtnContainer();
        },
        computed: {
            orderStatus() {
                return (type) => {
                    let className = '';
                    let text = '';
                    switch (type) {
                        case 'EXPIRED':
                            className = 'fail';
                            text = '失效';
                            break;
                        case 'CREATED':
                            className = 'waiting';
                            text = '待支付';
                            break;
                        case 'PAID':
                            className = 'success';
                            text = '成功';
                            break;
                        case 'PAID_FAILED':
                            className = 'success';
                            text = '付款失败';
                            break;
                        default:
                            break;
                    }
                    return {
                        className,
                        text
                    };
                };
            },
            getUserPropByKey() {
                return (key) => {
                    return _.get(this.orderInfo, `userInfo.${key}`);
                };
            }
        },
        methods: {
            init() {
                this.$service.getOrderDetail({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.orderInfo = response.data;
                    }
                });
            },
            toEdit() {
                this.$router.push({
                        name: 'EditOrderInfo',
                        params: {
                            id: this.$route.params.id
                        }
                    }
                );
            },
            toUserDetail() {
                let id = _.get(this.orderInfo, 'userInfo.id');
                if (id) {
                    this.$router.push({ name: 'UserDetail', params: {id} });
                }
            },
            toOrderList() {
                this.$router.push({name: 'OrderList'});
            }
        }
    };
</script>
<style lang="scss" scoped>

    #order-status {
        text-align: left;
        height: 50px;
        line-height: 50px;
        label {
            margin-right: 20px;
            font-size: 20px;
            color: #FFFFFF;
        }
        span {
            padding: 0px 14px;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            border-radius: 8px;
            font-size: 20px;
            color: #FFFFFF;
            text-align: center;
            &.success {
                background: #3AC26F;
            }
            &.fail {
                background: #C35757;
            }
            &.waiting {
                background: #D1A254;
            }
        }
    }

    #order-info {
        position: relative;
        text-align: left;
        ul {
            padding: 10px 15px;
            li {
                margin-bottom: 5px;
                text-align: left;
                &:last-child {
                    margin-bottom: 0px;
                }
                label {
                    display: inline-block;
                    font-size: 16px;
                    color: #A8ABB3;
                    text-align: right;
                    width: 112px;
                }
                span {
                    font-size: 16px;
                    color: #A8ABB3;
                }
            }
        }
        .user-info {
            position: absolute;
            top: 10px;
            left: 400px;
            font-size: 16px;
            .name {
                margin-left: 10px;
                font-size: 16px;
                color: $mainColor;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    #order-pay {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        background: #0C1019;
        border-radius: 8px;
        div:first-child {
            padding-left: 24px;
            line-height: 40px;
            label {
                position: relative;
                margin-left: 16px;
                margin-right: 10px;
                font-size: 16px;
                color: #A8ABB3;
                &:first-child {
                    display: inline-block;
                    width: 16px;
                }
            }
            span {
                font-size: 16px;
                color: #FFFFFF;
            }
        }
        div:last-child {
            label {
                font-size: 16px;
                color: #A8ABB3;
            }
            span {
                margin-left: 10px;
                margin-right: 30px;
                font-size: 20px;
                color: #FFFFFF;
            }
        }
        .svg-icon {
            position: absolute;
            top: -20px;
            left: 0px;
            width: 30px !important;
            height: 30px !important;
        }
    }

</style>

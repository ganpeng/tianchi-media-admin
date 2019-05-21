<!--人物用户详情组件-->
<template>
    <div>
        <div class="content-title">用户详情</div>
        <div class="seperator-line"></div>
        <div id="detail-title-block">
            <div class="float-left">
                <svg-icon icon-class="user_vip"></svg-icon>
                <label>15022547876</label>
                <svg-icon icon-class="user_app"></svg-icon>
                <svg-icon icon-class="user_tv"></svg-icon>
                <span>ID:123456789087654323456</span>
            </div>
            <i>注册于2018.10.01</i>
        </div>
        <div class="seperator-line"></div>
        <ul id="other-info">
            <li>
                <span>CA卡号：</span>
                <label>123456787654</label>
            </li>
            <li>
                <span>CA到期日：</span>
                <label>2019.07.24</label>
            </li>
            <li>
                <span>会员到期日：</span>
                <label>2019.07.24</label>
            </li>
            <li>
                <span>TV版本：</span>
                <label>1.0.1</label>
            </li>
        </ul>
        <div class="seperator-line"></div>
        <div id="stb-info">
            <ul>
                <li>
                    <span>设备1MAC：</span>
                    <label>24:f6:77:16:82:51</label>
                </li>
                <li>
                    <span>设备1版本：</span>
                    <label>1.1.0</label>
                </li>
                <li>
                    <span>设备1最后登录：</span>
                    <label>2019.07.24</label>
                </li>
            </ul>
            <ul>
                <li>
                    <span>设备1MAC：</span>
                    <label>24:f6:77:16:82:51</label>
                </li>
                <li>
                    <span>设备1版本：</span>
                    <label>1.1.0</label>
                </li>
                <li>
                    <span>设备1最后登录：</span>
                    <label>2019.07.24</label>
                </li>
            </ul>
            <ul>
                <li>
                    <span>设备1MAC：</span>
                    <label>24:f6:77:16:82:51</label>
                </li>
                <li>
                    <span>设备1版本：</span>
                    <label>1.1.0</label>
                </li>
                <li>
                    <span>设备1最后登录：</span>
                    <label>2019.07.24</label>
                </li>
            </ul>
            <ul>
                <li>
                    <span>设备1MAC：</span>
                    <label>24:f6:77:16:82:51</label>
                </li>
                <li>
                    <span>设备1版本：</span>
                    <label>1.1.0</label>
                </li>
                <li>
                    <span>设备1最后登录：</span>
                    <label>2019.07.24</label>
                </li>
            </ul>
        </div>
        <div class="seperator-line"></div>
        <el-table
            :data="orderList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                prop="code"
                width="120px"
                label="订单编号">
                <template slot-scope="scope">
                <span @click="toOrderDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.code}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                min-width="220px"
                label="用户账号">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="提交时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                min-width="100px"
                prop="price"
                align="center"
                label="订单金额">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="itemCount"
                label="支付方式">
                <template slot-scope="scope">
                    <svg-icon icon-class="alipay"></svg-icon>
                    <svg-icon icon-class="wechat"></svg-icon>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="category"
                min-width="140px"
                label="商品包/套餐">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="状态">
                <template slot-scope="scope">
                    <i class="status-deleting">待支付</i>
                    <i class="status-normal">成功</i>
                    <i class="status-abnormal">失败</i>
                </template>
            </el-table-column>
        </el-table>
        <div class="seperator-line"></div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="toUserList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'UserDetail',
        data() {
            return {
                userInfo: {},
                orderList: [{code: 111111}]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getUserInfoById(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.userInfo = response.data;
                    }
                });
            },
            toUserList() {
                this.$router.push({name: 'UserList'});
            },
            toOrderDetail(item) {
                this.$router.push({name: 'OrderDetail', params: {id: item.id}});
            }
        }
    };
</script>

<style lang="scss" scoped>

    #detail-title-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        div {
            display: flex;
            align-items: center;
            .svg-icon-user_vip {
                margin-left: 20px;
                width: 40px !important;
                height: 29px !important;
            }
            label {
                margin-left: 14px;
                font-size: 20px;
                color: #FFFFFF;
            }
            .svg-icon-user_app {
                margin-left: 20px;
                width: 39px !important;
                height: 15px !important;
            }
            .svg-icon-user_tv {
                margin-left: 20px;
                width: 24px !important;
                height: 15px !important;
            }
            span {
                margin-left: 174px;
                font-size: 16px;
                color: #A8ABB3;
            }
        }
        i {
            margin-right: 10px;
            font-size: 12px;
            color: #6F7480;
        }
    }

    #other-info {
        margin-left: 20px;
        margin-top: 12px;
        margin-bottom: 12px;
        li {
            display: flex;
            justify-content: left;
            align-items: center;
            height: 30px;
            span {
                text-align: right;
                width: 96px;
                font-size: 16px;
                color: #A8ABB3;
            }
            label {
                margin-left: 12px;
                height: 22px;
                line-height: 22px;
                font-size: 16px;
                color: #A8ABB3;
            }
        }
    }

    /*设备信息*/
    #stb-info {
        display: flex;
        flex-wrap: wrap;
        ul {
            margin: 15px 200px 15px 20px;
            li {
                display: flex;
                justify-content: left;
                align-items: center;
                height: 30px;
                span {
                    text-align: right;
                    width: 122px;
                    font-size: 16px;
                    color: #A8ABB3;
                }
                label {
                    margin-left: 12px;
                    height: 22px;
                    line-height: 22px;
                    font-size: 16px;
                    color: #A8ABB3;
                }
            }
        }
    }

    .el-table {
        margin-top: 20px;
        .svg-icon-alipay {
            width: 30px !important;
            height: 30px !important;
        }
        .svg-icon-wechat {
            width: 30px !important;
            height: 24px !important;
        }
    }

</style>

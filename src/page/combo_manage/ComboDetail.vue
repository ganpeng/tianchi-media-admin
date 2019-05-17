<!--套餐详情页面-->
<template>
    <div>
        <div class="content-title">套餐详情</div>
        <div class="seperator-line"></div>
        <div class="detail-title-block">
            <div class="channel-status shelve" v-if="comboInfo.visible">上架</div>
            <div class="channel-status un-shelve" v-else>下架</div>
            <div class="title">
                <label>{{comboInfo.name}}</label>
            </div>
            <div class="channel-time">
                <div>创建于{{comboInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{comboInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-channel">
            <svg-icon icon-class="combo_placeholder"></svg-icon>
            <div class="info-container">
                <div>
                    <ul class="info-list">
                        <li><span>价格：</span><label>{{comboInfo.price/100}}元</label></li>
                        <li><span>时长：</span><label>{{comboInfo.validityDays | getComboDuration}}</label></li>
                        <li><span>描述：</span><label>{{comboInfo.description}}</label></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editInfo">编辑</el-button>
            <el-button class="btn-style-three" @click="toComboList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ComboDetail',
        data() {
            return {
                showProductList: true,
                comboInfo: {
                    name: '',
                    description: '',
                    price: '',
                    validityDays: '',
                    visible: false
                }
            };
        },
        filters: {
            getComboDuration(days) {
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
                this.$service.getComboDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.comboInfo[key] = response.data[key];
                        }
                    }
                });
            },
            // 编辑轮播频道
            editInfo() {
                this.$router.push({
                    name: 'EditCombo',
                    params: {id: this.$route.params.id}
                });
            },
            toComboList() {
                this.$router.push({
                    name: 'ComboList'
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

</style>

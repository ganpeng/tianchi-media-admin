<!--直播推流详情页面-->
<template>
    <div>
        <div class="content-title">直播推流详情</div>
        <div class="seperator-line"></div>
        <!--直播推流信息-->
        <div class="detail-title-block">
            <div class="channel-status shelve" v-if="channelPushInfo.visible">正常</div>
            <div class="channel-status un-shelve" v-else>禁播</div>
            <div class="title">
                <label>{{channelPushInfo.no}}</label>&nbsp;&nbsp;<label>{{channelPushInfo.name}}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div class="channel-time">
                <div>创建于{{channelPushInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{channelPushInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-channel">
            <svg-icon icon-class="inter_cut_placer"></svg-icon>
            <div class="info-container">
                <div>
                    <ul class="info-list">
                        <li><span>内部名称：</span><label>{{channelPushInfo.innerName}}</label></li>
                        <li><span>推流IP：</span><label>{{channelPushInfo.recordIp}}</label></li>
                        <li><span>推流端口：</span><label>{{channelPushInfo.recordPort}}</label></li>
                        <li><span>服务器组：</span><label>{{channelPushInfo.serverGroup}}</label></li>
                        <li><span>推流地址：</span><label>{{channelPushInfo.pushAddress}}</label></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editInfo">编辑</el-button>
            <el-button class="btn-style-three" @click="toChannelPushList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ChannelPushDetail',
        data() {
            return {
                channelPushInfo: {
                    category: 'CAROUSEL',
                    serverGroup: '', // 新加字段
                    visible: false
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getChannelPushDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.channelPushInfo = response.data;
                    }
                });
            },
            // 编辑
            editInfo() {
                this.$router.push({
                    name: 'EditChannelPush',
                    params: {id: this.$route.params.id}
                });
            },
            toChannelPushList() {
                this.$router.push({
                    name: 'ChannelPushList'
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
        padding-bottom: 32px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        .svg-icon {
            position: absolute;
            top: 0px;
            left: 20px;
            height: 200px;
            width: 200px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.50);
        }
        .info-container {
            min-width: 1220px;
            margin-left: 260px;
            height: 235px;
            border-top: 1px solid #252D3F;
            > div {
                display: inline-block;
                margin-right: 60px;
            }
            .type-list {
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
            .info-list {
                display: inline-block;
                &.right-info {
                    padding-top: 50px;
                }
                li {
                    margin-bottom: 8px;
                    span {
                        display: inline-block;
                        width: 110px;
                        text-align: right;
                        padding-right: 10px;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                    label {
                        display: inline-block;
                        font-size: 16px;
                        color: #A8ABB3;
                        &.is-common {
                            color: #3AC26F;
                        }
                        &.protocol-type {
                            margin-right: 10px;
                        }
                        &.on-play {
                            padding: 6px 8px;
                            font-size: 12px;
                            color: #FFFFFF;
                            background: #0062C4;
                            border-radius: 4px;
                        }
                        &.duration {
                            font-size: 12px;
                            color: #A8ABB3;
                            line-height: 17px;
                        }
                    }
                }
            }
        }
    }

</style>

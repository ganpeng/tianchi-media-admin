<template>
    <div class="live-channel-detail-container">
        <h2 class="content-title">直播频道详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section">
                <div class="visible-wrapper">
                    <span :class="['visible', liveChannel.visible ? 'is-visible' : 'dis-visible']">
                        {{liveChannel.visible ? '上架' : '下架'}}
                    </span>
                </div>
                <img :src="liveChannel.logoUri" alt="">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{liveChannel.name}}</span>
                    </div>
                    <div class="date">
                        <span class="create-date">
                            创建于{{liveChannel.createdAt | formatDate('yyyy.MM.DD')}}
                        </span>
                        <span class="update-date">
                            更新于{{liveChannel.updatedAt | formatDate('yyyy.MM.DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="tags-section">
                    <span v-for="(item) in liveChannel.typeList" :key="item.id" class="category-tag">
                        {{item.name}}
                    </span>
                </div>
                <div class="text-info-section">
                    <ul class="text-info">
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">内部名称：</span>
                                <span class="value">{{liveChannel.innerName}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">所属服务器：</span>
                                <span class="value">{{liveChannel.pushServer}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">组播地址：</span>
                                <span class="value">{{liveChannel.multicastIp}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">是否回看：</span>
                                <span class="value">{{liveChannel.record ? '是' : '否'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">端口号：</span>
                                <span class="value">{{liveChannel.multicastPort}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">videoPid：</span>
                                <span class="value">{{liveChannel.videoPid}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">录制IP：</span>
                                <span class="value">{{liveChannel.recordIp}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">audioPid：</span>
                                <span class="value">{{liveChannel.audioPid}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">录制端口：</span>
                                <span class="value">{{liveChannel.recordPort}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editLiveChannel">编辑</el-button>
            <el-button class="btn-style-three" @click="goBack">返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
export default {
    name: 'LiveChannelDetail',
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters({
            liveChannel: 'channel/liveChannel'
        })
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    created() {
        let {id} = this.$route.params;
        if (id) {
            this.getLiveChannelById(id);
        }
    },
    methods: {
        ...mapActions({
            getLiveChannelById: 'channel/getLiveChannelById'
        }),
        editLiveChannel() {
            let {id} = this.$route.params;
            this.$router.push({name: 'EditLiveChannel', params: {id}});
        },
        goBack() {
            this.$router.push({name: 'LiveChannelList'});
        }
    }
};
</script>
<style lang="scss" scoped>
.poster-section {
    img {
        display: block;
        width: 200px;
        height: 200px;
        border: 1px solid #3E495E;
        border-radius: 8px;
        box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
    }
}
.text-info {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    .text-info-item {
        width: 50%;
        font-size: 16px;
        line-height: 32px;
        color: #A8ABB3;
        .text-info-item-wrapper {
            display: flex;
            .label {
                width: 120px;
                text-align: right;
            }
        }
    }
}
</style>

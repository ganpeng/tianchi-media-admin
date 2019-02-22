<template>
    <div class="display-advertising-owner-container">
        <h2 class="content-title">广告主详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{advertisingOwner.name}}</span>
                    </div>
                    <div class="right-wrapper">
                        <div class="date">
                            <span class="create-date">
                                创建于{{advertisingOwner.createdAt | formatDate('yyyy.MM.DD')}}
                            </span>
                            <span class="update-date">
                                更新于{{advertisingOwner.updatedAt | formatDate('yyyy.MM.DD')}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">广告主编号：</label>
                        <span class="value">{{advertisingOwner.id}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">广告主名称：</label>
                        <span class="value">{{advertisingOwner.name}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">广告主备注：</label>
                        <span class="value">{{advertisingOwner.description}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editAdvertisingOwnerHandler">编辑</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
export default {
    name: 'DisplayAdvertisingOwner',
    created() {
        let {id} = this.$route.params;
        this.getAdvertisingOwnerById(id);
    },
    computed: {
        ...mapGetters({
            advertisingOwner: 'advertising/advertisingOwner'
        })
    },
    methods: {
        ...mapActions({
            getAdvertisingOwnerById: 'advertising/getAdvertisingOwnerById'
        }),
        editAdvertisingOwnerHandler() {
            let {id} = this.$route.params;
            this.$router.push({name: 'EditAdvertisingOwner', params: {id}});
        },
        gotoList() {
            this.$router.push({name: 'AdvertisingOwnerList'});
        }
    }
};
</script>
<style lang="scss" scoped>
.common-details .info-section .attributes .item-label {
    width: 100px;
}
</style>

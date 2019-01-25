<!--用户详情组件-->
<template>
    <div class="user-detail-container">
        <h2 class="content-title">用户详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper">
                    <!--  有可能会有状态
                    <span :class="['visible', userInfo.status === 'NORMAL' ? 'is-visible' : 'dis-visible']">
                        {{userInfo.status === 'NORMAL' ? '正常' : '禁用'}}
                    </span>
                    -->
                </div>
                <img src="" alt="" width="200" height="200">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <span class="title">{{userInfo.name}}</span>
                    <div class="date">
                        <span class="create-date">
                            创建于{{userInfo.createdAt | formatDate('yyyy-MM-DD')}}
                        </span>
                        <span class="update-date">
                            更新于{{userInfo.updatedAt | formatDate('yyyy-MM-DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">用户姓名:</label>
                        <span class="value">{{userInfo.name | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">身份证号:</label>
                        <span class="value">{{userInfo.identityId | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">设备ID:</label>
                        <span class="my-tags">
                            <el-tag v-for="(item, index) in userInfo.stbList"
                                    :key="index"
                                    type="info">
                                {{item.no}}
                            </el-tag>
                        </span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">详细地址:</label>
                        <span class="value">{{userInfo.fullAddress | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">手机号码:</label>
                        <span class="value">{{userInfo.mobile | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">电话号码:</label>
                        <span class="value">{{userInfo.telephone | padEmpty}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="toUserList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'UserDetailInfo',
        data() {
            return {
                userInfo: {
                    name: '',
                    identityId: '',
                    stbList: [{no: ''}],
                    province: '',
                    city: '',
                    county: '',
                    street: '',
                    address: '',
                    telephone: '',
                    mobile: '',
                    fullAddress: ''
                }
            };
        },
        mounted() {
            this.init();
            this.$util.toggleFixedBtnContainer();
        },
        methods: {
            init() {
                this.$service.getUserInfoById({id: this.$route.params.id}).then(response => {
                    if (response && response.code === 0) {
                        this.userInfo = response.data;
                    }
                });
            },
            toEdit() {
                this.$router.push({
                        name: 'EditUserInfo',
                        params: {
                            id: this.$route.params.id
                        }
                    }
                );
            },
            toUserList() {
                this.$router.push({name: 'UserList'});
            }
        }
    };
</script>

<style lang="scss" scoped>
.attributes {
    .attribute-item {
        .item-label {
            width: 80px;
        }
    }
}
</style>

<!--管理员详情组件-->
<template>
    <div class="admin-detail-container">
        <h2 class="content-title">管理员详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper">
                    <span :class="['visible', adminInfo.status === 'NORMAL' ? 'is-visible' : 'dis-visible']">
                        {{adminInfo.status === 'NORMAL' ? '正常' : '禁用'}}
                    </span>
                </div>
                <img src="" alt="" width="200" height="200">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <span class="title">{{adminInfo.name}}</span>
                    <div class="date">
                        <span class="create-date">
                            创建于{{adminInfo.createdAt | formatDate('yyyy-MM-DD')}}
                        </span>
                        <span class="update-date">
                            更新于{{adminInfo.updatedAt | formatDate('yyyy-MM-DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">邮箱:</label>
                        <span class="value">{{adminInfo.email | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">手机号:</label>
                        <span class="value">{{adminInfo.mobile | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">固话:</label>
                        <span class="value">{{adminInfo.telephone | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">最后登录:</label>
                        <span class="value">{{adminInfo.lastLoginAt}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'AdminDetail',
        data() {
            return {
                adminInfo: {
                    name: '',
                    email: '',
                    mobile: '',
                    telephone: '',
                    createdAt: '',
                    status: 'NORMAL',
                    imageUrl: ''
                }
            };
        },
        filters: {
            displayStatus(status) {
                if (status === 'NORMAL') {
                    return '正常';
                } else {
                    return '失效';
                }
            }
        },
        mounted() {
            this.initInfo();
        },
        methods: {
            initInfo() {
                this.$service.getAdminInfo({id: this.$route.params.id}).then(response => {
                    if (response) {
                        this.adminInfo = response.data;
                    }
                });
            },
            toEdit() {
                this.$router.push({name: 'EditAdmin', params: {id: this.$route.params.id}});
            },
            goBack() {
                this.$router.push({name: 'AdminList'});
            }
        }
    };
</script>
<style lang="scss" scoped>
.attributes {
    .attribute-item {
        &:last-child {
            margin-top: 70px;
        }
        .item-label {
            width: 80px;
        }
    }
}
</style>

<!--我的信息组件-->
<template>
    <div class="my-info-container">
        <h2 class="content-title">个人中心</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper">
                </div>
                <svg-icon icon-class="person_avatar"></svg-icon>
            </div>
            <div class="info-section">
                <el-button type="primary" class="btn-style-two edit-btn" @click="editInfo">编辑</el-button>
                <div class="title-wrapper">
                    <span class="title">{{info.name ? info.name : '我'}}</span>
                    <div class="date">
                        <span id="create-date">
                            创建于{{info.createdAt | formatDate('yyyy-MM-DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">邮箱:</label>
                        <span class="value">{{info.email | padEmpty}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">手机号:</label>
                        <span class="value">{{info.mobile | padEmpty}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'MyInfo',
        data() {
            return {
                info: {}
            };
        },
        mounted() {
            this.initData();
        },
        methods: {
            // 初始化个人信息
            initData() {
                this.$service.getAdminSelfInfo().then(response => {
                    if (response && response.code === 0) {
                        this.info = response.data;
                    }
                });
            },
            editInfo() {
                this.$router.push({name: 'InfoSetting'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .info-section {
        position: relative;
        .edit-btn {
            position: absolute;
            top: 60px;
            right: 0px;
        }
    }

    #create-date {
        height: 44px;
        line-height: 44px;
    }

    .svg-icon-person_avatar {
        width: 200px !important;
        height: 200px !important;
    }

</style>

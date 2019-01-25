<!--我的信息组件-->
<template>
    <div class="my-info-container">
        <h2 class="content-title">个人中心</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper"></div>
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
                        <div class="item-label" id="email-label">
                            <svg-icon icon-class="email_info"></svg-icon>
                            邮箱
                        </div>
                        <div class="value">{{info.email | padEmpty}}</div>
                    </div>
                    <div class="attribute-item">
                        <div class="item-label" id="phone-label">
                            <svg-icon icon-class="phone_info"></svg-icon>
                            手机
                        </div>
                        <div class="value">{{info.mobile | padEmpty}}</div>
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

    .my-info-container {
        .attribute-item {
            margin-bottom: 20px;
            #email-label, #phone-label {
                font-size: 16px;
                color: #A8ABB3;
                width: auto;
            }
            .value {
                font-size: 16px;
                color: #A8ABB3;
            }
        }
    }

    .svg-icon-person_avatar {
        width: 200px !important;
        height: 200px !important;
    }

    .svg-icon-email_info {
        margin-right: 6px;
        width: 30px !important;
        height: 18px !important;
    }

    .svg-icon-phone_info {
        margin-right: 10px;
        margin-left: 6px;
        width: 20px !important;
        height: 30px !important;
    }

</style>

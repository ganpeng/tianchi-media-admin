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
            toInfoSetting() {
                this.$router.push({name: 'InfoSetting'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    #info-box {
        position: relative;
        padding: 20px;
        margin-top: 100px;
        width: 600px;
        height: 300px;
        overflow: visible;
        .avatar-box {
            position: absolute;
            left: 20px;
            top: -40px;
            .el-card {
                margin-bottom: 26px;
                width: 150px;
                height: 150px;
                background: $dynamicGray;
            }
            label {
                font-size: $smallestFontSize;
                color: #B8C7CE;
            }
        }
        .info {
            position: absolute;
            left: 200px;
            top: 50px;
            height: 200px;
            width: 350px;
            overflow: hidden;
            div:not(.box) {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-bottom: 25px;
            }
            div.box {
                display: flex;
                flex-direction: row;
                justify-content: left;
            }
            label {
                text-align: left;
                margin-bottom: 12px;
                color: #9B9B9B;
                font-size: $normalFontSize;
            }
            span {
                text-align: left;
                font-size: 20px;
                color: $baseAsideColor;
            }
            .svg-box {
                fill: $dynamicGray;
            }
        }
        .edit-icon-box {
            position: absolute;
            top: 10px;
            right: 10px;
            height: 30px;
            width: 30px;
            cursor: pointer;
            .svg-box {
                height: 30px !important;
                width: 30px !important;
                fill: $baseBlue;
            }
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

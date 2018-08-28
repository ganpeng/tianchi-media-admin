<!--我的信息组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'个人中心'},
            {name:'我的信息'}]">
        </custom-breadcrumb>
        <el-card id="info-box">
            <div class="avatar-box">
                <el-card>
                    <img src="~assets/img/avatar_square_default.png">
                </el-card>
                <label>账号创建于{{info.createdAt | formatDate('yyyy年MM月DD日')}}</label>
            </div>
            <div class="info">
                <div>
                    <label>
                        <svg-icon
                            icon-class="personal_center"
                            class-name="svg-box">
                        </svg-icon>
                        我</label>
                    <span>{{info.name}}</span>
                </div>
                <div>
                    <label>
                        <svg-icon
                            icon-class="email"
                            class-name="svg-box">
                        </svg-icon>
                        邮箱</label>
                    <span>{{info.email}}</span>
                </div>
                <div class="box">
                    <div>
                        <label>
                            <svg-icon
                                icon-class="mobile"
                                class-name="svg-box">
                            </svg-icon>
                            手机</label>
                        <span>{{info.mobile}}</span>
                    </div>
                    <template v-if="info.telephone">
                        <img src="~assets/img/angle-line.png">
                        <div>
                            <label>
                                <svg-icon
                                    icon-class="telephone"
                                    class-name="svg-box">
                                </svg-icon>
                                电话</label>
                            <span>{{info.telephone ? info.telephone : ''}}</span>
                        </div>
                    </template>
                </div>
            </div>
            <div @click="toInfoSetting" class="edit-icon-box">
                <svg-icon
                    icon-class="edit"
                    class-name="svg-box">
                </svg-icon>
            </div>
        </el-card>
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

</style>

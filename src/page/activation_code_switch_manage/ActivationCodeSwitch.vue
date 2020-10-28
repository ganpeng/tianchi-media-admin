<template>
    <div id="code-switch-container">
        <div class="content-title">激活码
            <label class="open-btn" v-if="codeSwitchInfo.status">已开启</label>
            <label class="close-btn" v-else>已关闭</label>
        </div>
        <div class="seperator-line"></div>
        <!-- 详情状态-->
        <div id="display-block" v-if="pageStatus === 0">
            <svg-icon icon-class="active_code_open" v-if="codeSwitchInfo.status"></svg-icon>
            <svg-icon icon-class="active_code_close" v-else></svg-icon>
            <label>{{codeSwitchInfo.status ? '开':'关'}}</label>
        </div>
        <!--编辑状态-->
        <div v-else id="edit-status-block">
            <div class="open-block" v-if="codeSwitchInfo.status">
                <div>
                    <svg-icon icon-class="active_code_open_toggle"></svg-icon>
                    <label>开</label>
                </div>
                <div @click="codeSwitchInfo.status = false">
                    <svg-icon icon-class="active_code_close"></svg-icon>
                    <label>关</label>
                </div>
            </div>
            <div class="close-block close" v-else>
                <div @click="codeSwitchInfo.status = true">
                    <svg-icon icon-class="active_code_open"></svg-icon>
                    <label>开</label>
                </div>
                <div>
                    <svg-icon icon-class="active_code_close_toggle"></svg-icon>
                    <label>关</label>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" v-if="pageStatus === 0" @click="pageStatus = 1">编辑
            </el-button>
            <el-button class="btn-style-two" type="primary" v-else @click="saveInfo">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'activation-code-switch',
        data() {
            return {
                // 0代表详情，1代表编辑状态
                pageStatus: 0,
                codeSwitchInfo: {
                    status: false
                }
            };
        },
        mounted() {
            this.$util.toggleFixedBtnContainer();
            this.getCodeSwitchInfo();
        },
        methods: {
            getCodeSwitchInfo() {
                this.$service.getCodeSwitchInfo().then(response => {
                    if (response && response.code === 0) {
                        this.codeSwitchInfo.status = response.data;
                    }
                });
            },
            saveInfo() {
                this.$service.updateCodeSwitchInfo(this.codeSwitchInfo.status).then(response => {
                    if (response && response.code === 0) {
                        this.pageStatus = 0;
                        this.getCodeSwitchInfo();
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">

    #code-switch-container {
        .content-title {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .open-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 40px;
            width: 80px;
            height: 30px;
            background: rgba(58, 194, 111, 1);
            border-radius: 7px;
            font-size: 18px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }
        .close-btn {
            margin-left: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 30px;
            background: rgba(195, 87, 87, 1);
            border-radius: 8px;
            font-size: 18px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }
    }

    #edit-status-block {
        margin-top: 84px;
        display: flex;
        flex-direction: column;
        align-items: left;
        .open-block, .close-block {
            margin-left: 120px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            &.close {
                div:first-child {
                    label {
                        color: rgba(165, 168, 176, 1);
                    }
                }
                div:last-child {
                    label {
                        color: rgba(237, 66, 66, 1);
                    }
                }
            }
            div {
                display: flex;
                flex-direction: column;
                align-items: left;
                justify-content: flex-start;
                cursor: pointer;
                &:last-child {
                    margin-left: 153px;
                    label {
                        color: rgba(165, 168, 176, 1);
                    }
                }
                .svg-icon {
                    margin-bottom: 20px;
                    width: 130px;
                    height: 234px;
                }
                label {
                    font-size: 20px;
                    font-weight: 400;
                    color: rgba(58, 194, 111, 1);
                }
            }
        }
    }

    #display-block {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .svg-icon {
            margin-top: 84px;
            margin-left: 120px;
            margin-bottom: 20px;
            width: 130px;
            height: 234px;
        }
        label {
            margin-left: 175px;
            text-align: left;
            font-size: 20px;
            font-weight: 400;
            color: rgba(165, 168, 176, 1);
        }
    }

</style>

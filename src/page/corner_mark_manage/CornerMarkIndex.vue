<!--内容管理-角标管理组件-->
<template>
    <div>
        <div class="content-title">角标管理</div>
        <div class="list-container">
            <el-row class="top-container">
                <el-col :span="6" class="top-left-block corner-block">
                    <label class="corner-title top-left-title">左上角</label>
                    <ul>
                        <li>
                            <svg-icon icon-class="corner_mark_tencent"></svg-icon>
                        </li>
                        <li>
                            <svg-icon icon-class="corner_mark_youku"></svg-icon>
                        </li>
                        <li>
                            <svg-icon icon-class="corner_mark_aiqiyi"></svg-icon>
                        </li>
                        <li>
                            <svg-icon icon-class="corner_mark_mango"></svg-icon>
                        </li>
                        <li>
                            <svg-icon icon-class="corner_mark_souhu"></svg-icon>
                        </li>
                    </ul>
                </el-col>
                <el-col :span="18" class="top-right-block corner-block">
                    <label class="corner-title top-right-title">右上角</label>
                    <ul>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img src=""/>
                                <i>编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img src=""/>
                                <i>编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img src=""/>
                                <i>编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img src=""/>
                                <i>编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img src=""/>
                                <i>编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img class="little" src=""/>
                                <i @click="editCustomCornerMark">编辑</i>
                            </p>
                        </li>
                        <li>
                            <div>
                                <label>最新-大</label>
                                <i class="el-icon-circle-close"></i>
                            </div>
                            <p>
                                <img class="little" src=""/>
                                <i @click="editCustomCornerMark">编辑</i>
                            </p>
                        </li>
                        <li class="upload-box" @click="cornerMarkDialogVisible = true">
                            <i class="el-icon-plus"></i>
                        </li>
                    </ul>
                </el-col>
            </el-row>
            <el-row class="bottom-container">
                <el-col :span="6" class="bottom-left-block corner-block">
                    <svg-icon icon-class="corner_mark_update_no"></svg-icon>
                    <label class="corner-title bottom-left-title">左下角</label>
                </el-col>
                <el-col :span="18" class="bottom-right-block corner-block">
                    <svg-icon icon-class="corner_mark_score"></svg-icon>
                    <label class="corner-title bottom-right-title">右下角</label>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            title="创建角标"
            :visible.sync="cornerMarkDialogVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            top="13vh"
            width="60%">
            <custom-corner-mark-form></custom-corner-mark-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cornerMarkDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmCornerMarkForm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import CustomCornerMarkForm from './CustomCornerMarkForm';

    export default {
        name: 'CornerMarkIndex',
        components: {
            CustomCornerMarkForm
        },
        data() {
            return {
                cornerMarkDialogVisible: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            // 获取角标列表
            init() {
            },
            // 确定创建角标
            confirmCornerMarkForm() {
            },
            // 编辑角标
            editCustomCornerMark() {
                this.cornerMarkDialogVisible = true;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .list-container {
        padding: 25px;
        height: 700px;
        background: #252D3F;
        border-radius: 4px;
        border: 1px solid #252D3F;
        .top-container {
            border-bottom: 1px solid #3E495E;
            height: 450px;
        }
        .bottom-container {
            height: 200px;
        }
        .corner-block {
            position: relative;
            height: 100%;
            .corner-title {
                position: absolute;
                font-size: 20px;
                color: #A8ABB3;
                &.top-left-title {
                    left: 0px;
                    top: 0px;
                }
                &.top-right-title {
                    right: 0px;
                    top: 0px;
                }
                &.bottom-left-title {
                    left: 0px;
                    bottom: 0px;
                }
                &.bottom-right-title {
                    right: 0px;
                    bottom: 0px;
                }
            }
        }
        /*左上角*/
        .top-left-block {
            ul {
                padding-top: 55px;
                li {
                    margin-bottom: 10px;
                    text-align: left;
                    .svg-icon {
                        text-align: left;
                        height: 25px !important;
                        width: 89px !important;
                    }
                }
            }
        }
        /*右上角*/
        .top-right-block {
            border-left: 1px solid #3E495E;
            ul {
                margin: 55px 0px 0px 30px;
                li {
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    padding: 0px 10px;
                    width: 130px;
                    background: #2E384D;
                    border-radius: 4px;
                    /*上传框*/
                    &.upload-box {
                        height: 100px;
                        border: 1px solid #3E495E;
                        border-radius: 4px;
                        background: #252D3F;
                        line-height: 100px;
                        cursor: pointer;
                        i {
                            font-size: 24px;
                            color: #3E495E;
                        }
                    }
                    div {
                        height: 35px;
                        line-height: 35px;
                        border-bottom: 1px solid #3E495E;
                        label {
                            display: inline-block;
                            width: 86px;
                            text-align: left;
                            font-size: 18px;
                            color: #A8ABB3;
                        }
                        i {
                            font-size: 16px;
                            color: #C0C4CC;
                            cursor: pointer;
                        }
                    }
                    P {
                        height: 65px;
                        img {
                            margin-top: 8px;
                            width: 63px;
                            height: 50px;
                            &.little {
                                margin-top: 21px;
                                width: 38px;
                                height: 23px;
                            }
                        }
                        i {
                            display: inline-block;
                            margin-top: 23px;
                            margin-left: 10px;
                            font-size: 14px;
                            color: #1989FA;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
        /*左下角*/
        .bottom-left-block {
            padding-top: 25px;
            text-align: left;
            .svg-icon {
                height: 24px !important;
                width: 83px !important;
            }
        }
        /*右下角*/
        .bottom-right-block {
            padding-top: 25px;
            text-align: right;
            border-left: 1px solid #3E495E;
            .svg-icon {
                height: 24px !important;
                width: 36px !important;
            }
        }
    }

</style>

<style lang="scss">

    .normal-dialog {
        background: #293550;
        border: 0 solid #637497;
        box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        .el-dialog__header {
            padding: 0px;
            height: 50px;
            line-height: 55px;
            background: #1F2D4D;
            .el-dialog__title {
                font-size: 20px;
                color: #909399;
            }
            .el-dialog__headerbtn {
                top: 16px;
                font-size: 15px;
                .el-dialog__close {
                    color: #C35757;
                }
            }
        }
        .el-dialog__footer {
            .el-button {
                width: 100px;
                height: 40px;
                &.el-button--default {
                    color: $dangerColor;
                }
                &.el-button--default.el-button--primary {
                    color: #A3D0FD;
                }
                &:first-child {
                    margin-left: 10px;
                }
            }
        }
    }

</style>

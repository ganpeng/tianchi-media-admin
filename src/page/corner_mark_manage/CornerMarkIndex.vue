<!--内容管理-角标管理组件-->
<template>
    <div>
        <div class="content-title">角标管理</div>
        <div class="list-container">
            <el-row class="top-container">
                <el-col :span="18" class="top-right-block corner-block">
                    <label class="corner-title top-right-title">右上角</label>
                    <ul>
                        <li v-for="(item, index) in customCornerMarkList" :key="index">
                            <div>
                                <label>{{item.caption}}</label>
                                <i class="el-icon-circle-close" @click="removeCornerMark(item, index)"></i>
                            </div>
                            <p>
                                <label class="corner-image-box" v-if="item.image && item.image.uri">
                                    <img :src="item.image ? item.image.uri :''" :alt="item.caption"/>
                                    <span class="end-name">tv</span>
                                </label>
                                <label class="corner-image-box" v-if="item.appImage && item.appImage.uri">
                                    <img :src="item.appImage ? item.appImage.uri :''" :alt="item.caption"/>
                                    <span class="end-name">app</span>
                                </label>
                                <i @click="openEditDialog(item)">编辑</i>
                            </p>
                        </li>
                        <li class="upload-box" @click="openCreateDialog">
                            <i class="el-icon-plus"></i>
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="cornerMarkDialogVisible"
            :close-on-click-modal=false
            custom-class="normal-dialog"
            top="13vh"
            width="60%">
            <custom-corner-mark-form
                v-if="cornerMarkDialogVisible"
                ref="customCornerMarkForm"
                v-on:successHandler="successHandler"
                v-on:setIsLoadingStatus="setIsLoadingStatus">
            </custom-corner-mark-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cornerMarkDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmCornerMarkForm" :loading="isLoading">确定</el-button>
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
                isLoading: false,
                customCornerMarkList: [],
                cornerMarkDialogVisible: false,
                dialogTitle: '添加角标'
            };
        },
        mounted() {
            if (!this.$authority.isHasAuthority('content:mark:list')) {
                return;
            }
            this.getCornerMarkList();
        },
        methods: {
            setIsLoadingStatus(status) {
                this.isLoading = status;
            },
            getCornerMarkList() {
                this.$service.getCornerMarkList({markType: 'CUSTOM'}).then(response => {
                    if (response && response.code === 0) {
                        this.customCornerMarkList = response.data;
                    }
                });
            },
            openCreateDialog() {
                if (!this.$authority.isHasAuthority('content:mark:add')) {
                    return;
                }
                this.dialogTitle = '创建角标';
                this.cornerMarkDialogVisible = true;
            },
            openEditDialog(item) {
                if (!this.$authority.isHasAuthority('content:mark:put')) {
                    return;
                }
                this.dialogTitle = '编辑角标';
                this.cornerMarkDialogVisible = true;
                this.$nextTick(function () {
                    this.$refs.customCornerMarkForm.initCornerMark(item);
                });
            },
            // 确定角标信息
            confirmCornerMarkForm() {
                this.$refs.customCornerMarkForm.confirmCornerMark();
            },
            successHandler() {
                this.cornerMarkDialogVisible = false;
                this.getCornerMarkList();
            },
            removeCornerMark(item) {
                if (!this.$authority.isHasAuthority('content:mark:delete')) {
                    return;
                }
                this.$confirm('此操作将删除角标, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteCornerMarkById({id: item.id}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('角标删除成功');
                            this.getCornerMarkList();
                        }
                    });
                });
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
        .corner-block {
            position: relative;
            height: 100%;
            .corner-title {
                position: absolute;
                font-size: 20px;
                color: #A8ABB3;
                &.top-right-title {
                    left: 0px;
                    top: 0px;
                }
            }
        }
        .el-col-18 {
            width: 100%;
        }
        /*右上角*/
        .top-right-block {
            ul {
                margin: 55px 0px 0px 30px;
                li {
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    padding: 0px 10px;
                    background: #2E384D;
                    border-radius: 4px;
                    /*上传框*/
                    &.upload-box {
                        height: 120px;
                        width: 120px;
                        border: 1px solid #3E495E;
                        border-radius: 4px;
                        background: #252D3F;
                        line-height: 120px;
                        cursor: pointer;
                        i {
                            font-size: 24px;
                            color: #3E495E;
                        }
                        &:hover {
                            border-color: #1989FA;
                            i {
                                color: #1989FA;
                            }
                        }
                    }
                    div {
                        height: 35px;
                        line-height: 35px;
                        border-bottom: 1px solid #3E495E;
                        overflow: hidden;
                        label {
                            float: left;
                            width: 86px;
                            text-align: left;
                            font-size: 18px;
                            color: #A8ABB3;
                        }
                        i {
                            float: right;
                            margin-top: 8px;
                            font-size: 16px;
                            color: #6F7480;
                            cursor: pointer;
                            &:hover {
                                color: #C35757;
                            }
                        }
                    }
                    P {
                        height: 85px;
                        display: flex;
                        flex-wrap: nowrap;
                        .corner-image-box {
                            position: relative;
                            width: 72px;
                            height: 52px;
                            display: flex;
                            margin-top: 8px;
                            justify-content: center;
                            align-items: center;
                            overflow: visible;
                            img {
                                transform: scale(0.3, 0.3);
                            }
                            &:nth-child(2) {
                                margin-left: 10px;
                            }
                            .end-name {
                                position: absolute;
                                left: 28px;
                                bottom: -12px;
                                font-size: 12px;
                                color: #A8ABB3;
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
    }

</style>

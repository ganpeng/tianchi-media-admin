<!--2.0批量操作信息组件-->
<template>
    <div v-if="messageShow">
        <div id="expand-info" v-if="expandStatus">
            <div class="title">
                <div class="float-left message-count">
                    <label>共{{batchMessageList.length}}条信息</label>
                    <span>成功{{successCount}}条</span>
                    <i>失败{{failCount}}条</i>
                </div>
                <div class="float-right message-operate">
                    <i @click="expandStatus = false">
                        <svg-icon icon-class="minimize"></svg-icon>
                    </i>
                    <i class="close-btn el-icon-close" @click="messageShow = false"></i>
                </div>
            </div>
            <el-table
                v-if="failMessageList.length !== 0"
                :data="failMessageList"
                :border="false"
                :show-header="false"
                style="width:640px"
                max-height="550">
                <el-table-column
                    label="序号"
                    width="40">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="116">
                </el-table-column>
                <el-table-column
                    prop="name"
                    width="230"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="信息">
                    <template slot-scope="scope">
                        <ul class="response-info-list">
                            <li v-if="scope.row.message.otherReason">
                                <span class="other-reason">{{scope.row.message.otherReason}}</span>
                            </li>
                            <li v-else
                                v-for="(item, index) in scope.row.message.relateList"
                                :key="index">
                                <div>
                                    <label>{{item}}</label>
                                </div>
                                <span>{{scope.row.message.relateReason}}</span>
                            </li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="minimize-info" v-if="!expandStatus">
            <div class="float-left message-count">
                <label>共{{batchMessageList.length}}条信息</label>
                <span>成功{{successCount}}条</span>
                <i>失败{{failCount}}条</i>
            </div>
            <div class="float-right message-operate">
                <i @click="expandStatus = true">
                    <svg-icon icon-class="expand"></svg-icon>
                </i>
                <i class="close-btn el-icon-close" @click="messageShow = false"></i>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'BatchMessageListDialog',
        props: {
            batchMessageList: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                expandStatus: true,
                messageShow: false,
                finishedCount: 0,
                successCount: 0,
                failCount: 0,
                failMessageList: []
            };
        },
        watch: {
            batchMessageList: function () {
                this.finishedCount = 0;
                this.successCount = 0;
                this.failCount = 0;
                this.failMessageList = [];
                for (let i = 0; i < this.batchMessageList.length; i++) {
                    if (this.batchMessageList[i].isFinished) {
                        this.finishedCount++;
                        if (this.batchMessageList[i].isSuccess) {
                            this.successCount++;
                        } else {
                            this.failMessageList.push(this.batchMessageList[i]);
                            this.failCount++;
                        }
                    }
                }
            }
        },
        methods: {
            setBatchMessageStatus(status) {
                this.messageShow = status;
            }
        }
    };
</script>

<style lang="scss" scoped>

    #expand-info {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 660px;
        height: 600px;
        background: rgba(41, 53, 80, 0.98);
        border: 0.5px solid #637497;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        overflow: hidden;
        z-index: 500;
        .title {
            height: 50px;
            line-height: 50px;
            background: rgba(6, 28, 57, 0.98);
            .message-count {
                margin-left: 40px;
                label {
                    margin-right: 15px;
                    font-size: 20px;
                    color: #A8ABB3;
                }
                span {
                    margin-right: 8px;
                    font-size: 14px;
                    color: #3AC26F;
                }
                i {
                    font-style: normal;
                    font-size: 14px;
                    color: #C35757;
                }
            }
            .message-operate {
                margin-right: 12px;
                .svg-icon {
                    cursor: pointer;
                    &.svg-icon-minimize {
                        fill: #637497;
                        &:hover {
                            fill: #1989FA;
                        }
                    }
                }
                .close-btn {
                    font-size: 20px;
                    margin-left: 20px;
                    color: #C35757;
                    cursor: pointer;
                    &:hover {
                        color: #D0021B;
                    }
                }
            }
        }
        /*列表样式*/
        .el-table {
            margin: 0px 10px;

        }
    }

    #minimize-info {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 380px;
        height: 50px;
        line-height: 50px;
        opacity: 0.98;
        background: #1F2D4D;
        border: 0.5px solid #637497;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.30);
        border-radius: 8px;
        z-index: 500;
        .message-count {
            margin-left: 20px;
            label {
                margin-right: 15px;
                font-size: 20px;
                color: #A8ABB3;
            }
            span {
                margin-right: 8px;
                font-size: 14px;
                color: #3AC26F;
            }
            i {
                font-style: normal;
                font-size: 14px;
                color: #C35757;
            }
        }
        .message-operate {
            margin-right: 12px;
            .svg-icon {
                cursor: pointer;
                &.svg-icon-expand {
                    fill: #637497;
                    &:hover {
                        fill: #1989FA;
                    }
                }
            }
            .close-btn {
                font-size: 20px;
                margin-left: 20px;
                color: #C35757;
                cursor: pointer;
                &:hover {
                    color: #D0021B;
                }
            }
        }
    }

</style>

<style lang="scss">

    #expand-info {
        .el-table {
            .el-table__body tr {
                background: rgba(41, 53, 80, 0.98);
            }
            .response-info-list {
                li {
                    height: 23px;
                    margin: 5px 0px;
                    div {
                        float: left;
                        height: 23px;
                        width: 140px;
                        label {
                            display: inline-block;
                            max-width: 140px;
                            padding: 0px 6px;
                            border-radius: 12px;
                            font-size: 14px;
                            color: #FFFFFF;
                            text-align: center;
                            background: #0062C4;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                    .other-reason {
                        width: 100%;
                        text-align: center;
                        color: #C35757;
                    }
                    span {
                        float: left;
                        margin-left: 5px;
                        height: 23px;
                        font-size: 14px;
                        color: #1989FA;
                    }
                }
            }
        }
    }

</style>

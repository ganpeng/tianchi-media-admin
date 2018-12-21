<!--导入excel统一批量修改轮播频道组件-->
<template>
    <div class="import-page-container">
        <div id="container">
            <!--左侧-->
            <div class="left-container">
                <!--上传状态-->
                <div class="upload-status">
                    <div>
                        <el-button
                            class="btn-style-six contain-svg-icon"
                            @click="exportTemplate">
                            <svg-icon icon-class="export"></svg-icon>
                            导出模板
                        </el-button>
                        <i>修改轮播频道</i>
                        <label>
                            共{{channelList.length}}条，已进行{{finishNo}}条，成功
                            <span class="success-info">{{finishNo - failNo}}</span>条,失败
                            <span class="fail-info">{{failNo}}</span>条
                        </label>
                    </div>
                </div>
                <!--主要信息-->
                <div class="main-info">
                    <div class="list-none" v-if="channelList.length === 0">
                        <img src="../../../assets/img/empty_upload.png">
                    </div>
                    <template v-else>
                        <div class="info-header">已选文件</div>
                        <el-table
                            :data="channelList"
                            header-row-class-name="common-table-header"
                            border>
                            <el-table-column
                                align="center"
                                width="60px"
                                label="序号">
                                <template slot-scope="scope">
                                    <label>{{scope.$index + 1}}</label>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                v-for='item of tableHeader'
                                :prop="item"
                                :label="item"
                                :key='item'>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="message"
                                label="提示信息">
                            </el-table-column>
                        </el-table>
                        <div class="operate-item">
                            <el-button
                                v-if="channelList.length !== 0"
                                :disabled="updateDisabled"
                                type="primary"
                                @click="updateChannels"
                                class="btn-style-two">
                                保存
                            </el-button>
                            <el-button
                                @click="toChannelList"
                                type="primary"
                                plain
                                class="btn-style-three">
                                返回列表
                            </el-button>
                        </div>
                    </template>
                </div>
            </div>
            <div class="right-container">
                <div class="title">批量导入区域</div>
                <div class="upload">
                    <upload-excel-component
                        :on-success='handleSuccess'
                        :before-upload="beforeUpload">
                    </upload-excel-component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UploadExcelComponent from 'sysComponents/custom_components/custom/UploadExcel';
    import XLSX from 'xlsx';

    export default {
        name: 'EditChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
                channelAllList: [],
                updateDisabled: false,
                tips: '',
                channelList: [],
                tableHeader: [],
                failNo: 0,
                finishNo: 0
            };
        },
        mounted() {
        },
        methods: {
            // 导出所有轮播频道的表格
            exportTemplate() {
                this.$service.getChannelList({category: 'CAROUSEL', pageSize: 2000, pageNum: 0}).then(response => {
                    if (response && response.code === 0) {
                        this.channelAllList = response.data.list;
                        let exportChannelData = [];
                        this.channelAllList.map(channel => {
                            let simpleChannel = {
                                id: channel.id,
                                innerName: channel.innerName,
                                no: channel.no,
                                multicastIp: channel.multicastIp,
                                multicastPort: channel.multicastPort,
                                tsId: channel.tsId,
                                serviceId: channel.serviceId,
                                pushServer: channel.pushServer
                            };
                            exportChannelData.push(simpleChannel);
                        });
                        // 目前可以修改的字段有编号、组播地址、端口号、tsId、serviceId、所属服务器
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, '轮播频道批量修改导入表.xlsx');
                    }
                });
            },
            beforeUpload() {
                this.tips = '';
                this.failNo = 0;
                return true;
            },
            handleSuccess({results, header}) {
                this.channelList = results;
                this.tableHeader = header;
            },
            toChannelList() {
                this.$router.push({name: 'CarouselChannelList'});
            },
            reset() {
                this.tips = '';
                this.failNo = 0;
                this.finishNo = 0;
                this.channelList.map(channel => {
                    channel.message = '';
                });
            },
            // 批量修改轮播频道
            updateChannels() {
                this.reset();
                if (this.channelList.length === 0) {
                    this.$message({
                        message: '当前没有轮播频道需要修改',
                        type: 'warning'
                    });
                    return;
                }
                let that = this;
                let validateTag = true;
                // 对每一项进行验证
                for (let i = 0; i < this.channelList.length; i++) {
                    if (!this.validateChannel(this.channelList[i], i)) {
                        validateTag = false;
                    }
                }
                if (!validateTag) {
                    this.$message({
                        message: '请修改不符合规范的数据',
                        type: 'warning'
                    });
                    return;
                }
                this.updateDisabled = true;
                this.$message('当前有' + this.channelList.length + '个轮播频道,大约需要' + this.channelList.length + '秒,请耐心等待');
                // 依次修改轮播频道
                for (let i = 0; i < this.channelList.length; i++) {
                    let newFunction = function () {
                        return (function (i) {
                            that.updateSingleChannel(i);
                        })(i);
                    };
                    setTimeout(newFunction, i * 1000);
                }
            },
            updateSingleChannel(index) {
                let channelInfo = JSON.parse(JSON.stringify(this.channelList[index]));
                delete channelInfo.id;
                delete channelInfo.innerName;
                this.$service.updateChannelPartInfoById({
                    id: this.channelList[index].id,
                    putChannelReq: channelInfo
                }).then(response => {
                    this.finishNo++;
                    if (response && response.code === 0) {
                        this.channelList[index].message = 'OK';
                        this.$message('修改成功');
                    } else {
                        this.failNo++;
                        this.channelList[index].message = '第' + (index + 1) + '个:频道修改失败：' + response.message;
                    }
                    this.tips = '提示：当前一共有' + this.channelList.length + '个轮播频道，已经进行了' + this.finishNo + '个，失败' + this.failNo + '个';
                    this.$set(this.channelList, index, this.channelList[index]);
                    if (this.finishNo === this.channelList.length) {
                        this.updateDisabled = false;
                        this.$message(this.channelList.length + '个轮播频道的修改完成，请查看对应的信息提示');
                    }
                });
            },
            // 验证频道信息
            validateChannel(channel, index) {
                let message = '';
                // 频道id
                if (this.$util.isEmpty(channel.id)) {
                    message = message + '频道id不能为空;';
                }
                // 频道编号
                if (this.$util.isEmpty(channel.no)) {
                    message = message + '频道编号不能为空;';
                } else if (!this.$util.isChannelNo(channel.no)) {
                    message = message + '请填写频道编号数字，例如"001";';
                }
                // 组播地址
                if (this.$util.isEmpty(channel.multicastIp)) {
                    message = message + '组播地址不能为空;';
                } else if (!this.$util.isMulticastIPAddress(channel.multicastIp)) {
                    message = message + '请填写正确的组播地址;';
                }
                // 端口号
                if (this.$util.isEmpty(channel.multicastPort)) {
                    message = message + '端口号不能为空;';
                } else if (!this.$util.isPort(channel.multicastPort)) {
                    message = message + '请填写正确的端口号;';
                }
                // tsId
                if (!this.$util.isEmpty(channel.tsId) && !this.$util.isChannelServiceId(channel.tsId)) {
                    message = message + '请填写正确的serviceId;';
                }
                // serviceId
                if (!this.$util.isEmpty(channel.serviceId) && !this.$util.isChannelServiceId(channel.serviceId)) {
                    message = message + '请填写正确的serviceId;';
                }
                // 所属服务器
                if (this.$util.isEmpty(channel.pushServer)) {
                    message = message + '请填写所属服务器;';
                }
                if (message) {
                    this.channelList[index].message = '第' + (index + 1) + '个:' + message;
                    this.$set(this.channelList, index, this.channelList[index]);
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .import-page-container {
        background: #1A2233;
        min-height: 100%;
        #container {
            height: 100%;
        }
    }

    .left-container {
        padding-top: 80px;
        margin-right: 300px;
        height: 100%;
        .upload-status {
            padding-left: 300px;
            position: fixed;
            top: 0px;
            right: 300px;
            width: 100%;
            z-index: 200;
            height: 80px;
            line-height: 80px;
            text-align: center;
            background: #1A2233;
            > div {
                margin-left: 20px;
                margin-right: 20px;
                border-bottom: 1px solid #3E495E;
            }
            .el-button {
                margin-right: 20px;
            }
            i {
                margin-right: 22px;
                font-size: 24px;
                color: #A8ABB3;
            }
            label {
                font-size: 16px;
                color: #A8ABB3;
                .success-info {
                    color: #3AC26F;
                }
                .fail-info {
                    color: #C35757;
                }
            }
        }
        .main-info {
            position: relative;
            height: 100%;
            padding: 0px 20px;
            background: #1A2233;
            .list-none {
                position: absolute;
                left: 0px;
                right: 0px;
                bottom: 0px;
                top: 0px;
                margin: auto;
                font-size: 24px;
                color: #293550;
                text-align: center;
                img {
                    display: block;
                    width: 368px;
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    top: 0px;
                    margin: auto;
                }
            }
            .info-header {
                height: 70px;
                line-height: 70px;
                font-size: 20px;
                color: #A8ABB3;
                text-align: center;
            }
        }
    }

    .right-container {
        position: fixed;
        top: 0px;
        right: 0px;
        display: flex;
        z-index: 300;
        flex-direction: column;
        height: 100%;
        width: 300px;
        border-left: 1px solid #3E495E;
        background: #1A2233;
        .title {
            flex-grow: 0;
            margin-left: 20px;
            margin-right: 40px;
            height: 80px;
            text-align: center;
            line-height: 80px;
            font-size: 24px;
            color: #A8ABB3;
            border-bottom: 1px solid #3E495E;
        }
        .upload {
            margin-left: 20px;
            .upload-excel {
                margin-top: 140px;
            }
        }
    }

    .operate-item {
        margin-top: 200px;
        padding-bottom: 70px;
        .el-button:last-child {
            margin-left: 40px;
        }
    }

</style>

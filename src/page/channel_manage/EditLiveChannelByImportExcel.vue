<!--导入excel统一批量修改直播频道组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'频道管理'},
            {name:'直播频道批量修改'}]">
        </custom-breadcrumb>
        <div class="import-container">
            <upload-excel-component
                :on-success='handleSuccess'
                :before-upload="beforeUpload">
            </upload-excel-component>
            <el-table
                :data="channelList"
                header-row-class-name="common-table-header"
                border
                highlight-current-row
                style="width: 100%;margin-top:20px;">
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
            <div class="text-left">
                <label class="tips">{{tips}}</label>
            </div>
            <el-button
                v-if="channelList.length !== 0"
                :disabled="updateDisabled"
                @click="UpdateChannels"
                type="primary"
                class="page-main-btn">
                批量修改
            </el-button>
            <el-button
                class="page-main-btn"
                @click="toChannelList">
                返回列表页
            </el-button>
            <div class="operate-item">
                <el-button class="create-blue-btn" @click="exportTemplate">导出所有直播频道</el-button>
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
                finishNo: 0,
                typeOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType({category: 'LIVE'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            // 导出所有直播频道的表格
            exportTemplate() {
                this.$service.getChannelList({category: 'LIVE', pageSize: 2000, pageNum: 0}).then(response => {
                    if (response && response.code === 0) {
                        this.channelAllList = response.data.list;
                        let exportChannelData = [];
                        this.channelAllList.map(channel => {
                            let type = '';
                            for (let i = 0; i < channel.typeList.length; i++) {
                                type = type + '/' + channel.typeList[i].name;
                            }
                            let simpleChannel = {
                                id: channel.id,
                                code: channel.code,
                                name: channel.name,
                                innerName: channel.innerName,
                                no: channel.no,
                                type: type.slice(1),
                                transcribe: channel.record ? '是' : '否',
                                multicastIp: channel.multicastIp,
                                multicastPort: channel.multicastPort,
                                pushServer: channel.pushServer
                            };
                            exportChannelData.push(simpleChannel);
                        });
                        // 目前可以修改的字段有编号、类型、组播地址、端口号、所属服务器、是否录制回看
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, '直播频道批量修改导入表.xlsx');
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
                this.$router.push({name: 'LiveChannelList'});
            },
            reset() {
                this.tips = '';
                this.failNo = 0;
                this.finishNo = 0;
                this.channelList.map(channel => {
                    channel.message = '';
                });
            },
            // 批量修改直播频道
            UpdateChannels() {
                this.reset();
                if (this.channelList.length === 0) {
                    this.$message({
                        message: '当前没有直播频道需要修改',
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
                this.$message('当前有' + this.channelList.length + '个直播频道,大约需要' + this.channelList.length + '秒,请耐心等待');
                // 依次修改直播频道
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
                delete channelInfo.code;
                delete channelInfo.innerName;
                delete channelInfo.name;
                channelInfo.record = channelInfo.transcribe === '是';
                channelInfo.typeList = [];
                // 设置type
                let typeList = channelInfo.type.split('/');
                for (let k = 0; k < typeList.length; k++) {
                    this.typeOptions.map(type => {
                        if (type.name === typeList[k]) {
                            channelInfo.typeList.push(type);
                        }
                    });
                }
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
                    this.tips = '提示：当前一共有' + this.channelList.length + '个直播频道，已经进行了' + this.finishNo + '个，失败' + this.failNo + '个';
                    this.$set(this.channelList, index, this.channelList[index]);
                    if (this.finishNo === this.channelList.length) {
                        this.updateDisabled = false;
                        this.$message(this.channelList.length + '个直播频道的修改完成，请查看对应的信息提示');
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
                // 频道类别
                if (this.$util.isEmpty(channel.type)) {
                    message = message + '请填写频道类别;';
                } else if (!this.isChannelTypeExist(channel.type)) {
                    message = message + '频道类别不存在;';
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
                // 所属服务器，去掉直播频道的pushServer服务器
                // if (this.$util.isEmpty(channel.pushServer)) {
                //     message = message + '请填写所属服务器IP地址;';
                // } else if (!this.$util.isIPAddress(channel.pushServer)) {
                //     message = message + '请填写正确的所属服务器IP地址;';
                // }
                if (channel.transcribe !== '是' && channel.transcribe !== '否') {
                    message = message + '请正确填写是否回看服务;';
                }
                if (message) {
                    this.channelList[index].message = '第' + (index + 1) + '个:' + message;
                    this.$set(this.channelList, index, this.channelList[index]);
                    return false;
                } else {
                    return true;
                }
            },
            // 检测频道的类型是否存在
            isChannelTypeExist(channelType) {
                let typeList = channelType.split('/');
                for (let i = 0; i < typeList.length; i++) {
                    let tag = false;
                    this.typeOptions.map(type => {
                        if (type.name === typeList[i]) {
                            tag = true;
                        }
                    });
                    if (!tag) {
                        return false;
                    }
                }
                return true;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .create-btn {
        margin: 120px 20px 80px 0px;
    }

    .import-container {
        position: relative;
    }

    .operate-item {
        position: absolute;
        top: 10px;
        right: 10px;
    }

</style>

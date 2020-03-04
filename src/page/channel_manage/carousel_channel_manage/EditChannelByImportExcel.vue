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
    // import _ from 'lodash';

    export default {
        name: 'EditChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
                channelAllList: [],
                updateDisabled: false,
                tips: '',
                channelList: [],
                // companyOptions: [],
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
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                // 获取所属区域的数据
                // this.$service.getFilialeList().then(response => {
                //     if (response && response.code === 0) {
                //         this.companyOptions = response.data;
                //     }
                // });
            },
            // 导出所有轮播频道的表格
            exportTemplate() {
                this.$service.getChannelList({category: 'CAROUSEL', pageSize: 2000, pageNum: 0}).then(response => {
                    if (response && response.code === 0) {
                        this.channelAllList = response.data.list;
                        let exportChannelData = [];
                        this.channelAllList.map(channel => {
                            let type = '';
                            for (let i = 0; i < channel.typeList.length; i++) {
                                type = type + '/' + channel.typeList[i].name;
                            }
                            // let company = '';
                            // for (let i = 0; i < channel.companyList.length; i++) {
                            //     company = company + '/' + channel.companyList[i].code;
                            // }
                            let simpleChannel = {
                                id: channel.id,
                                name: channel.name,
                                innerName: channel.innerName,
                                no: channel.no,
                                type: type.slice(1),
                                vip: channel.paymentType === 'VIP' ? '是' : '否',
                                multicastIp: channel.multicastIp,
                                multicastPort: channel.multicastPort,
                                tsId: channel.tsId,
                                serviceId: channel.serviceId,
                                serverGroup: channel.serverGroup,
                                protocol: channel.protocolList ? channel.protocolList.join('/') : ''
                                // publicChannel: channel.common ? '是' : '否',
                                // company: company.slice(1)
                            };
                            exportChannelData.push(simpleChannel);
                        });
                        // 目前可以修改的字段有编号、组播地址、端口号、tsId、serviceId、服务器组
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
                delete channelInfo.name;
                // channelInfo.common = channelInfo.publicChannel === '是';
                channelInfo.paymentType = channelInfo.vip === '是' ? 'VIP' : 'FREE';
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
                // 设置protocolList
                channelInfo.protocolList = channelInfo.protocol.split('/');
                // channelInfo.companyList = [];
                // 设置companyList
                // let companyList = channelInfo.company.split('/');
                // for (let k = 0; k < companyList.length; k++) {
                //     this.companyOptions.map(company => {
                //         if (company.code.toString() === companyList[k]) {
                //             channelInfo.companyList.push(company);
                //         }
                //     });
                // }
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
                // 频道类别
                if (this.$util.isEmpty(channel.type)) {
                    message = message + '请填写频道类别;';
                } else if (!this.isChannelTypeExist(channel.type)) {
                    message = message + '频道类别不存在;';
                }
                // 是否为VIP 会员频道
                if (channel.vip !== '是' && channel.vip !== '否') {
                    message = message + '请正确填写是否为公共频道;';
                }
                // 推流方式
                if (this.$util.isEmpty(channel.protocol)) {
                    message = message + '请填写推流方式;';
                } else if (this.isProtocolTypeExist(channel.protocol)) {
                    message = message + '推流方式不存在;';
                }
                // 是否为公共频道
                // if (channel.publicChannel !== '是' && channel.publicChannel !== '否') {
                //     message = message + '请正确填写是否为公共频道;';
                // }
                // 所属区域，公共频道为'是'，对于区域码不进行验证
                // if (channel.publicChannel === '否') {
                //     if (this.$util.isEmpty(channel.company)) {
                //         message = message + '请填写区域码;';
                //     } else if (this.isCompanyExist(channel.company).length !== 0) {
                //         message = message + '以下区域码不存在：' + this.isCompanyExist(channel.company).toString() + ';';
                //     } else {
                //         // 检查非公共频道下是否区域码设置为全部；全部区域码存在、没有重复的、数量与全部区域码相同
                //         let companyList = channel.company.split('/');
                //         let list = _.uniq(companyList);
                //         if (companyList.length !== list.length) {
                //             message = message + '区域码存在重复;';
                //         } else if (companyList.length === this.companyOptions.length) {
                //             message = message + '公共频道和区域码设置存在冲突;';
                //         }
                //     }
                // }
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
                // 服务器组
                if (this.$util.isEmpty(channel.serverGroup)) {
                    message = message + '请填写服务器组;';
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
            },
            // 检测推流方式是否存在
            isProtocolTypeExist(protocolType) {
                let protocolList = protocolType.split('/');
                let tag = true;
                for (let i = 0; i < protocolList.length; i++) {
                    if (protocolList[i] !== 'UDP' || protocolList[i] !== 'HLS') {
                        tag = false;
                    }
                }
                return tag;
            },
            // 检测区域码是否存在
            isCompanyExist(company) {
                let companyList = company.split('/');
                let errorCodeArray = [];
                for (let i = 0; i < companyList.length; i++) {
                    let tag = false;
                    this.companyOptions.map(company => {
                        if (company.code.toString() === companyList[i]) {
                            tag = true;
                        }
                    });
                    if (!tag) {
                        errorCodeArray.push(companyList[i]);
                    }
                }
                return errorCodeArray;
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
                position: fixed;
                left: 0px;
                right: 320px;
                bottom: 0px;
                top: 80px;
                margin: auto;
                font-size: 24px;
                color: #293550;
                text-align: center;
                border-top: 1px solid #3E495E;
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
                height: 100px;
                line-height: 100px;
                font-size: 20px;
                color: #A8ABB3;
                text-align: center;
                border-top: 1px solid #3E495E;
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

<!--导入excel统一新建频道组件-->
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
                        <i>导入{{currentChannelCategory}}频道</i>
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
                                :disabled="createDisabled"
                                type="primary"
                                @click="createChannels"
                                class="btn-style-two">
                                创建
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
        name: 'CreateChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
                currentChannelCategory: this.$route.params.category === 'LIVE' ? '直播' : '轮播',
                createDisabled: false,
                tips: '',
                channelList: [],
                tableHeader: [],
                typeOptions: [],
                failNo: 0,
                finishNo: 0
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType({category: this.$route.params.category}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            // 导出模板
            exportTemplate() {
                let wb = XLSX.utils.book_new();
                let newWsName = '表1';
                /* make worksheet */
                let wsData;
                if (this.$route.params.category === 'LIVE') {
                    wsData = [{
                        name: '频道名称（20字以内，用于TV端展示）（必填）',
                        innerName: '频道内部名称（20字以内）\n（必填）',
                        no: '频道编号\n' +
                        '（必填）',
                        type: '频道类别（请确保类别已建好）\n' +
                        '（必填）',
                        transcribe: '提供回看服务（必选）',
                        recordIp: '录制组播地址（必填）如果此流为清流，则此字段不用填写。\n' +
                        '如果该频道不录制，此字段也不用填写',
                        recordPort: '录制端口（必填）如果此流为清流，则此字段不用填写。\n' +
                        '如果该频道不录制，此字段也不用填写',
                        multicastIp: '组播地址\n' +
                        '（必填）',
                        multicastPort: '组播端口\n' +
                        '（必填）',
                        pushServer: '所属服务器\n' +
                        '（必填）',
                        logoUri: '频道封面链接\n' +
                        ' 260*260' +
                        '（必填）\n',
                        '备注说明': '1 封面图片不为空即可，可以等频道建好后补充；\n' +
                        '3 导入时请先删除该文本示例数据。'
                    }, {
                        name: 'CCTV1',
                        innerName: 'CCTV1',
                        no: '814',
                        type: '体育',
                        transcribe: '是',
                        recordIp: '232.1.1.2',
                        recordPort: '1234',
                        multicastIp: '232.1.1.2',
                        multicastPort: '1234',
                        pushServer: '192.168.0.2',
                        logoUri: '/image',
                        '备注说明': ''
                    }, {
                        name: '东方卫视',
                        innerName: '东方（上海）卫视',
                        no: '813',
                        type: '娱乐/体育',
                        transcribe: '否',
                        recordIp: '232.1.1.3',
                        recordPort: '1234',
                        multicastIp: '232.1.1.3',
                        multicastPort: '1234',
                        pushServer: '192.168.0.3',
                        logoUri: '/image',
                        '备注说明': ''
                    }, {
                        name: '说明：频道名称用于TV端展示。频道内部名称用于导入节目单时和节目单中的频道名称对应。两者可以相同也可以不同',
                        innerName: '',
                        no: '',
                        type: '',
                        transcribe: '',
                        multicastIp: '',
                        multicastPort: '',
                        pushServer: '',
                        logoUri: '',
                        '备注说明': ''
                    }];
                } else {
                    wsData = [{
                        name: '频道名称（20字以内，用于TV端展示）（必填）',
                        innerName: '频道名称（20字以内）\n（必填）',
                        no: '频道编号\n' +
                        '（必填）',
                        type: '频道类别（请确保类别已建好）\n' +
                        '（必填）',
                        multicastIp: '组播地址\n' +
                        '（必填）',
                        multicastPort: '组播端口\n' +
                        '（必填）',
                        tsId: 'tsid',
                        serviceId: 'serviceId',
                        pushServer: '所属服务器\n' +
                        '（必填）',
                        logoUri: '频道封面链接\n' +
                        ' 260*260' +
                        '（必填）\n',
                        '备注说明': '1 封面图片不为空即可，可以等频道建好后补充；\n' +
                        '2 导入或新建的频道默认为禁播状态；\n' +
                        '3 导入时请先删除该文本示例数据。'
                    }, {
                        name: '新片速递',
                        innerName: '新片速递',
                        no: '814',
                        type: '体育',
                        multicastIp: '232.1.1.2',
                        multicastPort: '1234',
                        tsId: '202',
                        serviceId: '2002',
                        pushServer: '192.168.0.2',
                        logoUri: '/image',
                        '备注说明': ''
                    }, {
                        name: '射雕英雄传剧场',
                        innerName: '射雕英雄传剧场',
                        no: '813',
                        type: '娱乐/体育',
                        multicastIp: '232.1.1.3',
                        multicastPort: '1234',
                        tsId: '203',
                        serviceId: '2003',
                        pushServer: '192.168.0.3',
                        logoUri: '/image',
                        '备注说明': ''
                    }];
                }
                let ws = XLSX.utils.json_to_sheet(wsData);
                /* Add the worksheet to the workbook */
                XLSX.utils.book_append_sheet(wb, ws, newWsName);
                XLSX.writeFile(wb, this.currentChannelCategory + '频道批量创建导入表.xlsx');
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
                this.$router.push({name: this.$route.params.category === 'LIVE' ? 'LiveChannelList' : 'CarouselChannelList'});
            },
            reset() {
                this.tips = '';
                this.failNo = 0;
                this.finishNo = 0;
                this.channelList.map(channel => {
                    channel.message = '';
                });
            },
            // 批量创建频道
            createChannels() {
                this.reset();
                if (this.channelList.length === 0) {
                    this.$message({
                        message: '当前没有' + this.currentChannelCategory + '频道需要创建',
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
                this.createDisabled = true;
                // 对每一项进行设置
                for (let i = 0; i < this.channelList.length; i++) {
                    this.channelList[i].typeList = [];
                    // 设置type
                    let typeList = this.channelList[i].type.split('/');
                    for (let k = 0; k < typeList.length; k++) {
                        this.typeOptions.map(type => {
                            if (type.name === typeList[k]) {
                                this.channelList[i].typeList.push(type);
                            }
                        });
                    }
                    // 设置是否回看
                    if (this.$route.params.category === 'LIVE') {
                        this.channelList[i].record = this.channelList[i].transcribe === '是';
                    } else {
                        this.channelList[i].record = false;
                    }
                    this.channelList[i].category = this.$route.params.category;
                    this.channelList[i].visible = false;
                }
                this.$message('当前有' + this.channelList.length + '个' + this.currentChannelCategory + '频道,大约需要' + this.channelList.length + '秒,请耐心等待');
                // 依次创建频道
                for (let i = 0; i < this.channelList.length; i++) {
                    let newFunction = function () {
                        return (function (i) {
                            that.createSingleChannel(i);
                        })(i);
                    };
                    setTimeout(newFunction, i * 1000);
                }
            },
            // 创建直播或轮播频道
            createSingleChannel(index) {
                this.$service.createChannels(this.channelList[index]).then(response => {
                    this.finishNo++;
                    if (response && response.code === 0) {
                        this.channelList[index].message = 'OK';
                        this.$message('创建成功');
                    } else {
                        this.failNo++;
                        this.channelList[index].message = '第' + (index + 1) + '个:频道创建失败：' + response.message;
                    }
                    this.tips = '共' + this.channelList.length + '条' + this.currentChannelCategory + '频道，进行了' + this.finishNo + '条，失败' + this.failNo + '个';
                    this.$set(this.channelList, index, this.channelList[index]);
                    if (this.finishNo === this.channelList.length) {
                        this.createDisabled = false;
                        this.$message(this.channelList.length + '个' + this.currentChannelCategory + '频道的创建完成，请查看对应的信息提示');
                    }
                });
            },
            // 验证频道信息
            validateChannel(channel, index) {
                let message = '';
                if (this.$util.isEmpty(channel.name)) {
                    message = message + '频道展示名称不能为空;';
                } else if (this.$util.trim(channel.name).length > 20) {
                    message = message + '频道展示名称不能超过20个字;';
                }
                // 验证名称
                if (this.$util.isEmpty(channel.innerName)) {
                    message = message + '频道名称不能为空;';
                } else if (this.$util.trim(channel.innerName).length > 20) {
                    message = message + '频道名称不能超过20个字;';
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
                // 只有直播频道含有回看服务以及录制Ip、录制端口
                if (this.$route.params.category === 'LIVE') {
                    if (channel.transcribe !== '是' && channel.transcribe !== '否') {
                        message = message + '请正确填写是否回看服务;';
                    }
                    // 录制IP
                    if (this.$util.isEmpty(channel.recordIp)) {
                        message = message + '录制IP不能为空;';
                    } else if (!this.$util.isMulticastIPAddress(channel.recordIp)) {
                        message = message + '请填写正确的录制IP;';
                    }
                    // 录制端口号
                    if (this.$util.isEmpty(channel.recordPort)) {
                        message = message + '录制端口号不能为空;';
                    } else if (!this.$util.isPort(channel.recordPort)) {
                        message = message + '请填写正确的录制端口号;';
                    }
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
                // 只有轮播频道含有tsId和serviceId
                if (this.$route.params.category === 'CAROUSEL') {
                    // tsId
                    if (!this.$util.isEmpty(channel.tsId) && !this.$util.isChannelServiceId(channel.tsId)) {
                        message = message + '请填写正确的serviceId;';
                    }
                    // serviceId
                    if (!this.$util.isEmpty(channel.serviceId) && !this.$util.isChannelServiceId(channel.serviceId)) {
                        message = message + '请填写正确的serviceId;';
                    }
                }
                // 所属服务器，只对轮播、直播都不验证
                // 频道封面
                if (this.$util.isEmpty(channel.logoUri)) {
                    message = message + '请设置频道的封面图片;';
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

    .import-page-container {
        background: #1A2233;
        min-height: 100%;
        #container {
            height: 100%;
        }
    }

    .left-container {
        position: relative;
        padding-top: 80px;
        padding-bottom: 80px;
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

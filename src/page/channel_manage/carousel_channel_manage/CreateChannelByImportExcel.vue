<!--导入excel统一新建频道组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'频道管理'},
            {name:'轮播-批量创建'}]">
        </custom-breadcrumb>
        <upload-excel-component
            :on-success='handleSuccess'
            :before-upload="beforeUpload">
        </upload-excel-component>
        <el-table :data="channelList"
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
            :disabled="createDisabled"
            @click="createChannels"
            type="primary"
            class="create-btn">
            创建{{channelList.length}}个轮播频道
        </el-button>
        <el-button
            @click="toChannelList"
            type="primary"
            class="create-btn">
            返回轮播频道列表页面
        </el-button>
    </div>
</template>

<script>
    import UploadExcelComponent from './UploadExcel';

    export default {
        name: 'CreateChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
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
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
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
            // 批量创建轮播频道
            createChannels() {
                this.reset();
                if (this.channelList.length === 0) {
                    this.$message({
                        message: '当前没有轮播频道需要创建',
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
                    this.typeOptions.map(type => {
                        if (type.name === this.channelList[i].type) {
                            this.channelList[i].typeList = [type];
                        }
                    });
                    this.channelList[i].category = 'CAROUSEL';
                    this.channelList[i].visible = false;
                }
                this.$message('当前有' + this.channelList.length + '个轮播频道,大约需要' + this.channelList.length + '秒,请耐心等待');
                // 依次创建轮播频道
                for (let i = 0; i < this.channelList.length; i++) {
                    let newFunction = function () {
                        return (function (i) {
                            that.createSingleChannel(i);
                        })(i);
                    };
                    setTimeout(newFunction, i * 1000);
                }
            },
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
                    this.tips = '提示：当前一共有' + this.channelList.length + '个轮播频道，已经进行了' + this.finishNo + '个，失败' + this.failNo + '个';
                    this.$set(this.channelList, index, this.channelList[index]);
                    if (this.finishNo === this.channelList.length) {
                        this.createDisabled = false;
                        this.$message(this.channelList.length + '个轮播频道的创建完成，请查看对应的信息提示');
                    }
                });
            },
            // 验证频道信息
            validateChannel(channel, index) {
                let message = '';
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
                    message = message + '请填写所属服务器IP地址;';
                } else if (!this.$util.isIPAddress(channel.pushServer)) {
                    message = message + '请填写正确的所属服务器IP地址;';
                }
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
                let tag = false;
                this.typeOptions.map(type => {
                    if (type.name === channelType) {
                        tag = true;
                    }
                });
                return tag;
            }
        }
    };
</script>

<style lang="scss" scoped>

    .create-btn {
        margin: 120px 30px 80px 0px;
    }

</style>

<!--导入excel统一新建频道组件-->
<template>
    <div class="app-container">
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
                v-for='item of tableHeader'
                :prop="item"
                :label="item"
                :key='item'>
            </el-table-column>
        </el-table>
        <el-button @click="createChannels" type="primary" class="create-btn">创建{{channelList.length}}个轮播频道
        </el-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import UploadExcelComponent from './UploadExcel';

    export default {
        name: 'CreateChannelByImportExcel',
        components: {UploadExcelComponent},
        data() {
            return {
                channelList: [],
                tableHeader: [],
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
            },
            beforeUpload() {
                return true;
            },
            handleSuccess({results, header}) {
                this.channelList = results;
                this.tableHeader = header;
            },
            // 批量创建轮播频道
            createChannels() {
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
                    for (let i = 0; i < this.channelList.length; i++) {
                        Vue.set(this.channelList, i, this.channelList[i]);
                    }
                    console.log(this.channelList);
                    return;
                }
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
                // 依次创建轮播频道
                for (let i = 0; i < this.channelList.length; i++) {
                    this.$service.createChannels(this.channelList[i]).then(response => {
                        if (response && response.code === 0) {
                        } else {
                            this.channelList[i].message = '第' + (i + 1) + '个频道创建失败：' + response.message;
                        }
                    });
                }
            },
            // 验证频道信息
            validateChannel(channel, index) {
                let message = '';
                // 验证名称
                if (this.$util.isEmpty(channel.innerName)) {
                    message = message + '频道名称不能为空;';
                } else if (this.$util.trim(channel.innerName).length > 10) {
                    message = message + '频道名称不能超过10个字;';
                }
                // 频道编号
                if (this.$util.isEmpty(channel.no)) {
                    message = message + '频道编号不能为空;';
                } else if (!this.$util.isChannelNo(channel.no)) {
                    message = message + '请填写三位频道编号数字，例如"001";';
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
                    this.channelList[index].message = '第' + (index + 1) + '个' + message;
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
        margin: 120px 80px;
    }

</style>

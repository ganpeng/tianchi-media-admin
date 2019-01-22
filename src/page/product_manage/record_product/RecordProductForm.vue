<!--直播回看包表单组件-->
<template>
    <div class="text-left product-container">
        <el-form
            :model="productInfo"
            :rules="infoRules"
            status-icon
            ref="productInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="类型" prop="category">
                <label class="product-category">直播回看包</label>
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
                <el-input
                    v-model="productInfo.name"
                    size="medium"
                    placeholder="请填写30个字以内的名称">
                </el-input>
            </el-form-item>
            <el-form-item label="简介" prop="description">
                <el-input
                    v-model="productInfo.description"
                    placeholder="请填写100个字以内的简介"
                    type="textarea"
                    :rows="4">
                </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="productInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="seperator-line"></div>
        <!--添加轮播频道-->
        <div class="content-sub-title">添加直播回看频道</div>
        <select-multiple-live-channel
            :selectedChannelList="selectedChannelList"
            ref="selectMultipleChannel"
            v-on:setChannel="setChannel">
        </select-multiple-live-channel>
        <div class="seperator-line select-line"></div>
        <!--已选直播回看频道-->
        <h3 class="content-sub-title">已选直播回看频道</h3>
        <el-table
            :data="selectedChannelList"
            header-row-class-name="common-table-header"
            row-class-name=channel-row
            border
            style="width: 100%">
            <el-table-column prop="code" align="center" width="60px" label="序号">
                <template slot-scope="scope">
                    <span>
                        {{scope.$index + 1}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="code" align="center" width="120px" label="直播频道编号">
            </el-table-column>
            <el-table-column
                prop="no" align="center" width="140px" label="直播频道展示编号">
            </el-table-column>
            <el-table-column prop="innerName" align="center" width="120px" label="直播频道名称">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.innerName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="120px" label="直播频道展示名">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="type" width="120px" align="center" label="频道类别">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.typeList | getTypeName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="multicastIp" width="150px" align="center" label="频道IP">
            </el-table-column>
            <el-table-column
                prop="multicastPort" width="100px" align="center" label="频道端口">
            </el-table-column>
            <el-table-column
                prop="pushServer" align="center" label="所属服务器">
            </el-table-column>
            <el-table-column align="center" label="是否录制回看">
                <template slot-scope="scope">
                    {{scope.row.record ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="videoPid" align="center" label="videoPid">
                <template slot-scope="scope">
                    {{scope.row.videoPid | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column prop="audioPid" align="center" label="audioPid">
                <template slot-scope="scope">
                    {{scope.row.audioPid | padEmpty}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="remove-btn"
                               @click="removeChannel(scope.$index)">
                        取消关联
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateProduct">保存</el-button>
            <el-button class="btn-style-three" @click="toProductList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import SelectMultipleLiveChannel from './SelectMultipleLiveChannel';

    export default {
        name: 'RecordProductForm',
        // status为'EDIT_PRODUCT'代表编辑，'CREATE_PRODUCT'代表创建
        props: {
            status: {
                type: String,
                required: true
            }
        },
        components: {
            SelectMultipleLiveChannel
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('产品包名称不能为空'));
                } else if (this.$util.trim(value).length > 30) {
                    return callback(new Error('产品包名称不能超过30字'));
                } else {
                    callback();
                }
            };
            let checkDescription = (rule, value, callback) => {
                if (this.$util.trim(value).length > 100) {
                    return callback(new Error('产品包描述不能超过100字'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择产品包状态'));
                } else {
                    callback();
                }
            };
            return {
                productInfo: {
                    id: '',
                    category: 'RECORD',
                    name: '',
                    description: '',
                    contentIdList: []
                },
                selectedChannelList: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDescription, trigger: 'blur'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'change'}
                    ]
                }
            };
        },
        filters: {
            getTypeName: function (typeList) {
                let name = '';
                typeList.map(type => {
                    name = '、' + name + type.name;
                });
                return name.slice(1);
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                this.$util.toggleFixedBtnContainer();
                if (this.status === 'CREATE_PRODUCT') {
                    this.$nextTick(function () {
                        this.$refs.selectMultipleChannel.init();
                    });
                }
                if (this.status === 'EDIT_PRODUCT') {
                    // 获取基本信息
                    this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                        if (response && response.code === 0) {
                            this.productInfo = response.data;
                        }
                    });
                    // 获取内容列表
                    this.$service.getRecordProductContentList({
                        id: this.$route.params.id,
                        pageNum: 1,
                        pageSize: 1000
                    }).then(response => {
                        if (response && response.code === 0) {
                            this.selectedChannelList = response.data.list;
                            this.$nextTick(function () {
                                this.$refs.selectMultipleChannel.init();
                            });
                        }
                    });
                }
            },
            // 创建或更新产品包
            operateProduct() {
                this.$refs['productInfo'].validate((valid) => {
                    if (valid) {
                        // 设置contentIdList
                        this.productInfo.contentIdList = [];
                        this.selectedChannelList.map(channel => {
                            this.productInfo.contentIdList.push(channel.id);
                        });
                        // 创建产品包
                        if (this.status === 'CREATE_PRODUCT') {
                            this.$service.createProduct(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建直播回看包');
                                    this.toProductList();
                                }
                            });
                        } else {
                            // 更新产品包
                            this.productInfo.id = this.$route.params.id;
                            this.$service.updateProductInfo(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新产品包');
                                    this.toProductList();
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 删除选中的直播频道
            removeChannel(index) {
                let removedRow = this.selectedChannelList.splice(index, 1)[0];
                this.$refs.selectMultipleChannel.cancelSelectRow(removedRow);
                this.$message.success('"' + removedRow.name + '"' + '频道成功取消关联');
            },
            // 设置选择的直播频道
            setChannel(selectedChannels) {
                this.selectedChannelList = [];
                for (let i = 0; i < selectedChannels.length; i++) {
                    this.selectedChannelList.push(selectedChannels[i]);
                }
            },
            reset() {
                this.$refs['productInfo'].resetFields();
            },
            toProductList() {
                this.$router.push({name: 'ProductList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form {
        margin-bottom: 40px;
    }

    .product-container {
        margin-top: 30px;
    }

    .select-line {
        margin-top: 30px;
    }

    .product-category {
        color: #fff;
    }

    .el-table {
        margin-bottom: 80px;
        .remove-btn {
            font-size: 14px;
            color: #C35757;
        }
    }
</style>

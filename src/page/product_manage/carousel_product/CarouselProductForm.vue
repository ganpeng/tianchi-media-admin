<!--轮播频道包表单组件-->
<template>
    <div class="text-left">
        <el-form
            :model="productInfo"
            :rules="infoRules"
            status-icon
            ref="productInfo"
            label-width="120px"
            class="form-block fill-form">
            <el-form-item label="类型" prop="category">
                轮播频道包
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
                <el-input v-model="productInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="description">
                <el-input
                    v-model="productInfo.description"
                    placeholder="请填写100个字以内的简介"
                    type="textarea"
                    :rows="4">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="block-box text-left">
            <div class="block-title">添加轮播频道</div>
            <select-multiple-carousel-channel
                :selectedChannelList="selectedChannelList"
                ref="selectMultipleChannel"
                v-on:setChannel="setChannel">
            </select-multiple-carousel-channel>
            <div class="vice-block">
                <h3 class="block-vice-title">已选轮播频道</h3>
                <el-table
                    :data="selectedChannelList"
                    header-row-class-name="common-table-header"
                    row-class-name=channel-row
                    border
                    style="width: 100%">
                    <el-table-column
                        width="60px"
                        align="center"
                        label="序号">
                        <template slot-scope="scope">
                            <label>{{scope.$index + 1}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="no"
                        width="80px"
                        align="center"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        prop="innerName"
                        width="200px"
                        align="center"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        label="类别">
                        <template slot-scope="scope">
                            <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="multicastIp"
                        label="组播地址">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="80px"
                        prop="multicastPort"
                        label="端口号">
                    </el-table-column>
                    <!--tsId-->
                    <el-table-column
                        align="center"
                        prop="tsId"
                        label="tsId">
                        <template slot-scope="scope">
                            <label>{{scope.row.tsId ? scope.row.tsId : '------'}}</label>
                        </template>
                    </el-table-column>
                    <!--serviceId-->
                    <el-table-column
                        align="center"
                        prop="serviceId"
                        label="serviceId">
                        <template slot-scope="scope">
                            <label>{{scope.row.serviceId ? scope.row.serviceId : '------'}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="pushServer"
                        label="所属服务器">
                        <template slot-scope="scope">
                            <label>{{scope.row.pushServer ? scope.row.pushServer : '------'}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="80px"
                        label="状态">
                        <template slot-scope="scope">
                            <i class="status-normal" v-if="scope.row.visible">正常</i>
                            <i class="status-abnormal" v-else>禁播</i>
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
            </div>
        </div>
        <div class="operate">
            <el-button type="primary" @click="operateProduct" class="page-main-btn">
                {{this.status === '0' ? '创建' : '保存'}}
            </el-button>
            <el-button @click="reset"
                       v-if="this.status === '0' || this.status === '1' "
                       class="page-main-btn"
                       type="primary"
                       plain>
                重置
            </el-button>
            <el-button @click="toProductList" class="page-main-btn">返回列表页</el-button>
        </div>
    </div>
</template>

<script>
    import SelectMultipleCarouselChannel from './SelectMultipleCarouselChannel';

    export default {
        name: 'CreateCarouselProductForm',
        // status为1代表编辑，0代表创建
        props: {
            status: {
                type: String,
                require: true
            }
        },
        components: {
            SelectMultipleCarouselChannel
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
            return {
                productInfo: {
                    id: '',
                    category: 'CAROUSEL',
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
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
                if (this.status === '0') {
                    this.$nextTick(function () {
                        this.$refs.selectMultipleChannel.init();
                    });
                }
                if (this.status === '1') {
                    this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                        if (response && response.code === 0) {
                            this.productInfo = response.data;
                        }
                    });
                    this.$service.getCarouselProductContentList({
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
                        if (this.status === '0') {
                            this.$service.createProduct(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建轮播频道包');
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
            // 删除选中的轮播频道
            removeChannel(index) {
                let removedRow = this.selectedChannelList.splice(index, 1)[0];
                this.$refs.selectMultipleChannel.cancelSelectRow(removedRow);
                this.$message.success('"' + removedRow.name + '"' + '频道成功取消关联');
            },
            // 设置选择的轮播频道
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

    .operate {
        margin-top: 200px;
        margin-bottom: 80px;
        text-align: center;
    }

    .el-table {
        margin: 0px;
        .remove-btn {
            color: $baseRed;
        }
        img {
            width: 70px;
        }
    }

</style>

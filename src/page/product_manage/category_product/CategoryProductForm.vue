<!--类别产品包表单组件-->
<template>
    <div class="text-left">
        <el-form :model="productInfo"
                 :rules="infoRules"
                 status-icon
                 ref="productInfo"
                 label-width="120px"
                 class="form-block fill-form">
            <el-form-item label="类型" prop="category">
                类别包
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
                <el-input v-model="productInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="desc">
                <el-input
                    v-model="productInfo.desc"
                    placeholder="请填写100个字以内的简介"
                    type="textarea"
                    :rows="4">
                </el-input>
            </el-form-item>
            <el-form-item label="类型" prop="targetIdList" required>
                <el-select
                    v-model="productInfo.targetIdList"
                    multiple
                    filterable
                    clearable
                    placeholder="请选择类型">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
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
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'CategoryProductForm',
        // status为1代表编辑，0代表创建
        props: {
            status: {
                type: String,
                required: true
            }
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
            let checkDesc = (rule, value, callback) => {
                if (this.$util.trim(value).length > 100) {
                    return callback(new Error('产品包描述不能超过100字'));
                } else {
                    callback();
                }
            };
            let checkTargetIdList = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('类型不能为空'));
                } else {
                    callback();
                }
            };
            return {
                productInfo: {
                    id: '',
                    category: 'PROGRAMME_CATEGORY',
                    name: '',
                    desc: '',
                    targetIdList: []
                },
                categoryOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    targetIdList: [
                        {validator: checkTargetIdList, trigger: 'change'}
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
                // 初始化类别列表
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
                if (this.status === '1') {
                    this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                        if (response && response.code === 0) {
                            this.productInfo = response.data;
                        }
                    });
                }
            },
            // 创建或更新产品包
            operateProduct() {
                this.$refs['productInfo'].validate((valid) => {
                    if (valid) {
                        // 创建产品包
                        if (this.status === '0') {
                            this.$service.createProduct(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功创建类别包');
                                    this.toProductList();
                                }
                            });
                        } else {
                            // 更新产品包
                            this.$service.updateProductInfo(this.productInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message.success('成功更新产品包信息');
                                    this.toProductList();
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
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
    }

</style>

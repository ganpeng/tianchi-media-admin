<!--类别产品包表单组件-->
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
                <label class="product-category">类别包</label>
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
            <el-form-item label="类别" prop="contentIdList" required>
                <el-select
                    v-model="productInfo.contentIdList"
                    multiple
                    size="medium"
                    clearable
                    placeholder="请选择类别">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="productInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="operateProduct">保存</el-button>
            <el-button class="btn-style-three" @click="toProductList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'CategoryProductForm',
        // status为'EDIT_PRODUCT'代表编辑，'CREATE_PRODUCT'代表创建
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
            let checkDescription = (rule, value, callback) => {
                if (this.$util.trim(value).length > 100) {
                    return callback(new Error('产品包描述不能超过100字'));
                } else {
                    callback();
                }
            };
            let checkTargetIdList = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('类别不能为空'));
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
                    category: 'PROGRAMME_CATEGORY',
                    name: '',
                    description: '',
                    contentIdList: []
                },
                categoryOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDescription, trigger: 'blur'}
                    ],
                    contentIdList: [
                        {validator: checkTargetIdList, trigger: 'change'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'change'}
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
                this.$util.toggleFixedBtnContainer();
                // 初始化类别列表
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
                if (this.status === 'EDIT_PRODUCT') {
                    this.$service.getProductInfo({id: this.$route.params.id}).then(response => {
                        if (response && response.code === 0) {
                            if (!response.data.contentIdList) {
                                response.data.contentIdList = [];
                            }
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
                        if (this.status === 'CREATE_PRODUCT') {
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
            toProductList() {
                this.$router.push({name: 'ProductList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .product-container {
        margin-top: 30px;
    }

    .product-category {
        color: #fff;
    }

</style>

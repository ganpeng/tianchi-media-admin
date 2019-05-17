<!--商品表单页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="goodsInfo"
            :model="goodsInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="商品名称" prop="name" required>
                <el-input
                    v-model="goodsInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的商品名称">
                </el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description" required>
                <el-input
                    v-model="goodsInfo.description"
                    size="medium"
                    type="textarea"
                    :maxlength="300"
                    :rows="8"
                    placeholder="请填写商品描述，不超过300字">
                </el-input>
                <label class="textarea-tip">已输入{{goodsInfo.description ? goodsInfo.description.length :
                    '0'}}/300字</label>
            </el-form-item>
            <el-form-item label="商品金额" prop="price" required>
                <el-input
                    @blur="fixGoodsPrice"
                    v-model="goodsInfo.price"
                    size="medium"
                    type="number"
                    clearable
                    placeholder="请填写商品包金额，保留小数点后两位">
                </el-input>
            </el-form-item>
            <el-form-item label="时长" prop="validityDays" required>
                <el-select
                    v-model="goodsInfo.validityDays"
                    size="medium"
                    placeholder="请选择时长">
                    <el-option
                        v-for="item in validityDaysOptions"
                        :key="item.day"
                        :label="item.name"
                        :value="item.day">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品包" prop="productList" required>
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in goodsInfo.productList"
                        closable
                        @close="removeProduct(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择商品包含的产品包"
                    @blur="validateProductList"
                    @select="setProducts">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="goodsInfo.productList.length !== 0"
                       slot="suffix"
                       @click="removeAllProduct"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="goodsInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveGoodsInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toGoodsList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: 'GoodsForm',
        props: {
            // 创建：'CREATE_GOODS'，编辑：'EDIT_GOODS'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_GOODS';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('商品名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('商品名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkDesc = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写广告描述'));
                } else if (this.$util.trim(value).length > 300) {
                    return callback(new Error('广告描述不能超过300字'));
                } else {
                    callback();
                }
            };
            let checkPrice = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写商品金额'));
                } else {
                    callback();
                }
            };
            let checkValidityDays = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择商品时长'));
                } else {
                    callback();
                }
            };
            let checkProductList = (rule, value, callback) => {
                if (this.goodsInfo.productList.length === 0) {
                    return callback(new Error('请选择商品包含的产品包'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择商品状态'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                goodsInfo: {
                    name: '',
                    description: '',
                    price: '',
                    validityDays: '',
                    productList: [],
                    visible: false
                },
                validityDaysOptions: [{
                    name: '1个月',
                    day: 30
                }, {
                    name: '3个月',
                    day: 90
                }, {
                    name: '6个月',
                    day: 180
                }, {
                    name: '1年',
                    day: 365
                }],
                productOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    description: [
                        {validator: checkDesc, trigger: 'blur'}
                    ],
                    price: [
                        {validator: checkPrice, trigger: 'blur'}
                    ],
                    validityDays: [
                        {validator: checkValidityDays, trigger: 'blur'}
                    ],
                    productList: [
                        {validator: checkProductList, trigger: 'blur'}
                    ],
                    visible: [
                        {validator: checkVisible, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            fixGoodsPrice() {
                this.goodsInfo.price = parseFloat(this.goodsInfo.price).toFixed(2);
            },
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getProductList({
                    pageNum: 1,
                    pageSize: 10000,
                    orderList: 'ID_DESC'
                }).then(response => {
                    if (response && response.code === 0) {
                        this.productOptions = response.data.list;
                        this.productOptions.unshift({id: '0', name: '全选'});
                    }
                });
                if (this.status === 'EDIT_GOODS') {
                    this.getGoodsDetail();
                }
            },
            getGoodsDetail() {
                this.$service.getGoodsDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.goodsInfo[key] = response.data[key];
                        }
                        this.goodsInfo.price = response.data.price / 100;
                    }
                });
            },
            validateProductList() {
                this.$refs['goodsInfo'].validateField('productList');
            },
            removeAllProduct() {
                this.goodsInfo.productList.splice(0);
                this.validateProductList();
            },
            removeProduct(product, index) {
                this.goodsInfo.productList.splice(index, 1);
                this.validateProductList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.productOptions.filter(this.createFilter(queryString)) : this.productOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (productOptions) => {
                    return (productOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置频道，对全选进行处理
            setProducts(item) {
                // 对全选进行处理
                if (item.name === '全选') {
                    this.goodsInfo.productList.splice(0);
                    this.productOptions.map(product => {
                        if (product.name !== '全选') {
                            this.goodsInfo.productList.push(product);
                        }
                    });
                } else {
                    // 对非全选进行处理
                    this.goodsInfo.productList.push({
                        id: item.id,
                        name: item.name
                    });
                    this.goodsInfo.productList = _.uniqBy(this.goodsInfo.productList, 'id');
                }
                this.validateProductList();
            },
            // 保存
            saveGoodsInfo() {
                this.$refs['goodsInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_GOODS':
                                this.$service.createGoods(this.goodsInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建商品');
                                        this.toGoodsList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_GOODS':
                                this.$service.updateGoodsInfo(this.goodsInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存商品信息成功');
                                        this.toGoodsList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toGoodsList() {
                this.$router.push({name: 'GoodsList'});
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>

    .el-form {
        margin-top: 20px;
    }

    .textarea-tip {
        position: relative;
        right: 96px;
        top: 4px;
        color: #1989FA;
        font-size: 10px;
    }

    .my-tags {
        max-width: 1050px;
    }

</style>

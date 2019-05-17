<!--套餐表单页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="comboInfo"
            :model="comboInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="套餐名称" prop="name" required>
                <el-input
                    v-model="comboInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的套餐名称">
                </el-input>
            </el-form-item>
            <el-form-item label="套餐描述" prop="description" required>
                <el-input
                    v-model="comboInfo.description"
                    size="medium"
                    type="textarea"
                    :maxlength="300"
                    :rows="8"
                    placeholder="请填写套餐描述，不超过300字">
                </el-input>
                <label class="textarea-tip">已输入{{comboInfo.description ? comboInfo.description.length :
                    '0'}}/300字</label>
            </el-form-item>
            <el-form-item label="套餐金额" prop="price" required>
                <el-input
                    @blur="fixComboPrice"
                    v-model="comboInfo.price"
                    size="medium"
                    type="number"
                    clearable
                    placeholder="请填写套餐包金额，保留小数点后两位">
                </el-input>
            </el-form-item>
            <el-form-item label="时长" prop="validityDays" required>
                <el-select
                    v-model="comboInfo.validityDays"
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
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="comboInfo.visible">
                    <el-radio :label="true">上架</el-radio>
                    <el-radio :label="false">下架</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveComboInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toComboList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ComboForm',
        props: {
            // 创建：'CREATE_COMBO'，编辑：'EDIT_COMBO'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_COMBO';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('套餐名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('套餐名称不能超过20个字'));
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
                    return callback(new Error('请填写套餐金额'));
                } else {
                    callback();
                }
            };
            let checkValidityDays = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择套餐时长'));
                } else {
                    callback();
                }
            };
            let checkVisible = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择套餐状态'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                comboInfo: {
                    name: '',
                    description: '',
                    price: '',
                    validityDays: '',
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
            fixComboPrice() {
                this.comboInfo.price = parseFloat(this.comboInfo.price).toFixed(2);
            },
            init() {
                this.$util.toggleFixedBtnContainer();
                if (this.status === 'EDIT_COMBO') {
                    this.getComboDetail();
                }
            },
            getComboDetail() {
                this.$service.getComboDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.comboInfo[key] = response.data[key];
                        }
                        this.comboInfo.price = response.data.price / 100;
                    }
                });
            },
            saveComboInfo() {
                this.$refs['comboInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_COMBO':
                                this.$service.createCombo(this.comboInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建套餐');
                                        this.toComboList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_COMBO':
                                this.$service.updateComboInfo(this.comboInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存套餐信息成功');
                                        this.toComboList();
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
            toComboList() {
                this.$router.push({name: 'ComboList'});
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

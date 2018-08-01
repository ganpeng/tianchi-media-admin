<!--专题基本信息表单组件-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户中心</el-breadcrumb-item>
            <el-breadcrumb-item v-if="status === '0'">创建用户</el-breadcrumb-item>
            <el-breadcrumb-item v-else>编辑用户信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="userInfo"
                 :rules="infoRules"
                 status-icon
                 ref="userInfo"
                 label-width="90px"
                 class="form-block">
            <el-form-item label="姓名" prop="name" required>
                <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="nationalId" required>
                <el-input v-model="userInfo.nationalId" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="checkNationalId" type="primary" plain>验证身份证号</el-button>
                <el-button @click="toEditUserInfo" type="primary" plain>当前身份证号用户信息编辑页面</el-button>
            </el-form-item>
            <el-form-item :label="'设备ID' + (index + 1)"
                          props="deviceIdList"
                          v-for="(item, index) in userInfo.deviceIdList"
                          :key="index"
                          required>
                <el-input v-model="item.id" placeholder="请输入设备ID"></el-input>
                <el-button v-if="userInfo.deviceIdList.length > 1" plain @click="removeDevice(index)">删除设备</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addDevice" type="primary" plain>添加设备</el-button>
            </el-form-item>
            <el-form-item label="省份" prop="province" required>
                <el-select v-model="userInfo.province" placeholder="请选择省份" clearable>
                    <el-option
                        v-for="item in provinceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="city" required>
                <el-select v-model="userInfo.city" placeholder="请选择城市" clearable>
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="县区" prop="county" required>
                <el-select v-model="userInfo.county" placeholder="请选择县区" clearable>
                    <el-option
                        v-for="item in countyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇/街道" prop="town" required>
                <el-select v-model="userInfo.town" placeholder="请选择乡镇/街道" clearable>
                    <el-option
                        v-for="item in townOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="address" required>
                <el-input v-model="userInfo.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
                <el-input v-model="userInfo.telephone" placeholder="请输入固定电话号码"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile" required>
                <el-input v-model="userInfo.mobile" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item class="tips">
                <label class="tips">带 <i>*</i> 号的为必填项</label>
            </el-form-item>
            <el-form-item class="operate">
                <el-button type="primary" @click="operateUser">{{status === '0' ? '创建' : '更新'}}</el-button>
                <el-button @click="reset">重 置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'CreateUser',
        props: {
            status: {
                type: String,
                default: '0'
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('姓名不能为空'));
                } else {
                    callback();
                }
            };
            let checkNationalId = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('身份证号不能为空'));
                } else if (!this.$util.isNationalId(value)) {
                    return callback(new Error('请填写正确的身份证号'));
                } else {
                    callback();
                }
            };
            let checkDeviceIdList = (rule, value, callback) => {
                let sign = true;
                for (let i = 0; i < value.length; i++) {
                    if (!value[i].id) {
                        sign = false;
                    }
                }
                if (sign) {
                    callback();
                } else {
                    return callback(new Error('设备编号不能为空'));
                }
            };
            let checkProvince = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择省份'));
                } else {
                    callback();
                }
            };
            let checkCity = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择城市'));
                } else {
                    callback();
                }
            };
            let checkCounty = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择县区'));
                } else {
                    callback();
                }
            };
            let checkTown = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请选择乡镇/街道'));
                } else {
                    callback();
                }
            };
            let checkAddress = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写详细地址'));
                } else {
                    callback();
                }
            };
            let checkTelephone = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isTelephone(value)) {
                    return callback(new Error('请填写正确的电话号码'));
                } else {
                    callback();
                }
            };
            let checkMobile = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('手机号码不能为空'));
                } else if (!this.$util.isMobile(value)) {
                    return callback(new Error('请填写正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {
                userInfo: {
                    name: '',
                    nationalId: '',
                    deviceIdList: [{id: ''}],
                    province: '',
                    city: '',
                    county: '',
                    town: '',
                    address: '',
                    telephone: '',
                    mobile: ''
                },
                provinceOptions: [
                    {value: '001', label: '北京'},
                    {value: '002', label: '河北省'}
                ],
                cityOptions: [
                    {value: '001', label: '北京市'},
                    {value: '002', label: '石家庄市'}
                ],
                countyOptions: [
                    {value: '001', label: '裕华区'},
                    {value: '002', label: '桥西区'}
                ],
                townOptions: [
                    {value: '001', label: '雨花路'},
                    {value: '002', label: '绵阳路'}
                ],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    nationalId: [
                        {validator: checkNationalId, trigger: 'blur'}
                    ],
                    deviceIdList: [
                        {validator: checkDeviceIdList, trigger: 'blur'}
                    ],
                    province: [
                        {validator: checkProvince, trigger: 'change'}
                    ],
                    city: [
                        {validator: checkCity, trigger: 'change'}
                    ],
                    county: [
                        {validator: checkCounty, trigger: 'change'}
                    ],
                    town: [
                        {validator: checkTown, trigger: 'change'}
                    ],
                    address: [
                        {validator: checkAddress, trigger: 'blur'}
                    ],
                    telephone: [
                        {validator: checkTelephone, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 检测身份证号是否已存在
            checkNationalId() {
                this.$refs['userInfo'].validateField('nationalId', (valid) => {
                    if (valid) {
                    } else {
                        return false;
                    }
                });
            },
            // 跳转到身份证存在编辑信息页面
            toEditUserInfo() {
                this.$router.push({name: 'EditUserInfo', params: {id: '345'}});
            },
            // 删除设备
            removeDevice(index) {
                this.userInfo.deviceIdList.splice(index, 1);
            },
            // 添加设备
            addDevice() {
                this.userInfo.deviceIdList.push({id: ''});
            },
            operateUser() {
                this.$refs['userInfo'].validate((valid) => {
                    if (valid) {
                        // 创建
                        if (status === '0') {

                            // 更新
                        } else {

                        }
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                this.$refs['userInfo'].resetFields();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-breadcrumb {
        margin-bottom: 50px;
    }

    .el-input, .el-select {
        width: 600px;
    }

</style>

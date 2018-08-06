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
            <el-form-item label="身份证号" prop="identityId" required>
                <el-input v-model="userInfo.identityId" @change="changeIdentityId" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="verifyIdentityId" type="primary" plain>验证身份证号</el-button>
                <el-button @click="toEditUserInfo" type="primary" plain v-if="identityIdExist">该用户已存在，点此编辑信息</el-button>
            </el-form-item>
            <el-form-item :label="'设备ID' + (index + 1)"
                          props="stbList"
                          v-for="(item, index) in userInfo.stbList"
                          :key="index"
                          required>
                <el-input v-model="item.no" placeholder="请输入设备ID"></el-input>
                <el-button v-if="userInfo.stbList.length > 1" plain @click="removeDevice(index)">删除设备</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="addDevice" type="primary" plain>添加设备</el-button>
            </el-form-item>
            <el-form-item label="省份" prop="province" required>
                <el-select v-model="userInfo.province"
                           @change="selectDistrict('PROVINCE')"
                           placeholder="请选择省份">
                    <el-option
                        v-for="item in provinceOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="city" required>
                <el-select
                    v-model="userInfo.city"
                    @change="selectDistrict('CITY')"
                    placeholder="请选择城市"
                    :disabled="cityDisabled">
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="县区" prop="county" required>
                <el-select
                    v-model="userInfo.county"
                    @change="selectDistrict('COUNTY')"
                    placeholder="请选择县区"
                    :disabled="countyDisabled">
                    <el-option
                        v-for="item in countyOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇/街道" prop="street" required>
                <el-select
                    v-model="userInfo.street"
                    @change="selectDistrict('STREET')"
                    placeholder="请选择乡镇/街道"
                    :disabled="streetDisabled">
                    <el-option
                        v-for="item in streetOptions"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
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
            <el-form-item class="operate">
                <el-button :disabled="btnDisabled" type="primary" @click="operateUser">{{status === '0' ? '创建' :
                    '更新'}}
                </el-button>
                <el-button @click="reset">重 置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'CreateUser',
        props: {
            // status为0：创建用户；status为1：编辑用户
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
            let checkIdentityId = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('身份证号不能为空'));
                } else if (!this.$util.isNationalId(value)) {
                    return callback(new Error('请填写正确的身份证号'));
                } else {
                    callback();
                }
            };
            let checkStbList = (rule, value, callback) => {
                let sign = true;
                for (let i = 0; i < value.length; i++) {
                    if (!value[i].no) {
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
            let checkStreet = (rule, value, callback) => {
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
                    identityId: '',
                    stbList: [{no: ''}],
                    province: '',
                    city: '',
                    county: '',
                    street: '',
                    address: '',
                    telephone: '',
                    mobile: '',
                    fullAddress: '',
                    districtCode: ''
                },
                btnDisabled: false,
                originalIdentityId: '',
                identityIdExist: false,
                existId: '',
                provinceOptions: [],
                cityOptions: [],
                countyOptions: [],
                streetOptions: [],
                cityDisabled: true,
                countyDisabled: true,
                streetDisabled: true,
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    identityId: [
                        {validator: checkIdentityId, trigger: 'blur'}
                    ],
                    stbList: [
                        {validator: checkStbList, trigger: 'blur'}
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
                    street: [
                        {validator: checkStreet, trigger: 'change'}
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
                this.getDistrictList({level: 'PROVINCE'});
                if (this.status === '1') {
                    this.$service.getUserInfoById({id: this.$route.params.id}).then(response => {
                        if (response && response.code === 0) {
                            this.userInfo = response.data;
                            this.originalIdentityId = this.userInfo.identityId;
                            // 获取地址列表
                            this.getDistrictList({level: 'CITY', code: this.userInfo.province});
                            this.getDistrictList({level: 'COUNTY', code: this.userInfo.city});
                            this.getDistrictList({level: 'STREET', code: this.userInfo.county});
                            this.cityDisabled = false;
                            this.countyDisabled = false;
                            this.streetDisabled = false;
                        }
                    });
                }
            },
            // 获取地区列表
            getDistrictList({level, code}) {
                this.$service.getDistrictList({level, code}).then(response => {
                    if (response && response.code === 0) {
                        switch (level) {
                            case 'PROVINCE':
                                this.provinceOptions = response.data.list;
                                break;
                            case 'CITY':
                                this.cityOptions = response.data.list;
                                break;
                            case 'COUNTY':
                                this.countyOptions = response.data.list;
                                break;
                            case 'STREET':
                                this.streetOptions = response.data.list;
                                break;
                            default:
                                break;
                        }
                    }
                });
            },
            // 选择某个地区
            selectDistrict(level) {
                switch (level) {
                    // 选择省份
                    case 'PROVINCE':
                        this.getDistrictList({level: 'CITY', code: this.userInfo.province});
                        this.cityDisabled = false;
                        this.userInfo.city = '';
                        this.countyDisabled = true;
                        this.userInfo.county = '';
                        this.countyOptions = [];
                        this.streetDisabled = true;
                        this.userInfo.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择城市
                    case 'CITY':
                        this.getDistrictList({level: 'COUNTY', code: this.userInfo.city});
                        this.countyDisabled = false;
                        this.userInfo.county = '';
                        this.streetDisabled = true;
                        this.userInfo.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择县区
                    case 'COUNTY':
                        this.getDistrictList({level: 'STREET', code: this.userInfo.county});
                        this.streetDisabled = false;
                        this.userInfo.street = '';
                        this.streetOptions = [];
                        break;
                    // 选择街道乡镇
                    case 'STREET':
                        break;
                    default:
                        break;
                }
            },
            // 检测身份证号是否已存在
            verifyIdentityId() {
                this.$refs['userInfo'].validateField('identityId', (valid) => {
                    if (!valid) {
                        if (this.originalIdentityId === this.userInfo.identityId) {
                            this.$message('当前身份证号与当前用户的原身份证号相同');
                            return;
                        }
                        this.$service.getUserInfoByIdentityId({identityId: this.userInfo.identityId}).then(response => {
                            if (response && response.code === 0) {
                                if (response.data.list.length === 1) {
                                    this.identityIdExist = true;
                                    this.existId = response.data.list[0].id;
                                } else if (response.data.list.length > 1) {
                                    this.identityIdExist = false;
                                    this.existId = '';
                                    this.$message('当前身份证号在系统中有' + response.data.list.length + '个重复账号');
                                } else {
                                    this.identityIdExist = false;
                                    this.existId = '';
                                    this.$message('当前身份证号没有在系统中');
                                }
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            changeIdentityId() {
                this.identityIdExist = false;
                this.existId = '';
            },
            // 跳转到身份证存在编辑信息页面
            toEditUserInfo() {
                this.$router.push({name: 'EditUserInfo', params: {id: this.existId}});
            },
            // 删除设备
            removeDevice(index) {
                this.userInfo.stbList.splice(index, 1);
            },
            // 添加设备
            addDevice() {
                this.userInfo.stbList.push({no: ''});
            },
            checkStbList() {
                let sign = true;
                for (let i = 0; i < this.userInfo.stbList.length; i++) {
                    if (!this.userInfo.stbList[i].no) {
                        sign = false;
                    }
                }
                return sign;
            },
            operateUser() {
                this.$refs['userInfo'].validate((valid) => {
                    if (valid) {
                        if (!this.checkStbList()) {
                            this.$message({message: '请完整填写设备ID', type: 'warning'});
                        }
                        this.btnDisabled = true;
                        // 设置全量地址
                        this.userInfo.fullAddress = '';
                        this.provinceOptions.map(province => {
                            if (province.code === this.userInfo.province) {
                                this.userInfo.fullAddress = this.userInfo.fullAddress + province.name;
                            }
                        });
                        this.cityOptions.map(city => {
                            if (city.code === this.userInfo.city) {
                                this.userInfo.fullAddress = this.userInfo.fullAddress + city.name;
                            }
                        });
                        this.countyOptions.map(county => {
                            if (county.code === this.userInfo.county) {
                                this.userInfo.fullAddress = this.userInfo.fullAddress + county.name;
                            }
                        });
                        this.streetOptions.map(street => {
                            if (street.code === this.userInfo.street) {
                                this.userInfo.fullAddress = this.userInfo.fullAddress + street.name + this.userInfo.address;
                            }
                        });
                        // 设置全量地址code
                        this.userInfo.districtCode = this.userInfo.street;
                        // 创建
                        if (this.status === '0') {
                            this.$service.updateUser(this.userInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message('创建成功');
                                    this.$router.push({name: 'UserList'});
                                } else {
                                    this.btnDisabled = false;
                                }
                            });
                            // 更新
                        } else {
                            this.userInfo.id = this.$route.params.id;
                            this.$service.updateUser(this.userInfo).then(response => {
                                if (response && response.code === 0) {
                                    this.$message('更新成功');
                                    this.$router.push({name: 'UserList'});
                                } else {
                                    this.btnDisabled = false;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                this.$refs['userInfo'].resetFields();
                this.cityDisabled = true;
                this.cityOptions = [];
                this.countyDisabled = true;
                this.countyOptions = [];
                this.streetDisabled = true;
                this.streetOptions = [];
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-input, .el-select {
        width: 600px;
    }

</style>

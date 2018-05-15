<!--内容管理-栏目管理-广告选择第二步组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="省份">
                <el-select v-model="province" placeholder="请选择省份">
                    <el-option
                        v-for="item in provinceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="城市">
                <el-select v-model="city" placeholder="请选择城市">
                    <el-option
                        v-for="item in cityList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区县">
                <el-select v-model="county" placeholder="请选择区县">
                    <el-option
                        v-for="item in countyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作用时间" class="duration">
                <el-date-picker
                    v-model="duration"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'AdSecondStep',
        data() {
            return {
                provinceList: [{
                    value: '1',
                    label: '河北省'
                }, {
                    value: '2',
                    label: '北京市'
                }, {
                    value: '3',
                    label: '天津市'
                }],
                province: '',
                cityList: [{
                    value: '1',
                    label: '石家庄'
                }, {
                    value: '2',
                    label: '唐山'
                }, {
                    value: '3',
                    label: '秦皇岛'
                }],
                city: '',
                countyList: [{
                    value: '1',
                    label: '海港区'
                }, {
                    value: '2',
                    label: '桥东区'
                }, {
                    value: '3',
                    label: '桥西区'
                }],
                county: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            let end = new Date();
                            let start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            let end = new Date();
                            let start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            let end = new Date();
                            let start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                duration: ''
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
        }
        .duration {
            margin-left: 30px;
        }
    }

</style>

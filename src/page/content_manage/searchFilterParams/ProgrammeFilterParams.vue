<!--搜索节目参数设置组件-->
<template>
    <div @keyup.enter="getProgrammeList" class="text-left">
        <el-form :inline="true">
            <el-form-item label="上映开始时间">
                <el-date-picker
                    v-model="listQueryParams.releaseAtStart"
                    type="year"
                    clearable
                    placeholder="请选择上映时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="上映结束时间">
                <el-date-picker
                    v-model="listQueryParams.releaseAtEnd"
                    type="year"
                    clearable
                    placeholder="请选择上映时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="制片地区">
                <el-select
                    v-model="listQueryParams.produceAreaList"
                    clearable
                    multiple
                    placeholder="请选择制片地区">
                    <el-option
                        v-for="(item, index) in areaOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类">
                <el-select v-model="listQueryParams.programmeCategoryIdList"
                           clearable
                           multiple
                           placeholder="请选择分类"
                           @change="setCategory">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" v-if="listQueryParams.programmeCategoryIdList">
                <el-select v-model="listQueryParams.programmeTypeIdList"
                           multiple clearable placeholder="请选择类型">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="listQueryParams.visible" placeholder="请选择节目状态">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item>
                <el-input
                    v-model="listQueryParams.keyword"
                    clearable
                    placeholder="请输入关键字">
                </el-input>
                <el-input v-show="false"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="el-icon-search" @click="getProgrammeList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="clearSearchFields">清空筛选条件</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import store from 'store';

    export default {
        name: 'ProgrammeFilterParams',
        props: [],
        data() {
            return {
                listQueryParams: {
                    releaseAtStart: '',
                    releaseAtEnd: '',
                    produceAreaList: [],
                    programmeCategoryIdList: [],
                    programmeTypeIdList: [],
                    visible: '',
                    keyword: ''
                },
                areaOptions: store.get('areaList'),
                categoryOptions: [],
                typeOptions: [],
                statusOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '已下架'
                }]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 节目类型分类
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
            },
            // 设置节目的分类，例如电视剧
            setCategory() {
                this.typeOptions = [];
                for (let i = 0; i < this.listQueryParams.programmeCategoryIdList.length; i++) {
                    for (let k = 0; k < this.categoryOptions.length; k++) {
                        if (this.categoryOptions[k].id === this.listQueryParams.programmeCategoryIdList[i]) {
                            this.typeOptions = this.typeOptions.concat(this.categoryOptions[k].programmeTypeList);
                        }
                    }
                }
                let array = [];
                this.listQueryParams.programmeTypeIdList.map(typeId => {
                    this.typeOptions.map(type => {
                        if (type.id === typeId) {
                            array.push(typeId);
                        }
                    });
                });
                this.listQueryParams.programmeTypeIdList = array;
            },
            getProgrammeList() {
                this.$emit('getProgrammeList', this.listQueryParams);
            },
            // 清空搜索条件
            clearSearchFields() {
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-form-item {
        margin-right: 30px;
    }

</style>

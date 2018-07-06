<!--选择多个节目组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="上映时间">
                <el-date-picker
                    v-model="listQueryParams.releaseAt"
                    type="year"
                    placeholder="请选择上映时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="制片地区">
                <el-select v-model="listQueryParams.releaseArea" clearable placeholder="请选择制片地区">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
            <el-form-item class="search">
                <el-input v-model="listQueryParams.keyword" placeholder="请输入关键字">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="getProgrammeList">查 询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="programmeList"
            border
            ref="selectProgramme"
            style="width: 100%"
            @select="selectRow">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="code"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="简介">
                <template slot-scope="scope">
                    <label>{{scope.row.description}}</label>
                    <el-popover
                        placement="right"
                        :title="scope.row.name + '简介'"
                        width="250"
                        trigger="hover"
                        :content="scope.row.description">
                        <el-button slot="reference" type="text" class="more">更多</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="featureVideoCount"
                label="正片数量">
            </el-table-column>
            <el-table-column
                prop="extraVideoCount"
                label="相关视频数量">
            </el-table-column>
            <el-table-column
                prop="announceAt"
                label="上映时间">
                <template slot-scope="scope">
                    {{scope.row.announceAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="releaseArea"
                label="地区">
            </el-table-column>
            <el-table-column
                label="分类">
                <template slot-scope="scope">
                    {{scope.row.categoryList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="typeList"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.typeList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                label="主演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                label="导演">
                <template slot-scope="scope">
                    <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="visible"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.visible ? '已上架' :'已下架'}}
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button type="success" @click="appendProgramme" size="small">添加所选节目</el-button>
    </div>
</template>

<script>

    export default {
        name: 'SelectMultipleProgramme',
        // 当前外部选中的人物列表
        props: ['selectedProgrammeList'],
        data() {
            return {
                listQueryParams: {
                    releaseAt: '',
                    releaseArea: '',
                    programmeCategoryIdList: [],
                    programmeTypeIdList: [],
                    visible: '',
                    keyword: '',
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                areaOptions: [{
                    value: '1',
                    label: '大陆'
                }, {
                    value: '2',
                    label: '台湾'
                }, {
                    value: '3',
                    label: '香港'
                }, {
                    value: '4',
                    label: '海外'
                }],
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
                }],
                searchContent: '',
                totalAmount: 0,
                programmeList: [],
                multipleSelection: [],
                // 单选节目
                singleProgramme: {}
            };
        },
        mounted() {
        },
        methods: {
            init() {
                // 下架状态的节目可以被选为专题中
                // 初始化选中的项
                for (let i = 0; i < this.selectedProgrammeList.length; i++) {
                    this.multipleSelection.push(this.selectedProgrammeList[i]);
                }
                this.getProgrammeList();
                // 节目类型分类
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
            },
            // 请求数据
            getProgrammeList() {
                this.listQueryParams.pageNum = this.pageNum - 1;
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的多选项项进行勾选
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            for (let k = 0; k < this.programmeList.length; k++) {
                                if (this.multipleSelection[i].id === this.programmeList[k].id) {
                                    this.$nextTick(function () {
                                        this.$refs.selectProgramme.toggleRowSelection(this.programmeList[k], true);
                                    });
                                }
                            }
                        }
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
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getProgrammeList();
            },
            // 添加节目
            appendProgramme() {
                this.$emit('setProgramme', this.multipleSelection);
            },
            // 多选的模式中选择或取消某一行
            selectRow(selection, row) {
                // 判断当前行为，选择或者取消
                let checkStatus;
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].id === row.id) {
                        checkStatus = true;
                    }
                }
                if (checkStatus) {
                    for (let k = 0; k < this.multipleSelection.length; k++) {
                        if (this.multipleSelection[k].id === row.id) {
                            return;
                        }
                    }
                    this.multipleSelection.push(row);
                } else {
                    for (let n = 0; n < this.multipleSelection.length; n++) {
                        if (this.multipleSelection[n].id === row.id) {
                            this.multipleSelection.splice(n, 1);
                        }
                    }
                }
            },
            cancelSelectRow(row) {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (row.id === this.multipleSelection[i].id) {
                        this.multipleSelection.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.programmeList.length; i++) {
                    if (row.id === this.programmeList[i].id) {
                        this.$refs.selectProgramme.toggleRowSelection(this.programmeList[i], false);
                    }
                }
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
            .search {
                margin-left: 50px;
                margin-right: 30px;
            }
        }
    }

    .el-table {
        img {
            width: 120px;
        }
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }

        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

</style>

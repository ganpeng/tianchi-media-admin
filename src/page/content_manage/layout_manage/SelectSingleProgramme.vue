<!--选择一个节目组件-->
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
            <el-form-item label="类型" v-if="listQueryParams.programmeCategoryIdList.length > 0">
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
            ref="selectSingleProgramme"
            style="width: 100%"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @current-change="setProgramme">
            <el-table-column
                prop="code"
                label="编号">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
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
            <el-table-column align="center"
                             label="操作"
                             class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toProgrammeDetail(scope.row.id)">查看</el-button>
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
    </div>
</template>

<script>

    export default {
        name: 'SelectSingleProgramme',
        // 当前外部选中的人物列表
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
                // 单选节目
                singleProgramme: {}
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
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
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的单选项进行勾选
                        for (let k = 0; k < this.programmeList.length; k++) {
                            if (this.singleProgramme.id === this.programmeList[k].id) {
                                this.$nextTick(function () {
                                    this.$refs.selectSingleProgramme.setCurrentRow(this.programmeList[k]);
                                    this.$emit('setProgramme', this.programmeList[k]);
                                });
                            }
                        }
                    }
                });
            },
            tableRowClassName({row}) {
                if (row.recommend || !row.visible) {
                    return 'warning-row';
                }
                return '';
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
            // 跳转到节目详情
            toProgrammeDetail(programmeId) {
                this.$router.push({name: 'DisplayProgramme', params: {id: programmeId}});
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum - 1;
                this.getProgrammeList();
            },
            // 选中的节目更改时触发
            setProgramme(row) {
                // 清空选择项的时候不做操作
                if (!row) {
                    return;
                }
                if (row.visible) {
                    this.singleProgramme = row;
                    this.$emit('setProgramme', row);
                } else {
                    this.$message('当前节目已经下架，不可选择');
                    this.$refs.selectSingleProgramme.setCurrentRow();
                    this.$emit('resetProgramme');
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

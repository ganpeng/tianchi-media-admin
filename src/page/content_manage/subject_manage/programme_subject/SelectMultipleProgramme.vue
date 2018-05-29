<!--选择多个节目组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="上映时间">
                <el-date-picker
                    v-model="releaseAt"
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
                <el-select v-model="listQueryParams.programmeCategory" clearable placeholder="请选择分类"
                           @change="setCategory">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" v-if="listQueryParams.programmeCategory">
                <el-select v-model="listQueryParams.programmeType" clearable placeholder="请选择类型">
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
                <el-input v-model="searchContent" placeholder="请输入关键字">
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
            ref="multipleProgramme"
            style="width: 100%"
            :highlight-current-row="model==='SINGLE'"
            @current-change="setProgramme"
            @select="selectRow">
            <el-table-column
                type="selection"
                width="55"
                v-if="model==='MULTIPLE'">
            </el-table-column>
            <el-table-column
                prop="code"
                label="编号">
                <template slot-scope="scope">
                    <i class="el-icon-success" v-if="model==='SINGLE'"></i>
                    <label>{{scope.row.id}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.posterImages && scope.row.posterImages[0] ? scope.row.posterImages[0].uri : ''"
                         @click="displayImage(scope.row)" alt="节目图片"
                         v-if="scope.row.posterImages && scope.row.posterImages[0]">
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
                    {{scope.row.category.name}}
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
                prop="actor"
                label="主演">
            </el-table-column>
            <el-table-column
                prop="director"
                label="导演">
            </el-table-column>
            <el-table-column
                prop="visible"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.visible ? '正常' :'已下架'}}
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
            :current-page="listQueryParams.pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button type="success" @click="appendProgramme" size="small" v-if="model==='MULTIPLE'">添加所选节目</el-button>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'SelectMultipleProgramme',
        components: {
            PreviewMultipleImages
        },
        // 当前外部选中的人物列表
        props: ['selectedProgrammeList', 'model'],
        data() {
            return {
                listQueryParams: {
                    releaseAt: '',
                    releaseArea: '',
                    programmeCategory: '',
                    programmeType: '',
                    visible: '',
                    pageNum: 1,
                    pageSize: 5
                },
                releaseAt: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                },
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
                multipleSelection: []
            };
        },
        mounted() {
        },
        methods: {
            init() {
                // 初始化选中的项
                for (let i = 0; i < this.selectedProgrammeList.length; i++) {
                    this.multipleSelection.push(this.selectedProgrammeList[i]);
                }
                this.getProgrammeList();
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
            },
            getProgrammeList() {
                this.listQueryParams.releaseAt = this.releaseAt ? Date.parse(this.releaseAt) : '';
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的项进行勾选
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            for (let k = 0; k < this.programmeList.length; k++) {
                                if (this.multipleSelection[i].id === this.programmeList[k].id) {
                                    this.$nextTick(function () {
                                        this.$refs.multipleProgramme.toggleRowSelection(this.programmeList[k], true);
                                    });
                                }
                            }
                        }
                    }
                });
            },
            // 设置节目的分类，例如电视剧
            setCategory() {
                for (let i = 0; i < this.categoryOptions.length; i++) {
                    if (this.categoryOptions[i].id === this.listQueryParams.programmeCategory) {
                        this.typeOptions = this.categoryOptions[i].programmeTypeList;
                        return;
                    }
                }
                this.typeOptions = [];
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            },
            handleCurrentChange(currentPage) {
                this.listQueryParams.pageNum = currentPage;
                this.getProgrammeList();
            },
            // 添加节目
            appendProgramme() {
                this.$emit('setProgramme', this.multipleSelection);
            },
            // 放大预览图片
            displayImage(row) {
                this.previewImage.display = true;
                this.previewImage.list = row.posterImages;
            },
            selectRow(selection, row) {
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
                        this.$refs.multipleProgramme.toggleRowSelection(this.programmeList[i], false);
                    }
                }
            },
            setProgramme(row) {
                this.currentRow = row;
                this.$emit('setProgramme', row);
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
            cursor: zoom-in;
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

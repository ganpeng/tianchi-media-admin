<!-- 节目列表页组件 -->
<template>
    <div class="program-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <el-form id="label-font" :inline="true" class="demo-form-inline text-left">
                    <div class="field-row">
                        <el-form-item
                            class="margin-bottom-0 search" label=" ">
                            <el-input
                                :value="programmeSearchFields.keyword"
                                clearable
                                class="border-input"
                                @input="inputHandler($event, 'keyword')"
                                placeholder="搜索你想要的信息">
                            </el-input>
                        </el-form-item>
                        <el-button class="btn-style-one" @click="searchHandler" icon="el-icon-search" type="primary" plain>搜索</el-button>
                        <el-form-item
                            label-width="80px" class="margin-bottom-0" label="状态">
                            <el-select
                                :value="programmeSearchFields.visible"
                                @change="inputHandler($event, 'visible')"
                                clearable
                                placeholder="请选择状态">
                                <el-option
                                    v-for="item in visibleOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label-width="80px" label="分类">
                            <el-select
                                :value="programmeSearchFields.programmeCategoryIdList"
                                multiple
                                @change="inputHandler($event, 'programmeCategoryIdList')"
                                placeholder="请选择分类">
                                <el-option
                                    v-for="item in global.categoryList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label-width="80px" class="margin-bottom-0" label="类型">
                            <el-select
                                :value="programmeSearchFields.programmeTypeIdList"
                                @change="inputHandler($event, 'programmeTypeIdList')"
                                clearable
                                multiple
                                placeholder="请选择类型">
                                <el-option
                                    v-for="item in programmeTypeOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                            <svg-icon
                                icon-class="clear_filter"
                                class-name="svg-box">
                            </svg-icon>
                            重置
                        </el-button>
                        <span
                            @click="toggleSearchField"
                            class="el-dropdown-link">
                            更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                    </div>
                    <div v-show="searchFieldVisible" class="field-row">
                        <el-form-item label-width="100px" label="开始时间">
                            <el-date-picker
                                :value="programmeSearchFields.releaseAtStart"
                                type="date"
                                clearable
                                style="width:180px;"
                                @input="inputHandler($event, 'releaseAtStart')"
                                placeholder="请选择开始时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label-width="100px" label="结束时间">
                            <el-date-picker
                                :value="programmeSearchFields.releaseAtEnd"
                                type="date"
                                clearable
                                style="width:180px;"
                                @input="inputHandler($event, 'releaseAtEnd')"
                                placeholder="请选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item
                            label-width="85px" label="地区">
                            <el-select
                                :value="programmeSearchFields.produceAreaList"
                                clearable
                                filterable
                                multiple
                                @change="inputHandler($event, 'produceAreaList')"
                                placeholder="请选择地区"
                            >
                                <el-option
                                    v-for="(item, index) in areaOptions"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">节目列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox v-model="reverseAll" @change="handleReverseAllChange">反选</el-checkbox>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createProgramme">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="showFileUploadDialog">
                            <svg-icon icon-class="upload"></svg-icon>
                            导入
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="showFileUploadDialog">
                            <svg-icon icon-class="upload"></svg-icon>
                            导出
                        </el-button>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    @select="selectHandler"
                    @select-all="selectAllHandler"
                    row-class-name="programme-row" header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column prop="code" align="center" width="120px" label="节目编号">
                        <template slot-scope="scope">
                            {{scope.row.code | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" min-width="100px" label="节目名称">
                        <template slot-scope="scope">
                            <span class="ellipsis four">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="节目图片" width="90" align="center" >
                        <template slot-scope="scope">
                            <img style="width:70px;height:auto;" @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="featureVideoCount" width="80px" align="center" label="正片数量">
                        <template slot-scope="scope">
                            {{scope.row.featureVideoCount | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="releaseAt" align="center" width="100px" label="上映时间">
                        <template slot-scope="scope">
                            {{ scope.row.releaseAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="produceAreaList" min-width="150px" align="center" label="地区">
                        <template slot-scope="scope">
                            <span class="ellipsis four">
                                {{areaLabel(scope.row.produceAreaList) | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="100px" label="分类">
                        <template slot-scope="scope">
                            <span class="ellipsis four">
                                {{categoryListString(scope.row.categoryList) | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="100px" label="类型">
                        <template slot-scope="scope">
                            <span class="ellipsis four">
                                {{typeList(scope.row.id) | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="100px" label="演员">
                        <template slot-scope="scope">
                            <span class="ellipsis four">
                                {{getChiefActor(scope.row.id) | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="releaseStatus" min-width="100px" align="center" label="状态">
                        <template slot-scope="scope">
                            <i v-if="scope.row.visible" class="status-normal">已上架</i>
                            <i v-else class="status-abnormal">已下架</i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="100px" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="btn-wrapper">
                                <el-button class="text-success" type="text" size="small" @click="displayProgramme(scope.row.id)">详情</el-button>
                                <el-button type="text" size="small" @click="editProgramme(scope.row.id)">编辑</el-button>
                                <el-button type="text" size="small" @click="lowerFrameProgramme(scope.row)">
                                    {{scope.row.visible ? '下架' : '上架'}}
                                </el-button>
                                <el-button class="text-danger" type="text" size="small" @click="_realDeleteProgramme(scope.row.id)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                @size-change="handlePaginationChange($event, 'pageSize')"
                @current-change="handlePaginationChange($event, 'pageNum')"
                :current-page="programmePagination.pageNum"
                :page-sizes="[10, 30, 50, 100, 200, 300,500]"
                :page-size="programmePagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="programmePagination.total">
            </el-pagination>
        </div>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <el-dialog
            title="上传节目表格"
            :visible.sync="fileUploadDialogVisible"
            :headers="uploadHeaders"
            :show-close="true"
            :before-close="closeFileUploadDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="uploadHeaders"
                accept=".xlsx, .xls"
                action="/admin/v1/content/programme/import"
                :auto-upload="false"
                :file-list="fileList"
                :on-success="uploadSuccessHandler"
                :with-credentials="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" @click="submitUpload" type="success">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFileUploadDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import store from 'store';
import _ from 'lodash';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';

export default {
    name: 'ProgrammeList',
    components: {
        PreviewSingleImage
    },
    data() {
        return {
            //  toggle搜索区域
            searchFieldVisible: false,
            //  选择数据
            checkAll: false,
            reverseAll: false,
            areaOptions: store.get('areaList'),
            fileUploadDialogVisible: false,
            fileList: [],
            multipleSelection: [],
            selectedVideoList: [],
            uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
            visibleOptions: [
                {
                    value: true,
                    label: '已上架'
                },
                {
                    value: false,
                    label: '已下架'
                }
            ],
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
        };
    },
    created() {
        this.getProgrammeList()
            .then((res) => {
                if (res && res.code === 0) {
                    this.checkedVideoList();
                }
            });
        this.getProgrammeCategory();
        window.addEventListener('keyup', this.keyupHandler);
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.keyupHandler);
    },
    computed: {
        ...mapGetters({
            programmePagination: 'programme/programmePagination',
            programmeSearchFields: 'programme/programmeSearchFields',
            programmeTypeOptions: 'programme/programmeTypeOptions',
            global: 'programme/global',
            list: 'programme/programmeList',
            typeList: 'programme/typeList',
            categoryListString: 'programme/categoryListString',
            getDirector: 'programme/getDirector',
            getChiefActor: 'programme/getChiefActor',
            getScenarist: 'programme/getScenarist'
        }),
        isDisabled() {
            return this.selectedVideoList.length === 0;
        }
    },
    beforeRouteLeave(to, from, next) {
        let {name} = to;
        if (name !== 'DisplayProgramme' && name !== 'EditProgramme') {
            this.resetProgrammeSearchFields();
            this.resetProgrammePagination();
        }
        next();
    },
    methods: {
        ...mapMutations({
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateProgrammeSearchFields: 'programme/updateProgrammeSearchFields',
            resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields',
            resetProgrammePagination: 'programme/resetProgrammePagination'
        }),
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList',
            getProgrammeCategory: 'programme/getProgrammeCategory',
            deleteProgramme: 'programme/deleteProgramme',
            realDeleteProgramme: 'programme/realDeleteProgramme',
            upLowerFrameProgramme: 'programme/upLowerFrameProgramme'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.getProgrammeList()
                    .then((res) => {
                        if (res && res.code === 0) {
                            this.checkedVideoList();
                        }
                    });
            }
        },
        createProgramme() {
            this.$router.push({ name: 'CreateProgramme' });
        },
        clearSearchFields() {
            this.resetProgrammeSearchFields();
        },
        areaLabel(areaList) {
            return areaList.reduce((res, curr) => {
                let area = this.areaOptions.find((item) => item.code === curr);
                return area ? `${res}, ${area.name}` : res;
            }, '').replace(/^,/, '');
        },
        editProgramme(id) {
            this.$router.push({ name: 'EditProgramme', params: { id } });
        },
        displayProgramme(id) {
            this.$router.push({ name: 'DisplayProgramme', params: { id } });
        },
        inputHandler(value, key) {
            this.updateProgrammeSearchFields({key, value});
            if (key === 'programmeCategoryIdList') {
                this.updateProgrammeSearchFields({key: 'programmeTypeIdList', value: []});
            }
        },
        searchHandler() {
            this.getProgrammeList()
                .then((res) => {
                    if (res && res.code === 0) {
                        this.checkedVideoList();
                    }
                });
        },
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        },
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            if (key === 'pageSize') {
                window.localStorage.setItem('programmePageSize', value);
            }
            this.getProgrammeList()
                .then((res) => {
                    if (res && res.code === 0) {
                        this.checkedVideoList();
                    }
                });
        },
        showFileUploadDialog() {
            this.fileUploadDialogVisible = true;
        },
        closeFileUploadDialog() {
            this.fileUploadDialogVisible = false;
            this.fileList = [];
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        lowerFrameProgramme(programme) {
            let {id, visible} = programme;
            this.$confirm(`您确定要${visible ? '下架节目' : '上架节目'}吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteProgramme(id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success(`节目${visible ? '下架' : '上架'}成功`);
                                this.getProgrammeList()
                                    .then((res) => {
                                        if (res && res.code === 0) {
                                            this.checkedVideoList();
                                        }
                                    });
                            } else {
                                this.$message.warning(this.lowerFrameProgrammeErrorHandler(res));
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        lowerFrameProgrammeErrorHandler(res) {
            let {code, data, message} = res;
            let msg = '';
            switch (code) {
                case 3110:
                    msg = data.map((item) => {
                        return item ? `"${item}"` : '';
                    }).join(',');
                    return `节目包含在如下${msg}专题中`;
                case 3111:
                    msg = data.map((item) => {
                        return item ? `"${item}"` : '';
                    }).join(',');
                    return `节目包含在如下${msg}推荐位`;
                default:
                    return message;
            }
        },
        multUpFrameProgrammeHandler() {
            let idList = this.selectedVideoList.map((item) => item.id);
            this.$confirm(`您确定要上架选中的节目吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.upLowerFrameProgramme({idList, visible: true})
                        .then((res) => {
                            if (res && res.code === 0) {
                                if (res.data && res.data.length && res.data.length > 0) {
                                    let nameStr = res.data.map((item) => {
                                        return `'${item.name}'`;
                                    }).join(',');
                                    this.$message({
                                        type: 'error',
                                        showClose: true,
                                        duration: 0,
                                        message: `以下节目【${nameStr}】上架失败`
                                    });
                                } else {
                                    this.$message.success('已选节目上架成功');
                                }
                                this.getProgrammeList()
                                    .then((result) => {
                                        if (result && result.code === 0) {
                                            this.checkedVideoList();
                                        }
                                    });
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        multLowerFrameProgrammeHandler() {
            let idList = this.selectedVideoList.map((item) => item.id);
            this.$confirm(`您确定要下架选中的节目吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.upLowerFrameProgramme({idList, visible: false})
                        .then((res) => {
                            if (res && res.code === 0) {
                                if (res.data && res.data.length && res.data.length > 0) {
                                    let nameStr = res.data.map((item) => {
                                        return `'${item.name}'`;
                                    }).join(',  ');
                                    this.$message({
                                        type: 'error',
                                        showClose: true,
                                        duration: 0,
                                        message: `以下节目【${nameStr}】下架失败`
                                    });
                                } else {
                                    this.$message.success('已选节目下架成功');
                                }
                                this.getProgrammeList()
                                    .then((result) => {
                                        if (result && result.code === 0) {
                                            this.checkedVideoList();
                                        }
                                    });
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            this.upLowerFrameProgramme({idList, visible: false})
                .then((res) => {
                    if (res && res.code === 0) {
                        this.getProgrammeList()
                            .then((result) => {
                                if (result && result.code === 0) {
                                    this.checkedVideoList();
                                }
                            });
                    }
                });
        },
        _realDeleteProgramme(id) {
            this.$confirm(`您确定要删除该节目吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.realDeleteProgramme(id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success({ message: '节目删除成功' });
                                this.$router.push({ name: 'ProgrammeList' });
                            } else {
                                let message = res.message || '节目删除失败';
                                this.$message.error({ message });
                            }
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        uploadSuccessHandler(res, file, fileList) {
            if (res && res.code === 0) {
                this.$message({
                    type: 'success',
                    message: '节目导入成功'
                });
            } else if (res && res.code === 3119) {
                this.$message({
                    type: 'error',
                    message: '节目视频导入失败'
                });
            } else if (res && res.code === 3117) {
                this.$message({
                    type: 'error',
                    message: '节目导入部分成功'
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '节目导入失败'
                });
            }
            this.closeFileUploadDialog();
            this.getProgrammeList()
                .then((res) => {
                    if (res && res.code === 0) {
                        this.checkedVideoList();
                    }
                });
        },
        selectHandler(list, row) {
            let isSelected = list.findIndex((item) => item.id === row.id) >= 0;
            if (isSelected) {
                this.selectedVideoList.push(row);
            } else {
                this.selectedVideoList = this.selectedVideoList.filter((item) => item.id !== row.id);
            }
        },
        selectAllHandler(list) {
            if (list.length > 0) {
                this.selectedVideoList = _.uniqBy(this.selectedVideoList.concat(list), 'id');
            } else {
                this.selectedVideoList = this.selectedVideoList.filter((item) => {
                    let index = this.list.findIndex((programme) => {
                        return programme.id === item.id;
                    });
                    return index < 0;
                });
            }
        },
        checkedVideoList() {
            this.selectedVideoList.forEach((item) => {
                let programme = this.list.find((programme) => {
                    return item.code === programme.code;
                });
                if (programme) {
                    this.$nextTick(() => {
                        this.$refs.multipleTable.toggleRowSelection(programme, true);
                    });
                }
            });
        },
        handleCheckAllChange() {

        },
        handleReverseAllChange() {

        },
        toggleSearchField() {
            this.searchFieldVisible = !this.searchFieldVisible;
        }
    }
};
</script>
<style lang="less" scoped>
.margin-bottom-0 {
    margin-bottom: 0;
}
.btn-wrapper .el-button {
    &:nth-of-type(2n + 1) {
        margin-left: 10px;
    }
}
</style>

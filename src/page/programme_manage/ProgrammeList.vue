<!-- 节目列表页组件 -->
<template>
    <div class="program-list-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="table-container">
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-form-item class="search">
                    <el-input
                        :value="programmeSearchFields.keyword"
                        clearable
                        @input="inputHandler($event, 'keyword')"
                        placeholder="搜索你想要的信息">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchHandler" type="primary">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" @click="clearSearchFields">清空筛选条件</el-button>
                </el-form-item>
                <el-form-item class="create-account">
                    <el-tag>
                        <router-link to="/programme-manage/create">新增节目</router-link>
                    </el-tag>
                    <el-button size="small" type="primary" plain @click="showFileUploadDialog">导入节目</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="上映开始年">
                    <el-date-picker
                        :value="programmeSearchFields.releaseAtStart"
                        type="year"
                        clearable
                        @input="inputHandler($event, 'releaseAtStart')"
                        placeholder="请选择上映时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="上映结束年">
                    <el-date-picker
                        :value="programmeSearchFields.releaseAtEnd"
                        type="year"
                        clearable
                        @input="inputHandler($event, 'releaseAtEnd')"
                        placeholder="请选择上映时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地区">
                    <el-select
                        :value="programmeSearchFields.produceAreaList"
                        clearable
                        filterable
                        multiple
                        @change="inputHandler($event, 'produceAreaList')"
                        placeholder="请选择制片地区"
                    >
                        <el-option
                            v-for="(item, index) in areaOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select
                        :value="programmeSearchFields.programmeCategoryIdList"
                        multiple
                        @change="inputHandler($event, 'programmeCategoryIdList')"
                        placeholder="请选择">
                        <el-option
                            v-for="item in global.categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        :value="programmeSearchFields.programmeTypeIdList"
                        @change="inputHandler($event, 'programmeTypeIdList')"
                        clearable
                        multiple
                        placeholder="请选择">
                        <el-option
                            v-for="item in programmeTypeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节目状态">
                    <el-select
                        :value="programmeSearchFields.visible"
                        @change="inputHandler($event, 'visible')"
                        clearable
                        placeholder="请选择">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="list" border style="width: 100%">
                <el-table-column prop="code" align="center" width="240px" label="节目编号"></el-table-column>
                <el-table-column label="节目图片" align="center" >
                    <template slot-scope="scope">
                        <img @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="person-image pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="100px" label="节目名称"></el-table-column>
                <el-table-column prop="description" align="center" width="300px" label="节目简介"></el-table-column>
                <el-table-column prop="featureVideoCount" min-width="100px" align="center" label="正片数量"></el-table-column>
                <el-table-column prop="extraVideoCount" align="center" min-width="120px" label="相关视频数量">
                </el-table-column>
                <el-table-column prop="releaseAt" align="center" width="100px" label="上映时间">
                    <template slot-scope="scope">
                        {{ scope.row.releaseAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column prop="produceAreaList" min-width="150px" align="center" label="地区">
                    <template slot-scope="scope">
                        {{areaLabel(scope.row.produceAreaList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" width="100px" label="分类">
                    <template slot-scope="scope">
                        {{categoryListString(scope.row.categoryList)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="类型">
                    <template slot-scope="scope">
                        {{typeList(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="演员">
                    <template slot-scope="scope">
                        {{getChiefActor(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="导演">
                    <template slot-scope="scope">
                        {{getDirector(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="编剧">
                    <template slot-scope="scope">
                        {{getScenarist(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column prop="releaseStatus" min-width="100px" align="center" label="状态">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" align="center" width="120px" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="displayProgramme(scope.row.id)">查看</el-button>
                        <el-button type="text" size="small" @click="editProgramme(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handlePaginationChange($event, 'pageSize')"
                @current-change="handlePaginationChange($event, 'pageNum')"
                :current-page="programmePagination.pageNum"
                :page-sizes="[5, 10, 20, 30, 50]"
                :page-size="programmePagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="programmePagination.total">
            </el-pagination>
        </div>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <el-dialog
            title="上传视频"
            :visible.sync="fileUploadDialogVisible"
            :headers="uploadHeaders"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="uploadHeaders"
                action="/v1/storage/file"
                :auto-upload="false"
                :file-list="fileList"
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
import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';

export default {
    name: 'ProgrammeList',
    components: {
        PreviewSingleImage
    },
    data() {
        return {
            areaOptions: store.get('areaList'),
            fileUploadDialogVisible: false,
            fileList: [],
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
        this.resetProgrammeSearchFields();
        this.getProgrammeList();
        this.getProgrammeCategory();
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
        })
    },
    methods: {
        ...mapMutations({
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateProgrammeSearchFields: 'programme/updateProgrammeSearchFields',
            resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields'
        }),
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList',
            getProgrammeCategory: 'programme/getProgrammeCategory'
        }),
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
            this.getProgrammeList();
        },
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        },
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            this.getProgrammeList();
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
        }
    }
};
</script>
<style lang="less" scoped>
.search-title {
    display: inline-block;
    font-size: 20px;
    line-height: 40px
}
</style>

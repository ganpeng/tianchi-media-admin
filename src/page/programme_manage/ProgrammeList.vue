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
                        :value="keyword"
                        clearable
                        @clear="clearSearchField('keyword')"
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
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <span class="search-title">筛选条件：</span>
                <el-form-item label="上映时间">
                    <el-date-picker
                        :value="releaseAt"
                        type="year"
                        clearable
                        @clear="clearSearchField('releaseAt')"
                        @input="inputHandler($event, 'releaseAt')"
                        placeholder="请选择上映时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地区">
                    <el-select
                        :value="produceAreaList"
                        clearable
                        filterable
                        multiple
                        @clear="clearSearchField('produceAreaList')"
                        @change="inputHandler($event, 'produceAreaList')"
                        placeholder="请选择制片地区"
                    >
                        <el-option
                            v-for="item in areaOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select
                        :value="searchCategory"
                        clearable
                        @clear="clearSearchCategory"
                        @change="categoryChangeHandler"
                        placeholder="请选择">
                        <el-option
                            v-for="item in categroyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        :value="searchType"
                        @change="typeListChangeHandler"
                        clearable
                        multiple
                        @clear="clearSearchType"
                        placeholder="请选择">
                        <el-option
                            v-for="item in searchCurrentTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="list" border style="width: 100%">
                <el-table-column prop="id" align="center" width="240px" label="节目编号"></el-table-column>
                <el-table-column label="节目图片" align="center" >
                    <template slot-scope="scope">
                        <img @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="person-image pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="100px" label="节目名称"></el-table-column>
                <el-table-column prop="description" align="center" width="300px" label="节目简介"></el-table-column>
                <el-table-column prop="featureVideoCount" min-width="100px" align="center" label="正片数量"></el-table-column>
                <el-table-column prop="" align="center" min-width="120px" label="相关视频数量"></el-table-column>
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
                        {{categoryName(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="类型">
                    <template slot-scope="scope">
                        {{typeList(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="主演">
                    <template slot-scope="scope">
                        {{getChiefActor(scope.row.id)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="导演">
                    <template slot-scope="scope">
                        {{getDirector(scope.row.id)}}
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNum"
                :page-sizes="[5, 10, 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';
export default {
    name: 'ProgrammeList',
    components: {
        PreviewSingleImage
    },
    data() {
        return {
            areaOptions: this.$util.countryList(),
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
        };
    },
    created() {
        this.resetSearchField();
        this.getProgrammeList();
        this.getProgrammeCategory();
    },
    computed: {
        ...mapGetters({
            list: 'programme/list',
            pagination: 'programme/pagination',
            searchFields: 'programme/searchFields',
            categoryName: 'programme/categoryName',
            typeList: 'programme/typeList',
            getDirector: 'programme/getDirector',
            getChiefActor: 'programme/getChiefActor',
            getPostImage: 'programme/getPostImage',
            searchCategory: 'programme/searchCategory',
            searchType: 'programme/searchType',
            searchCurrentTypeList: 'programme/searchCurrentTypeList',
            produceAreaList: 'programme/produceAreaList',
            releaseAt: 'programme/releaseAt',
            keyword: 'programme/keyword',
            categroyList: 'programme/categroyList'
        })
    },
    methods: {
        ...mapMutations({
            setPagination: 'programme/setPagination',
            updateSearchCategoryValue: 'programme/updateSearchCategoryValue',
            updateSearchType: 'programme/updateSearchType',
            resetSearchCategory: 'programme/resetSearchCategory',
            resetSearchType: 'programme/resetSearchType',
            setSearchField: 'programme/setSearchField',
            resetSearchField: 'programme/resetSearchField'
        }),
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList',
            getProgrammeCategory: 'programme/getProgrammeCategory'
        }),
        clearSearchFields() {
            this.resetSearchField();
        },
        clearSearchField(key) {
            this.setSearchField({[key]: ''});
        },
        editProgramme(id) {
            this.$router.push({ name: 'EditProgramme', params: { id } });
        },
        displayProgramme(id) {
            this.$router.push({ name: 'DisplayProgramme', params: { id } });
        },
        areaLabel(areaValue) {
            return areaValue.map((item) => {
                let area = this.areaOptions.find((areaItem) => areaItem.value === item);
                return area ? area.label ? area.label : '' : '';
            }).join(',');
        },
        handleSizeChange(pageSize) {
            this.setPagination({pageSize});
            this.getProgrammeList();
        },
        handleCurrentChange(pageNum) {
            this.setPagination({pageNum});
            this.getProgrammeList();
        },
        categoryChangeHandler(id) {
            this.updateSearchCategoryValue({id});
            this.updateSearchType({list: []});
        },
        typeListChangeHandler(value) {
            this.updateSearchType({list: value});
        },
        clearSearchCategory() {
            this.resetSearchCategory();
        },
        clearSearchType() {
            this.resetSearchType();
        },
        inputHandler(value, key) {
            this.setSearchField({[key]: value});
        },
        searchHandler() {
            this.getProgrammeList();
        },
        // 放大预览图片
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
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

<!--人物列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input
                    :value="searchStr"
                    @input="inputChangeHandler"
                    placeholder="搜索你想要的信息"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getPersonList">搜索</el-button>
            </el-form-item>
            <el-form-item label="地区">
                <el-select
                    :value="area"
                    filterable
                    clearable
                    placeholder="请选择地区"
                    @change="areaChangeHandler">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="create-account">
                <el-tag>
                    <router-link to="/person-manage/create">新增人物</router-link>
                </el-tag>
            </el-form-item>
        </el-form>
        <el-table :data="list" border style="width:100%">
            <el-table-column prop="id" align="center" width="240px" label="编号"></el-table-column>
            <el-table-column label="照片" align="center" >
                <template slot-scope="scope">
                    <img @click="displayImage(scope.row.posterImageList[0] ? scope.row.posterImageList[0] : {} )" width="80px" height="80px" class="person-image pointer" :src="(scope.row.posterImageList[0] ? scope.row.posterImageList[0].uri :'' )" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="名字"></el-table-column>
            <el-table-column prop="description" align="center" width="300px" label="人物简介"></el-table-column>
            <el-table-column prop="area" align="center" label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area)}}
                </template>
            </el-table-column>
            <el-table-column prop="birthday" align="center" label="出生日期">
                <template slot-scope="scope">
                    {{scope.row.birthday | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column prop="height" align="center" label="身高"></el-table-column>
            <el-table-column prop="weight" align="center" label="体重"></el-table-column>
            <el-table-column prop="mainRole" align="center" label="职业">
                <template slot-scope="scope">
                    {{mainRoleLabel(scope.row.mainRole)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="displayPerson(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="editPerson(scope.row.id)">编辑</el-button>
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
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';
    import role from '@/util/config/role';
    export default {
        name: 'PersonList',
        components: {
            PreviewSingleImage
        },
        data() {
            return {
                areaOptions: this.$util.countryList(),
                mainRoleOptions: role.MAIN_ROLE_OPTIONS,
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
                }
            };
        },
        created() {
            this.resetPerson();
            this.getPersonList({isProgramme: false});
        },
        computed: {
            ...mapGetters({
                area: 'person/area',
                list: 'person/list',
                pagination: 'person/pagination',
                searchStr: 'person/searchStr'
            })
        },
        methods: {
            ...mapMutations({
                setSearchStr: 'person/setSearchStr',
                setArea: 'person/setArea',
                setPagination: 'person/setPagination',
                resetPerson: 'person/resetPerson',
                resetPosterImageList: 'person/resetPosterImageList'
            }),
            ...mapActions({
                getPersonList: 'person/getPersonList'
            }),
            // 获取人物列表
            areaLabel(areaValue) {
                return this.areaOptions.find((areaItem) => areaItem.value === areaValue).label;
            },
            mainRoleLabel(mainRoleValue) {
                return this.mainRoleOptions.find((mainRoleItem) => mainRoleItem.value === mainRoleValue).label;
            },
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handleSizeChange(pageSize) {
                this.setPagination({pageSize});
                this.getPersonList({isProgramme: false});
            },
            handleCurrentChange(pageNum) {
                this.setPagination({pageNum});
                this.getPersonList({isProgramme: false});
            },
            areaChangeHandler(value) {
                this.setArea({area: value});
                this.getPersonList({isProgramme: false});
            },
            inputChangeHandler(searchStr) {
                this.setSearchStr({searchStr});
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
<style scoped lang="less">
</style>

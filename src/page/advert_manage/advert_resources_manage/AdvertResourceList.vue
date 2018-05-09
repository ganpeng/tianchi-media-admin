<!-- 广告列表页面 -->
<template>
    <div class="advert-resource-list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>广告资源列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input v-model="filter.name" placeholder="请输入素材名称">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item label="素材格式">
                <el-select
                    v-model="filter.format"
                    filterable
                    clearable
                    placeholder="请选择素材格式"
                    >
                    <el-option
                        v-for="item in formatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="素材尺寸">
                <el-select
                    v-model="filter.dimension"
                    filterable
                    clearable
                    placeholder="请选择素材尺寸"
                    >
                    <el-option
                        v-for="item in dimensionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button @click="createAdvert">新增广告资源</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="advertList" border style="width:100%">
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column label="素材预览" align="center" >
                <template slot-scope="scope">
                    <img class="person-image" :src="scope.row.avatar" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="素材名称">
                <template slot-scope="scope">
                    <div @dblclick="editName(scope.row.id)">
                        <el-input v-if="scope.row.isEdit" @blur="saveAdvertName(scope.row.id)" v-model="scope.row.name" placeholder="请输入内容"></el-input>
                        <p v-if="!scope.row.isEdit">{{scope.row.name}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="format" align="center" width="300px" label="素材格式"></el-table-column>
            <el-table-column prop="dimension" align="center" label="素材尺寸"></el-table-column>
            <el-table-column prop="size" align="center" label="素材大小"></el-table-column>
            <el-table-column align="center" label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteAdvert(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-dialog :title="dialogTitle" :visible.sync="advertFormDialog">
            <advert-form :dimensionOptions="dimensionOptions"></advert-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="hideAdvertFormDialog">取 消</el-button>
                <el-button v-if="dialogStatus !== 2" type="primary" @click="hideAdvertFormDialog">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import AdvertForm from './AdvertForm';
import obj from '@/util/config/advert_dimension';
export default {
    name: 'AdvertResourceList',
    components: {
        AdvertForm
    },
    data() {
        return {
            pageSize: 5,
            totalAmount: 11,
            advertFormDialog: false,
            currentPage: 1,
            dialogStatus: 1, // 0 代表新增， 1 代表编辑， 2 代表显示
            filter: {
                format: '',
                dimension: '',
                name: ''
            },
            advert: {
                name: '',
                dimension: ''
            },
            advertList: [
                {
                    id: 1,
                    preview: '素材预览',
                    name: '广告图片名称',
                    format: 'jpg',
                    dimension: '1232*3432',
                    size: '5M',
                    isEdit: false,
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                },
                {
                    id: 2,
                    preview: '素材预览',
                    name: '广告图片名称',
                    format: 'jpg',
                    dimension: '1232*3432',
                    size: '4M',
                    isEdit: false,
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                }
            ],
            dimensionOptions: obj.ADVERT_DIMENSION,
            formatOptions: [
                {
                    value: 'jpg',
                    label: 'jpg'
                },
                {
                    value: 'png',
                    label: 'png'
                }
            ]
        };
    },
    computed: {
        dialogTitle() {
            switch (this.dialogStatus) {
                case 0:
                    return '新增广告资源';
                case 1:
                    return '编辑广告资源';
                case 2:
                    return '显示广告资源';
                default:
                    return '新增广告资源';
            }
        }
    },
    methods: {
        showAdvertFormDialog() {
            this.advertFormDialog = true;
        },
        hideAdvertFormDialog() {
            this.advertFormDialog = false;
        },
        createAdvert() {
            this.dialogStatus = 0;
            this.showAdvertFormDialog();
        },
        deleteAdvert(id) {
            // Todo
        },
        editName(id) {
            let advert = this.advertList.find((advert) => advert.id === id);
            advert.isEdit = !advert.isEdit;
        },
        saveAdvertName(id) {
            this.editName(id);
        },
        handleSizeChange() {},
        handleCurrentChange() {}
    }
};
</script>
<style lang="less" scoped>
</style>

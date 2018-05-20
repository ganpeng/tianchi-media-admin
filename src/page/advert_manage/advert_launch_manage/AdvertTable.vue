<!--  广告的表格组件 -->
<template>
    <div class="advert-table-container">
        <!-- 已经选中的广告的表格 -->
        <el-table :data="checkedAdvertList" border style="width:100%;margin-left:0">
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column label="素材预览" align="center" >
                <template slot-scope="scope">
                    <img width="100px" height="60px" :src="scope.row.img" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="素材名称"></el-table-column>
            <el-table-column prop="format" align="center" label="素材格式"></el-table-column>
            <el-table-column prop="dimension" align="center" label="素材尺寸"></el-table-column>
            <el-table-column prop="size" align="center" label="素材大小"></el-table-column>
            <el-table-column align="center" label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteCheckedAdvert(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        </el-form>
        <el-table :data="advertList" border style="width:100%;margin-left:0">
            <el-table-column prop="id" align="center" label="选择">
                <template slot-scope="scope">
                    <el-checkbox @change="advertChangeHandler($event, scope.row.id)" v-model="scope.row.checked"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column label="素材预览" align="center" >
                <template slot-scope="scope">
                    <img width="100px" height="60px" :src="scope.row.img" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="素材名称"></el-table-column>
            <el-table-column prop="format" align="center" label="素材格式"></el-table-column>
            <el-table-column prop="dimension" align="center" label="素材尺寸"></el-table-column>
            <el-table-column prop="size" align="center" label="素材大小"></el-table-column>
            <el-table-column align="center" label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
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
    </div>
</template>
<script>
import constantObj from '@/util/config/image_dimension';
export default {
    name: 'AdvertTable',
    props: {
        advertList: {
            type: Array,
            default: () => []
        }
    },
    created() {
        this.checkedAdvertList = this.advertList.filter((advert) => advert.checked);
    },
    data() {
        return {
            pageSize: 5,
            totalAmount: 11,
            currentPage: 1,
            filter: {
                format: '',
                dimension: '',
                name: ''
            },
            checkedAdvertList: [],
            dimensionOptions: constantObj.image_dimension,
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
    methods: {
        advertChangeHandler(checked, id) {
            let advert = this.advertList.find((advert) => advert.id === id);
            if (checked) {
                this.checkedAdvertList.push(advert);
            } else {
                this.checkedAdvertList = this.checkedAdvertList.filter((advert) => advert.id !== id);
            }
        },
        deleteCheckedAdvert(id) {
            let advert = this.advertList.find((advert) => advert.id === id);
            if (advert) {
                advert.checked = false;
            }
            this.checkedAdvertList = this.checkedAdvertList.filter((advert) => advert.id !== id);
        },
        handleSizeChange() {},
        handleCurrentChange() {}
    }
};
</script>
<style lang="less" scoped>
</style>

<!--  广告组弹窗内的表格组件 -->
<template>
    <div class="advert-table-container">
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input v-model="filter.name" placeholder="请输入广告组名称">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button @click="createAdvertGroup">新增广告组</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="advertGroupList" border style="width:100%">
            <el-table-column prop="id" align="center" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="广告组名称"></el-table-column>
            <el-table-column label="广告图片" align="center" :width="imgColWidth">
                <template slot-scope="scope">
                    <div class="img-wrapper">
                        <img width="100px" height="60px" v-for="(item, index) in scope.row.imgList" :key="index" :src="item" alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" width="150px" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column v-if="!noLink" prop="size" align="center" label="跳转链接">
                <template slot-scope="scope">
                    <a href="http://www.baidu.com">百度</a>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editAdvertGroup(scope.row.id)">编辑</el-button>
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
        <advert-group-dialog :type="type" :dialogStatus="dialogStatus" :dialogVisible="dialogVisible"  v-on:closeDialog="changeDialogVisible($event)"></advert-group-dialog>
    </div>
</template>
<script>
import AdvertGroupDialog from './AdvertGroupDialog';
export default {
    name: 'AdvertTable',
    components: {
        AdvertGroupDialog
    },
    props: {
        type: {
            type: Number
        }
    },
    data() {
        return {
            pageSize: 5,
            totalAmount: 11,
            currentPage: 1,
            dialogVisible: false,
            dialogStatus: 0, // 0 表示新增， 1 表示编辑
            filter: {
                format: '',
                dimension: '',
                name: ''
            },
            advertGroupList: [
                {
                    id: 1,
                    name: '广告图片名称',
                    imgList: [
                        'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        'http://photocdn.sohu.com/20160107/Img433729049.jpg',
                        'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg',
                        'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                    ],
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                },
                {
                    id: 2,
                    name: '广告图片名称',
                    imgList: [
                        'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg'
                    ],
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                }
            ]
        };
    },
    methods: {
        createAdvertGroup() {
            this.dialogVisible = true;
            this.dialogStatus = 0;
        },
        handleSizeChange() {},
        handleCurrentChange() {},
        editAdvertGroup() {
            this.dialogVisible = true;
            this.dialogStatus = 1;
        },
        changeDialogVisible(status) {
            this.dialogVisible = status;
        }
    },
    computed: {
        imgColWidth() {
            let advertGroupList = JSON.parse(JSON.stringify(this.advertGroupList));
            let len = advertGroupList.sort((prev, curr) => curr.imgList.length - prev.imgList.length)[0].imgList.length;
            return (len * 100) + ((len + 1) * 10) + 'px';
        },
        noLink() {
            return this.type === 4 || this.type === 5 || this.type === 6;
        }
    }
};
</script>
<style lang="less" scoped>
.img-wrapper {
    display: flex;
    img + img {
        margin-left: 10px;
    }
}
</style>

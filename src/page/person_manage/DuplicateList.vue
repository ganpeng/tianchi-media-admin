<!--人物列表组件-->
<template>
    <div class="duplicate-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="duplicate.searchFields.name"
                            @input="inputHandler($event, 'name')"
                            clearable
                            class="border-input"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" icon="el-icon-search" type="primary" plain>搜索</el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">重复人物列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left"></div>
                    <div class="float-right">
                        <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
                    </div>
                </div>
                <el-table :row-class-name='"figure-row"' :header-row-class-name='"common-table-header"' class="my-table-style" :data="duplicate.list" border>
                    <el-table-column prop="id" align="center" width="120px" label="编号">
                        <template slot-scope="scope">
                            {{scope.row.id | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="名字">
                        <template slot-scope="scope">
                            <span
                                @click="displayPerson(scope.row.id)"
                                class="ellipsis three name">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="alias" align="center" label="别名">
                        <template slot-scope="scope">
                            {{cutStr20(scope.row.alias) | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column label="照片" width="120px" align="center" >
                        <template slot-scope="scope">
                            <img v-if="scope.row.avatarImage" @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )" class="pointer person-image" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
                            <span v-else>------</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="area" align="center" label="地区">
                        <template slot-scope="scope">
                            {{areaLabel(scope.row.area) | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainRole" align="center" label="职业">
                        <template slot-scope="scope">
                            <span class="ellipsis three">
                                {{mainRoleLabel(scope.row.mainRoleList).join(', ') | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <input
                                class="my-switch switch-anim"
                                type="checkbox"
                                :checked="scope.row.visible"
                                @click.prevent="_lowerFramePerson(scope.row)"/>
                            <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                            <i v-else class="off-the-shelf">已下架</i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="editPerson(scope.row.id)">编辑</span>
                                <span class="btn-text text-danger" @click="_deletePerson(scope.row.id)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="duplicate.pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="duplicate.pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="duplicate.pagination.total">
        </el-pagination>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
    import role from '../../util/config/role';
    export default {
        name: 'DuplicateList',
        components: {
            PreviewSingleImage
        },
        data() {
            return {
                areaOptions: store.get('areaList'),
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
                }
            };
        },
        created() {
            this.getDuplicateList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        beforeRouteLeave(to, from, next) {
            let {name} = to;
            if (name !== 'DisplayPerson' && name !== 'EditPerson') {
            }
            next();
        },
        computed: {
            ...mapGetters({
                duplicate: 'person/duplicate',
                list: 'person/list',
                searchFields: 'person/searchFields',
                pagination: 'person/pagination',
                mainRoleLabel: 'person/mainRoleLabel'
            })
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'person/updateSearchFields',
                updatePagination: 'person/updatePagination',
                resetSearchFields: 'person/resetSearchFields',
                resetPagination: 'person/resetPagination',
                // 人物去重部分
                resetDuplicatePagination: 'person/resetDuplicatePagination',
                setDuplicateList: 'person/setDuplicateList',
                setDuplicatePagination: 'person/setDuplicatePagination',
                updateDuplicatePagination: 'person/updateDuplicatePagination',
                updateDuplicateSearchFields: 'person/updateDuplicateSearchFields'
            }),
            ...mapActions({
                lowerFramePerson: 'person/lowerFramePerson',
                deletePerson: 'person/deletePerson',
                getDuplicateList: 'person/getDuplicateList'
            }),
            searchHandler() {
                this.resetDuplicatePagination();
                this.getDuplicateList({isProgramme: false});
            },
            clearSearchFields() {
                this.resetSearchFields();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.getDuplicateList();
                }
            },
            createPerson() {
                this.$router.push({ name: 'CreatePerson' });
            },
            areaLabel(code) {
                let reg = /^\d+(\.\d+)?$/;
                if (reg.test(code)) {
                    let area = this.areaOptions.find((area) => area.code === code);
                    return area ? area.name : '';
                } else {
                    return code;
                }
            },
            cutStr20(value) {
                return this.$util.cutStr(value, 19);
            },
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handlePaginationChange(value, key) {
                this.updateDuplicatePagination({value, key});
                this.getDuplicateList();
            },
            inputHandler(value, key) {
                this.updateDuplicateSearchFields({key, value});
            },
            _lowerFramePerson(person) {
                let {id, visible} = person;
                this.$confirm(`您确定要${visible ? '下架人物' : '上架人物'}吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.lowerFramePerson(id)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.$message.success(`人物${visible ? '下架' : '上架'}成功`);
                                    this.getDuplicateList();
                                } else {
                                    this.$message.error(this.lowerFramePersonErrorHandler(res));
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            lowerFramePersonErrorHandler(res) {
                let {code, data, message} = res;
                let msg = '';
                switch (code) {
                    case 3206:
                        msg = data.map((item) => {
                            return item ? `"${item}"` : '';
                        }).join(',');
                        return `人物包含在如下${msg}专题中`;
                    case 3207:
                        msg = data.map((item) => {
                            return item ? `"${item}"` : '';
                        }).join(',');
                        return `人物包含在如下${msg}推荐位`;
                    case 3208:
                        msg = data.map((item) => {
                            let obj = role.RECOMMEND_OPTIONS.find((ele) => ele.value === item);
                            return obj ? `"${obj.name}"` : '';
                        }).join(', ');
                        return `人物在以下栏目${msg}中是热门人物`;
                    default:
                        return message;
                }
            },
            _deletePerson(id) {
                this.$confirm(`您确定要删除该人物吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.deletePerson(id)
                            .then((res) => {
                                if (res && res.code === 0) {
                                    this.$message.success('人物删除成功');
                                    this.getDuplicateList();
                                } else {
                                    let msg = res.message || '人物删除失败';
                                    this.$message.error(msg);
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            // 重复人物查询
            getDuplicateListHandler() {
                this.getDuplicateList();
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
            },
            goBack() {
                this.$router.back();
            },
            //  人物导入
            submitUpload() {
                this.$refs.upload.submit();
            },
            closeFileUploadDialog() {
                this.fileUploadDialogVisible = false;
                this.fileList = [];
            },
            showFileUploadDialog() {
                this.fileUploadDialogVisible = true;
            },
            uploadSuccessHandler(res, file, fileList) {
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '人物导入成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '人物导入失败'
                    });
                }
                this.closeFileUploadDialog();
            }
        }
    };
</script>
<style scoped lang="less">
.btn-wrapper .el-button {
    &:nth-of-type(2n + 1) {
        margin-left: 10px;
    }
}
.person-image {
    width: 80px;
    height: 80px;
}
</style>

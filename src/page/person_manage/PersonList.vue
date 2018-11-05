<!--人物列表组件-->
<template>
    <div class="person-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.name"
                            clearable
                            class="border-input"
                            @input="inputHandler($event, 'name')"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="getPersonList" icon="el-icon-search" type="primary" plain>搜索</el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">地区</label>
                        <el-select
                            :value="searchFields.area"
                            filterable
                            clearable
                            placeholder="请选择地区"
                            @input="inputHandler($event, 'area')">
                            <el-option
                                v-for="(item, index) in areaOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">人物列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left"></div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createPerson">
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
                            @click="getDuplicateListHandler">
                            <svg-icon icon-class="upload"></svg-icon>
                            查重
                        </el-button>
                    </div>
                </div>
                <el-table :row-class-name='"figure-row"' :header-row-class-name='"common-table-header"' class="my-table-style" :data="list" border>
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
                    <el-table-column label="照片" width="120px" align="center" >
                        <template slot-scope="scope">
                            <img v-if="scope.row.avatarImage" @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )" width="100px" height="100px" class="pointer" :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
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
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <el-dialog
            title="上传人物表格"
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
                action="/admin/v1/content/figure/import"
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
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
    import role from '../../util/config/role';
    export default {
        name: 'PersonList',
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
                },
                //  人物导入
                fileUploadDialogVisible: false,
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token)
            };
        },
        created() {
            this.getPersonList({isProgramme: false});
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        beforeRouteLeave(to, from, next) {
            let {name} = to;
            if (name !== 'DisplayPerson' && name !== 'EditPerson') {
                this.resetSearchFields();
                this.resetPagination();
            }
            next();
        },
        computed: {
            ...mapGetters({
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
                resetPagination: 'person/resetPagination'
            }),
            ...mapActions({
                getPersonList: 'person/getPersonList',
                lowerFramePerson: 'person/lowerFramePerson',
                deletePerson: 'person/deletePerson',
                getDuplicateList: 'person/getDuplicateList'
            }),
            clearSearchFields() {
                this.resetSearchFields();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.getPersonList({isProgramme: false});
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
            // 跳转到详情页面
            displayPerson(userId) {
                this.$router.push({ name: 'DisplayPerson', params: { id: userId } });
            },
            editPerson(userId) {
                this.$router.push({ name: 'EditPerson', params: { id: userId } });
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('personPageSize', value);
                }
                this.getPersonList({isProgramme: false});
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
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
                                    this.getPersonList({isProgramme: false});
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
                                    this.getPersonList({isProgramme: false});
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
                this.$router.push({ name: 'DuplicateList' });
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
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
.btn-style-one {
    margin-left: 10px;
}
</style>

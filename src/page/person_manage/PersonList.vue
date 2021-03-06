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
                    <el-button class="btn-style-one" @click="searchHandler" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">地区</label>
                        <el-select
                            :value="searchFields.area"
                            filterable
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'area')">
                            <el-option
                                v-for="(item, index) in areaOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">关联</label>
                        <el-select
                            :value="searchFields.refCount"
                            filterable
                            clearable
                            placeholder="全部"
                            @input="inputHandler($event, 'refCount')">
                            <el-option
                                v-for="(item, index) in [{name: '是', value: 1}, {name: '否', value: 0}]"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">人物列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <div v-show="isDisabled" class="my-disabled-dropdown">
                            批量操作
                            <i class="el-icon-arrow-down"></i>
                        </div>
                        <el-dropdown
                            trigger="click"
                            v-show="!isDisabled"
                            class="my-dropdown">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <span @click="multUpFramePersonHandler">批量上架</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="multLowerFramePersonHandler">批量下架</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="batchDeletPersonHandler">批量删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <sort-item :sortKeyList="[{label: '更新时间', value: 'UPDATED_AT'}]" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createPerson">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="gotoPersonImportPage">
                            <svg-icon icon-class="import"></svg-icon>
                            导入
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="getDuplicateListHandler">
                            <svg-icon icon-class="duplication"></svg-icon>
                            查重
                        </el-button>
                    </div>
                </div>
                <el-table
                    @select="selectHandler"
                    @sort-change="sortChangeHandler"
                    @select-all="selectAllHandler"
                    :row-class-name='"figure-row"' :header-row-class-name='"common-table-header"' class="my-table-style"
                    :data="list" border>
                    <el-table-column type="selection" align="center"></el-table-column>
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
                    <!--
                    <el-table-column align="center" label="背景">
                        <template slot-scope="scope">
                            {{scope.row.backgroundImage && scope.row.backgroundImage.uri ? '有' : '无'}}
                        </template>
                    </el-table-column>
                    -->
                    <el-table-column label="照片" width="120px" align="center">
                        <template slot-scope="scope">
                            <img v-if="scope.row.avatarImage"
                                 @click="displayImage(scope.row.avatarImage ? scope.row.avatarImage : {} )"
                                 width="100px" height="100px" class="person-image pointer"
                                 :src="scope.row.avatarImage ? scope.row.avatarImage.uri :'' | imageUrl" alt="">
                            <span v-else>------</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" label="关联">
                        <template slot-scope="scope">
                            <span @click="displayRelated(scope.row)" v-html="refCount(scope.row.refCount)"></span>
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
                    <el-table-column sortable align="center" prop="updatedAt" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:MM:SS') | padEmpty}}
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
            :page-sizes="[] | pageSizes"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <preview-single-image :singleImage="previewImage"></preview-single-image>
        <display-related-dialog
            type="FIGURE"
            :currentItemInfo="currentItem"
            ref="displayRelatedDialog">
        </display-related-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import _ from 'lodash';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
    import DisplayRelatedDialog from 'sysComponents/custom_components/custom/DisplayRelatedDialog';
    import role from '../../util/config/role';
    import SortItem from 'sysComponents/custom_components/custom/SortItem';
    export default {
        name: 'PersonList',
        components: {
            PreviewSingleImage,
            DisplayRelatedDialog,
            SortItem
        },
        data() {
            return {
                areaOptions: store.get('areaList'),
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
                },
                selectedVideoList: [],
                currentItem: {}
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
            }),
            isDisabled() {
                return this.selectedVideoList.length === 0;
            },
            refCount() {
                return (refCount) => {
                    if (_.isNull(refCount)) {
                        return '<span>无</span>';
                    } else {
                        return `<span class="name">${refCount}</span>`;
                    }
                };
            }
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'person/updateSearchFields',
                updatePagination: 'person/updatePagination',
                resetSearchFields: 'person/resetSearchFields',
                resetPagination: 'person/resetPagination',
                setList: 'person/setPersonList'
            }),
            ...mapActions({
                getPersonList: 'person/getPersonList',
                lowerFramePerson: 'person/lowerFramePerson',
                deletePerson: 'person/deletePerson',
                getDuplicateList: 'person/getDuplicateList'
            }),
            clearSearchFields() {
                if (!this.$authority.isHasAuthority('content:figure:page')) {
                    return;
                }
                this.resetSearchFields();
                this.getPersonList({isProgramme: false});
            },
            searchHandler() {
                if (!this.$authority.isHasAuthority('content:figure:page')) {
                    return;
                }
                this.updatePagination({key: 'pageNum', value: 1});
                this.getPersonList({isProgramme: false});
            },
            keyupHandler(e) {
                if (!this.$authority.isHasAuthority('content:figure:page')) {
                    return;
                }
                if (e.keyCode === 13) {
                    this.getPersonList({isProgramme: false});
                }
            },
            createPerson() {
                if (!this.$authority.isHasAuthority('content:figure:add')) {
                    return;
                }
                let routeData = this.$router.resolve({ name: 'CreatePerson' });
                window.open(routeData.href, '_blank');
            },
            // 跳转到详情页面
            displayPerson(userId) {
                if (!this.$authority.isHasAuthority('content:figure:get')) {
                    return;
                }
                this.$router.push({name: 'DisplayPerson', params: {id: userId}});
            },
            editPerson(userId) {
                if (!this.$authority.isHasAuthority('content:figure:put')) {
                    return;
                }
                this.$router.push({name: 'EditPerson', params: {id: userId}});
            },
            handlePaginationChange(value, key) {
                if (!this.$authority.isHasAuthority('content:figure:page')) {
                    return;
                }
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('personPageSize', value);
                }
                this.getPersonList({isProgramme: false});
            },
            inputHandler(value, key) {
                if (!this.$authority.isHasAuthority('content:figure:page')) {
                    return;
                }
                this.updateSearchFields({key, value});
                if (key !== 'name') {
                    this.updatePagination({key: 'pageNum', value: 1});
                    this.getPersonList({isProgramme: false});
                }
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
            _lowerFramePerson(person) {
                if (!this.$authority.isHasAuthority('content:figure:visible')) {
                    return;
                }

                let {id, visible, avatarImage} = person;
                if (!_.get(avatarImage, 'uri') && !visible) {
                    this.$message.error('没有图片的人物不能上架');
                    return false;
                }
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
                if (!this.$authority.isHasAuthority('content:figure:delete')) {
                    return;
                }
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
                this.$router.push({name: 'DuplicateList'});
            },
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
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
            gotoPersonImportPage() {
                if (!this.$authority.isHasAuthority('content:figure:import')) {
                    return;
                }
                let routeData = this.$router.resolve({ name: 'PersonImport' });
                window.open(routeData.href, '_blank');
            },
            //  批量操作
            async multUpFramePersonHandler() {
                if (!this.$authority.isHasAuthority('content:figure:batchVisible')) {
                    return;
                }
                let idList = this.selectedVideoList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要上架所有人物吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.batchLowerUpFramePerson(idList, true);
                    if (res && res.code === 0) {
                        this.$message.success(`人物上架成功`);
                        this.selectedVideoList = [];
                        this.getPersonList({isProgramme: false});
                    } else {
                        this.$message.error('批量上架失败');
                    }
                }
            },
            async multLowerFramePersonHandler() {
                if (!this.$authority.isHasAuthority('content:figure:batchVisible')) {
                    return;
                }
                let idList = this.selectedVideoList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要下架所选人物吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.batchLowerUpFramePerson(idList, false);
                    if (res && res.code === 0) {
                        this.$message.success(`人物下架成功`);
                        this.selectedVideoList = [];
                        this.getPersonList({isProgramme: false});
                    } else {
                        this.$message.error('批量下架失败');
                    }
                }
            },
            async batchDeletPersonHandler() {
                if (!this.$authority.isHasAuthority('content:figure:batchDelete')) {
                    return;
                }
                let idList = _.uniq(this.selectedVideoList.map((item) => item.id));
                let confirm = await this.$confirm(`您确定要删除所选人物吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.batchDeletePerson(idList);
                    if (res && res.code === 0) {
                        this.$message.success(`人物删除成功`);
                        this.selectedVideoList = [];
                        this.getPersonList({isProgramme: false});
                    } else {
                        this.$message.error('批量删除失败');
                    }
                }
            },
            displayRelated(item) {
                if (item.refCount && item.refCount > 0) {
                    this.currentItem = item;
                    this.$refs.displayRelatedDialog.showDialog();
                }
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'updatedAt') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.list).sortBy('updatedAt').value();
                    } else {
                        sortedList = _.chain(this.list).sortBy('updatedAt').reverse().value();
                    }
                    this.setList({list: sortedList});
                }
            },
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.updateSearchFields({key: 'sortKey', value: sortKey});
                this.updateSearchFields({key: 'sortDirection', value: sortDirection});
                this.searchHandler();
            }
        }
    };
</script>
<style scoped lang="less">
    .btn-style-one {
        margin-left: 10px;
    }

    .person-image {
        width: 80px;
        height: 80px;
        border: 1px solid #3E495E;
        border-radius: 8px;
    }
</style>

<!-- 节目列表页组件 -->
<template>
    <div class="program-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="programmeSearchFields.keyword"
                            clearable
                            class="border-input"
                            @input="inputHandler($event, 'keyword')"
                            placeholder="搜索你想要的信息">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            :value="programmeSearchFields.visible"
                            @change="inputHandler($event, 'visible')"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in visibleOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">分类</label>
                        <el-select
                            :value="programmeSearchFields.programmeCategoryIdList"
                            @change="inputHandler($event, 'programmeCategoryIdList')"
                            clearable
                            placeholder="全部">
                            <el-option
                                v-for="item in global.categoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">类型</label>
                        <el-select
                            :value="programmeSearchFields.programmeTypeIdList"
                            @change="inputHandler($event, 'programmeTypeIdList')"
                            clearable
                            no-data-text="请先选择分类"
                            placeholder="全部">
                            <el-option
                                v-for="item in programmeTypeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button class="btn-style-one" @click="clearSearchFields">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                    <span
                        @click="toggleSearchField"
                        :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                        更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">发行日期</label>
                        <el-date-picker
                            :value="programmeSearchFields.releaseAtDateRange"
                            type="daterange"
                            @input="inputHandler($event, 'releaseAtDateRange')"
                            value-format="timestamp"
                            :unlink-panels="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div id="multi-selecter" class="search-field-item">
                        <label class="search-field-item-label">适用客户端</label>
                        <el-select
                            :value="programmeSearchFields.applicableClientList"
                            @change="inputHandler($event, 'applicableClientList')"
                            clearable
                            multiple
                            placeholder="全部">
                            <el-option
                                v-for="item in applicableClientListOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">地区</label>
                        <el-select
                            :value="programmeSearchFields.produceAreaList"
                            clearable
                            filterable
                            @change="inputHandler($event, 'produceAreaList')"
                            placeholder="全部"
                        >
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
                            :value="programmeSearchFields.refCount"
                            clearable
                            filterable
                            @change="inputHandler($event, 'refCount')"
                            placeholder="全部"
                        >
                            <el-option
                                v-for="(item, index) in [{name: '是', value: 1}, {name: '否', value: 0}]"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">支付</label>
                        <el-select
                            :value="programmeSearchFields.paymentType"
                            clearable
                            filterable
                            @change="inputHandler($event, 'paymentType')"
                            placeholder="全部"
                        >
                            <el-option
                                v-for="(item, index) in paymentOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">节目列表</h2>
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
                                    <span @click="multUpFrameProgrammeHandler">批量上架</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="multLowerFrameProgrammeHandler">批量下架</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="batchDeletProgrammeHandler">批量删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
                            @click="gotoProgrammeImportPage">
                            <svg-icon icon-class="import"></svg-icon>
                            导入
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportSelectedProgrammeExcel">
                            <svg-icon icon-class="export"></svg-icon>
                            导出
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportAllProgrammeExcel">
                            <svg-icon icon-class="export"></svg-icon>
                            导出全部
                        </el-button>
                    </div>
                </div>
                <el-table
                    ref="multipleTable"
                    @select="selectHandler"
                    @select-all="selectAllHandler"
                    row-class-name="programme-row" header-row-class-name="common-table-header" class="my-table-style"
                    :data="list" border>
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column prop="code" align="center" width="120px" label="节目编号">
                        <template slot-scope="scope">
                            {{scope.row.code | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" align="center" min-width="100px" label="节目名称">
                        <template slot-scope="scope">
                            <span
                                @click="displayProgramme(scope.row.id)"
                                class="ellipsis four name">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="节目图片" width="100px" align="center">
                        <template slot-scope="scope">
                            <img v-if="scope.row.coverImage && scope.row.coverImage.uri" style="width:70px;height:auto;"
                                 @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="pointer"
                                 :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                            <span v-else >{{ '' | padEmpty }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="featureVideoCount" width="100px" align="center" label="正片数量">
                        <template slot-scope="scope">
                            {{scope.row.featureVideoCount | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" label="关联">
                        <template slot-scope="scope">
                            <span @click="displayRelated(scope.row)" v-html="refCount(scope.row.refCount)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" label="会员">
                        <template slot-scope="scope">
                            <span>{{scope.row.paymentType === 'VIP' ? '是' : '否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80px" align="center" label="单点">
                        <template slot-scope="scope">
                            <span>{{scope.row.price ? scope.row.price / 100 : '否'}}</span>
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
                                {{areaLabel(scope.row.produceAreaList).map((area) => area.name).join(', ') | padEmpty}}
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
                            <input
                                class="my-switch switch-anim"
                                type="checkbox"
                                :checked="scope.row.visible"
                                @click.prevent="lowerFrameProgramme(scope.row)"/>
                            <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                            <i v-else class="off-the-shelf">已下架</i>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="100px" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="editProgramme(scope.row.id)">编辑</span>
                                <span :class="['btn-text', 'text-danger', scope.row.visible ? 'not-allowed' : '']" @click="_realDeleteProgramme(scope.row)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
                <!-- :page-sizes="[10, 30, 50, 100, 200, 300,500]" -->
            <el-pagination
                @size-change="handlePaginationChange($event, 'pageSize')"
                @current-change="handlePaginationChange($event, 'pageNum')"
                :current-page="programmePagination.pageNum"
                :page-sizes="[] | pageSizes"
                :page-size="programmePagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="programmePagination.total">
            </el-pagination>
        </div>
        <preview-single-image :singleImage="previewImage"></preview-single-image>
        <display-related-dialog
            type="PROGRAMME"
            :currentItemInfo="currentItem"
            ref="displayRelatedDialog">
        </display-related-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import store from 'store';
    import _ from 'lodash';
    import XLSX from 'xlsx';
    import role from '@/util/config/role';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
    import DisplayRelatedDialog from 'sysComponents/custom_components/custom/DisplayRelatedDialog';

    export default {
        name: 'ProgrammeList',
        components: {
            PreviewSingleImage,
            DisplayRelatedDialog
        },
        data() {
            return {
                //  toggle搜索区域
                searchFieldVisible: false,
                //  选择数据
                areaOptions: store.get('areaList'),
                fileUploadDialogVisible: false,
                fileList: [],
                selectedVideoList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
                applicableClientListOption: role.APPLICABLE_CLIENT_LIST_OPTION,
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
                },
                currentItem: {}
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
                getScenarist: 'programme/getScenarist',
                areaLabel: 'programme/areaLabel'
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
            },
            paymentOptions() {
                return role.PAYMENT_OPTIONS;
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
                upLowerFrameProgramme: 'programme/upLowerFrameProgramme',
                batchDeleteProgrammes: 'programme/batchDeleteProgrammes'
            }),
            keyupHandler(e) {
                if (!this.$authority.isHasAuthority('content:programme:page')) {
                    return;
                }
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
                if (!this.$authority.isHasAuthority('content:programme:add')) {
                    return;
                }
                let routeData = this.$router.resolve({
                    name: 'CreateProgramme'
                });
                window.open(routeData.href, '_blank');
            },
            editProgramme(id) {
                if (!this.$authority.isHasAuthority('content:programme:put')) {
                    return;
                }
                this.$router.push({name: 'EditProgramme', params: {id}});
            },
            displayProgramme(id) {
                if (!this.$authority.isHasAuthority('content:programme:get')) {
                    return;
                }
                this.$router.push({name: 'DisplayProgramme', params: {id}});
            },
            clearSearchFields() {
                if (!this.$authority.isHasAuthority('content:programme:page')) {
                    return;
                }
                this.resetProgrammeSearchFields();
                this.getProgrammeList()
                    .then((res) => {
                        if (res && res.code === 0) {
                            this.checkedVideoList();
                        }
                    });
            },
            inputHandler(value, key) {
                if (!this.$authority.isHasAuthority('content:programme:page')) {
                    return;
                }
                this.updateProgrammeSearchFields({key, value});
                if (key === 'programmeCategoryIdList') {
                    this.updateProgrammeSearchFields({key: 'programmeTypeIdList', value: ''});
                }
                if (key !== 'keyword') {
                    this.updateProgrammePagination({key: 'pageNum', value: 1});
                    this.getProgrammeList();
                }
            },
            searchHandler() {
                if (!this.$authority.isHasAuthority('content:programme:page')) {
                    return;
                }
                this.updateProgrammePagination({key: 'pageNum', value: 1});
                this.getProgrammeList()
                    .then((res) => {
                        if (res && res.code === 0) {
                            this.checkedVideoList();
                        }
                    });
            },
            // 导出选择的节目
            exportSelectedProgrammeExcel() {
                if (!this.selectedVideoList || this.selectedVideoList.length === 0) {
                    this.$message.warning('请选择节目');
                    return;
                }
                let wb = XLSX.utils.book_new();
                let wsData = this.selectedVideoList;
                let ws = XLSX.utils.json_to_sheet(wsData);
                /* Add the worksheet to the workbook */
                XLSX.utils.book_append_sheet(wb, ws, '表1');
                XLSX.writeFile(wb, '节目导出表_' + new Date() + '.xlsx');
            },
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
            },
            handlePaginationChange(value, key) {
                if (!this.$authority.isHasAuthority('content:programme:page')) {
                    return;
                }
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
            async lowerFrameProgramme(programme) {
                try {
                    if (!this.$authority.isHasAuthority('content:programme:visible')) {
                        return;
                    }
                    let {id, visible, refCount} = programme;
                    if (!_.get(programme, 'coverImage.uri') && !visible) {
                        this.$message.error('没有封面图的节目不能上架');
                        return false;
                    }

                    if (refCount > 0) {
                        let confirm = await this.$confirm(`该节目已被关联，如需下架，请先解除其关联关系。`, '提示', {
                            confirmButtonText: '去解除',
                            cancelButtonText: '取消',
                            type: 'error'
                        });
                        if (confirm) {
                            this.displayRelated(programme);
                        }
                    } else {
                        let confirm = await this.$confirm(`您确定要${visible ? '下架节目' : '上架节目'}吗, 是否继续?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        });

                        if (confirm) {
                            let res = await this.deleteProgramme(id);
                            if (res && res.code === 0) {
                                this.$message.success(`节目${visible ? '下架' : '上架'}成功`);
                                let res2 = await this.getProgrammeList();
                                if (res2 && res2.code === 0) {
                                    this.checkedVideoList();
                                }
                            } else {
                                this.$message.warning(this.lowerFrameProgrammeErrorHandler(res));
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
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
                if (!this.$authority.isHasAuthority('content:programme:batchVisible')) {
                    return;
                }
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
                }).catch(() => {});
            },
            multLowerFrameProgrammeHandler() {
                if (!this.$authority.isHasAuthority('content:programme:batchVisible')) {
                    return;
                }
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
                }).catch(() => {});
            },
            batchDeletProgrammeHandler() {
                if (!this.$authority.isHasAuthority('content:programme:batchDelete')) {
                    return;
                }
                let idList = this.selectedVideoList.map((item) => item.id);
                this.$confirm(`您确定要删除选中的节目吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.batchDeleteProgrammes(idList)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success('节目批量删除成功');
                                this.getProgrammeList()
                                    .then((result) => {
                                        if (result && result.code === 0) {
                                            this.checkedVideoList();
                                        }
                                    });
                            } else {
                                this.$message.error(res.data.message);
                            }
                        });
                }).catch(() => {});
            },
            async _realDeleteProgramme(programme) {
                try {
                    if (!this.$authority.isHasAuthority('content:programme:delete')) {
                        return;
                    }
                    let {id, visible} = programme;
                    if (!visible) {
                        let confirm = await this.$confirm(`您确定要删除该节目吗, 是否继续?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'error'
                        });

                        if (confirm) {
                            let res = await this.realDeleteProgramme(id);
                            if (res && res.code === 0) {
                                this.$message.success({message: '节目删除成功'});
                                this.getProgrammeList();
                            } else {
                                let message = res.message || '节目删除失败';
                                this.$message.error({message});
                            }
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
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
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            },
            gotoProgrammeImportPage() {
                if (!this.$authority.isHasAuthority('content:programme:import')) {
                    return;
                }

                let routeData = this.$router.resolve({
                    name: 'ProgrammeImport'
                });
                window.open(routeData.href, '_blank');
            },
            displayRelated(item) {
                if (item.refCount && item.refCount > 0) {
                    this.currentItem = item;
                    this.$refs.displayRelatedDialog.showDialog();
                }
            },
            async exportAllProgrammeExcel() {
                try {
                    if (!this.$authority.isHasAuthority('content:programme:export')) {
                        return;
                    }
                    let res = await this.$service.exportAllProgramme();
                    this.$util.downloadFile(res, `全部节目.xlsx`);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>

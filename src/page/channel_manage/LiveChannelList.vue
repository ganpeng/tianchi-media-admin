<!--直播频道列表组件-->
<template>
    <div class="live-channel-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
        </div>
        <div class="search-field">
            <div class="field-row">
                <div class="search-field-item">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="请输入频道名称或编号"
                        @input="inputHandler($event, 'keyword')"
                        clearable
                        class="border-input"
                    >
                    </el-input>
                </div>
                <el-button class="btn-style-one" @click="searchHandler" type="primary">
                    <svg-icon icon-class="search"></svg-icon>
                    搜索
                </el-button>
                <div class="search-field-item">
                    <label class="search-field-item-label">类型</label>
                    <el-select
                        :value="searchFields.typeIdList"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'typeIdList')"
                    >
                        <el-option
                            v-for="(item, index) in liveChannelTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">
                        回看
                    </label>
                    <el-select
                        :value="searchFields.record"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'record')">
                        <el-option
                            v-for="(item, index) in recordOptinos"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">状态</label>
                    <el-select
                        :value="searchFields.visible"
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
                <el-button class="btn-style-one" type="primary" @click="clearSearchFields">
                    <svg-icon icon-class="reset"></svg-icon>
                    重置
                </el-button>
                <span @click="toggleSearchField"
                      :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                    更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i>
                    <i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
            </div>
            <div v-show="searchFieldVisible" class="field-row second-row-block">
                <div class="search-field-item">
                    <label class="search-field-item-label">拉流</label>
                    <el-select
                        :value="searchFields.cdnPush"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'cdnPush')"
                    >
                        <el-option
                            v-for="(item, index) in [{name: '是', value: true}, {name: '否', value: false}]"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!--
                <div class="search-field-item">
                    <label class="search-field-item-label">公共频道</label>
                    <el-select
                        :value="searchFields.common"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'common')"
                    >
                        <el-option
                            v-for="(item, index) in [{name: '是', value: true}, {name: '否', value: false}]"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                -->
                <div id="multi-selecter" class="search-field-item">
                    <label class="search-field-item-label">适用</label>
                    <el-select
                        :value="searchFields.applicableClientList"
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
                <div class="search-field-item" v-if="false">
                    <label class="search-field-item-label">区域</label>
                    <el-select
                        :value="searchFields.companyCode"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'companyCode')"
                    >
                        <el-option
                            v-for="(item, index) in companyOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div id="multi-selecter" class="search-field-item">
                    <label class="search-field-item-label">推流</label>
                    <el-select
                        :value="searchFields.protocolList"
                        @change="inputHandler($event, 'protocolList')"
                        clearable
                        multiple
                        placeholder="全部">
                        <el-option
                            v-for="item in [{name: 'HLS', value: 'HLS'}, {name: 'UDP', value: 'UDP'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">关联</label>
                    <el-select
                        :value="searchFields.refCount"
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
                <div class="search-field-item">
                    <label class="search-field-item-label">会员</label>
                    <el-select
                        :value="searchFields.paymentType"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'paymentType')">
                        <el-option
                            v-for="(item, index) in [{name: '是', value: 'VIP'}, {name: '否', value: 'FREE'}]"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search-field-item">
                    <label class="search-field-item-label">
                        节目单
                    </label>
                    <el-select
                        :value="searchFields.hasChannelProgramme"
                        clearable
                        placeholder="全部"
                        @input="inputHandler($event, 'hasChannelProgramme')">
                        <el-option
                            v-for="(item, index) in hasChannelProgrammeOptinos"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="tabel-field">
            <h2 class="content-title">频道列表</h2>
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
                                <span @click="multUpFrameChannelHandler">批量恢复</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="multLowerFrameChannelHandler">批量禁播</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="exportAllLiveChannelExcelHandler">全部导出</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!-- <sort-item :sortKeyList="sortKeyList" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item> -->
                </div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createLiveChannel">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createChannelByImportExcel">
                        <svg-icon icon-class="import"></svg-icon>
                        导入
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="editChannelByImportExcel">
                        <svg-icon icon-class="edit"></svg-icon>
                        修改
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="gotoBlankPage('LiveChannelPageImport')">
                        <svg-icon icon-class="upload_playbill"></svg-icon>
                        节目单
                    </el-button>
                </div>
            </div>
            <el-table
                @select="selectHandler"
                @select-all="selectAllHandler"
                @sort-change="sortChangeHandler"
                header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="no" align="center" width="90px" label="台号">
                    <template slot-scope="scope">
                        <span>{{scope.row.no}}</span>
                        <span @click="displayVideoPlayer(scope.row)" v-if="scope.row.visible" class="display-btn"><svg-icon
                            icon-class="channel_video_play"></svg-icon></span>
                        <span v-else class="display-btn disabled"><svg-icon icon-class="channel_video_play"></svg-icon></span>
                    </template>
                </el-table-column>
                <el-table-column prop="innerName" align="center" min-width="120px" label="名称">
                    <template slot-scope="scope">
                        <span @click="displayLiveChannel(scope.row.id)" class="ellipsis two name">
                            {{scope.row.innerName}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" min-width="100px" label="展示名">
                    <template slot-scope="scope">
                        <span @click="displayLiveChannel(scope.row.id)" class="ellipsis two name">
                            {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" min-width="120px" align="center" label="类别">
                    <template slot-scope="scope">
                        <span class="ellipsis two">
                            {{typeName(scope.row.id)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column width="60px" align="center" label="关联">
                    <template slot-scope="scope">
                        <span @click="displayRelated(scope.row)" v-html="refCount(scope.row.refCount)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="60px" align="center" label="会员">
                    <template slot-scope="scope">
                        <span>{{scope.row.paymentType === 'VIP' ? '是' : '否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="multicastIp" min-width="120px" align="center" label="直播地址列">
                    <template slot-scope="scope">
                        <span v-if="scope.row.multicastIp">{{scope.row.multicastIp}}:{{scope.row.multicastPort}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="serverGroup" align="center" min-width="120px" label="服务器组"></el-table-column>
                <el-table-column align="center" width="100px" label="回看录制">
                    <template slot-scope="scope">
                        <span :class="[scope.row.record ? 'yes' : 'no']">
                            {{scope.row.record ? '是' : '否'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="150px" label="回看地址">
                    <template slot-scope="scope">
                        <span v-if="(scope.row.recordIp && scope.row.recordPort)">{{scope.row.recordIp}}:{{scope.row.recordPort}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="回看组">
                    <template slot-scope="scope">
                        <span v-if="scope.row.record">{{scope.row.recordServerGroup}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <!--
                <el-table-column align="center" width="120px" label="公共频道">
                    <template slot-scope="scope">
                        <span :class="[scope.row.common ? 'yes' : 'no']">
                            {{scope.row.common ? '是' : '否'}}
                        </span>
                    </template>
                </el-table-column>
                -->
                <el-table-column align="center" width="120px" label="推流方式">
                    <template slot-scope="scope">
                        {{scope.row.protocolList ? scope.row.protocolList.join(', ') : ''}}
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="适用">
                    <template slot-scope="scope">
                        {{scope.row.applicableClientList ? scope.row.applicableClientList.join(', ') : ''}}
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="节目单">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.hasChannelProgramme"
                            class="btn-text"
                            @click="previewChannelPage(scope.row.id)">查看</span>
                        <span v-else>/</span>
                        <!--<div @click="previewChannelPage(scope.row.id)">查看</div>-->
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="cdn拉流">
                    <template slot-scope="scope">
                        <span :class="[scope.row.cdnPush ? 'yes' : 'no']">
                            {{scope.row.cdnPush ? '是' : '否'}}
                        </span>
                        <svg-icon
                            v-if="scope.row.cdnPush"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="scope.row.pullAddress">
                        </svg-icon>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="启用/禁用">
                    <template slot-scope="scope">
                        <input
                            class="my-switch switch-anim"
                            type="checkbox"
                            :checked="scope.row.visible"
                            @click.prevent="_lowerFrameLiveChannel(scope.row)"/>
                        <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                        <i v-else class="off-the-shelf">禁播</i>
                    </template>
                </el-table-column>
                <el-table-column width="112px" align="center" label="操作">
                    <template slot-scope="scope">
                        <div id="channel-operator" class="operator-btn-wrapper">
                            <!--<el-dropdown-->
                            <!--trigger="click"-->
                            <!--class="my-other-dropdown">-->
                            <!--<span class="el-dropdown-link">-->
                            <!--节目单<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                            <!--</span>-->
                            <!--<el-dropdown-menu slot="dropdown">-->
                            <!--<el-dropdown-item>-->
                            <!--<span @click="previewChannelPage(scope.row.id, scope.row.name, true)">下载</span>-->
                            <!--</el-dropdown-item>-->
                            <!--<el-dropdown-item>-->
                            <!--<span @click="previewChannelPage(scope.row.id)">预览</span>-->
                            <!--</el-dropdown-item>-->
                            <!--</el-dropdown-menu>-->
                            <!--</el-dropdown>-->
                            <!-- <span class="btn-text" @click="displayVideoPlayer(scope.row)">直播</span> -->
                            <span class="btn-text" @click="editLiveChannel(scope.row.id)">编辑</span>
                            <span class="btn-text text-danger" @click="_deleteLiveChannel(scope.row)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[10, 20, 50,100, 200, 500]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <display-video-dialog ref="displayVideoDialog" :url="url" :title="title"></display-video-dialog>
        <display-related-dialog
            type="FIGURE"
            :currentItemInfo="currentItem"
            ref="displayRelatedDialog">
        </display-related-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import _ from 'lodash';
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
    import DisplayRelatedDialog from 'sysComponents/custom_components/custom/DisplayRelatedDialog';
    import role from '@/util/config/role';
    const ClipboardJS = require('clipboard');
    export default {
        name: 'LiveChannelList',
        components: {
            DisplayVideoDialog,
            DisplayRelatedDialog
        },
        data() {
            return {
                //  节目单上传变量
                isUploading: false,
                files: [],
                count: 0,
                //  节目单上传变量结束
                url: '',
                title: '',
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
                applicableClientListOption: role.APPLICABLE_CLIENT_LIST_OPTION,
                recordOptinos: [
                    {
                        name: '是',
                        value: true
                    },
                    {
                        name: '否',
                        value: false
                    }
                ],
                hasChannelProgrammeOptinos: [
                    {
                        name: '是',
                        value: true
                    },
                    {
                        name: '否',
                        value: false
                    }
                ],
                visibleOptions: [
                    {
                        value: true,
                        label: '正常'
                    },
                    {
                        value: false,
                        label: '禁播'
                    }
                ],
                status: 0,
                searchFieldVisible: false,
                selectedChannelList: [],
                currentItem: {},
                sortKeyList: [
                    {
                        label: '展示名',
                        value: 'NAME'
                    }
                ]
            };
        },
        mounted() {
            this.initClipboard();
        },
        created() {
            if (!this.$authority.isHasAuthority('content:channel:page')) {
                return;
            }

            this.getChannelType();
            this.getChannelList();
            this.getFilialeList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'channel/list',
                pagination: 'channel/pagination',
                typeName: 'channel/typeName',
                filialeList: 'channel/filialeList',
                liveChannelTypeList: 'channel/liveChannelTypeList',
                searchFields: 'channel/searchFields'
            }),
            companyOptions() {
                let {common} = this.searchFields;
                if (common) {
                    return [];
                } else {
                    return this.filialeList;
                }
            },
            isDisabled() {
                return this.selectedChannelList.length === 0;
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
                setLiveChannel: 'channel/setLiveChannel',
                updatePagination: 'channel/updatePagination',
                updateSearchFields: 'channel/updateSearchFields',
                resetSearchFields: 'channel/resetSearchFields',
                setList: 'channel/setList'
            }),
            ...mapActions({
                getChannelType: 'channel/getChannelType',
                getChannelList: 'channel/getChannelList',
                deleteChannelById: 'channel/deleteChannelById',
                getLiveChannelById: 'channel/getLiveChannelById',
                getChannelPageById: 'channel/getChannelPageById',
                getFilialeList: 'channel/getFilialeList'
            }),
            clearSearchFields() {
                if (!this.$authority.isHasAuthority('content:channel:page')) {
                    return;
                }
                this.resetSearchFields();
                this.getChannelList();
            },
            keyupHandler(e) {
                if (!this.$authority.isHasAuthority('content:channel:page')) {
                    return;
                }
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            handlePaginationChange(value, key) {
                if (!this.$authority.isHasAuthority('content:channel:page')) {
                    return;
                }
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('channelPageSize', value);
                }
                this.getChannelList();
            },
            editChannelByImportExcel() {
                if (!this.$authority.isHasAuthority('content:channel:put')) {
                    return;
                }
                let routeData = this.$router.resolve({name: 'EditLiveChannelByImportExcel'});
                window.open(routeData.href, '_blank');
            },
            previewChannelPage(id, name, flag) {
                if (!this.$authority.isHasAuthority('content:programme:liveProgrammeList')) {
                    return;
                }
                this.$router.push({name: 'PreviewProgrammeList', params: {id}});
                // this.getChannelPageById(id).then((res) => {
                //     if (res && res.code === 0) {
                //         let data = res.data.map((item) => {
                //             item.startTime = this.timeStampFormat(item.startTime);
                //             item.endTime = this.timeStampFormat(item.endTime);
                //             return item;
                //         });
                //         let xml = x2js.json2xml_str({'频道': {'节目': data}});
                //         let blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>', xml], {type: 'application/xml'});
                //         if (flag) {
                //             this.openDownloadDialog(blob, `${name}.xml`);
                //         } else {
                //             if (res.data.length > 0) {
                //                 this.$router.push({name: 'PreviewProgrammeList', params: {id}});
                //             } else {
                //                 this.$message.error('当前频道下没有节目单');
                //                 return false;
                //             }
                //         }
                //     }
                // });
            },
            openDownloadDialog(url, saveName) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            inputHandler(value, key) {
                if (!this.$authority.isHasAuthority('content:channel:page')) {
                    return;
                }
                this.updateSearchFields({key, value});
                if (key !== 'keyword') {
                    this.updatePagination({key: 'pageNum', value: 1});
                    this.getChannelList();
                }
            },
            async _deleteLiveChannel(channel) {
                try {
                    if (!this.$authority.isHasAuthority('content:channel:delete')) {
                        return;
                    }
                    let {id, visible} = channel;
                    if (visible) {
                        this.$message.warning('该频道为正常状态，暂时不能删除');
                        return false;
                    }
                    let confirm = await this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                    if (confirm) {
                        let res = await this.deleteChannelById(id);
                        if (res && res.code === 0) {
                            this.$message.success('删除成功');
                            this.getChannelList();
                        } else {
                            this.$message.error(res.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _lowerFrameLiveChannel(channel) {
                try {
                    if (!this.$authority.isHasAuthority('content:channel:visible')) {
                        return;
                    }
                    let {id, visible} = channel;
                    let message = `${visible ? '禁播' : '恢复'}`;
                    let confirm = await this.$confirm(`此操作将${message}该频道, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    });
                    if (confirm) {
                        let res = await this.$service.setChannelVisible(id);
                        if (res && res.code === 0) {
                            this.$message.success(`频道${message}成功`);
                            this.getChannelList();
                        } else {
                            this.$message.error(res.message);
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            createLiveChannel() {
                if (!this.$authority.isHasAuthority('content:channel:add')) {
                    return;
                }
                let routeData = this.$router.resolve({name: 'CreateLiveChannel'});
                window.open(routeData.href, '_blank');
            },
            editLiveChannel(id) {
                if (!this.$authority.isHasAuthority('content:channel:put')) {
                    return;
                }
                this.$router.push({name: 'EditLiveChannel', params: {id}});
            },
            // 批量创建直播频道
            createChannelByImportExcel() {
                if (!this.$authority.isHasAuthority('content:channel:liveImport')) {
                    return;
                }
                let routeData = this.$router.resolve({name: 'LiveChannelImport'});
                window.open(routeData.href, '_blank');
            },
            searchHandler() {
                if (!this.$authority.isHasAuthority('content:channel:page')) {
                    return;
                }
                this.updatePagination({key: 'pageNum', value: 1});
                this.getChannelList();
            },
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            gotoBlankPage(name) {
                if (!this.$authority.isHasAuthority('content:programme:liveProgrammeList')) {
                    return;
                }
                let routeData = this.$router.resolve({name});
                window.open(routeData.href, '_blank');
            },
            displayVideoPlayer(channel) {
                let {name, hlsPlayUrl} = channel;
                this.url = hlsPlayUrl;
                this.title = name;
                this.$refs.displayVideoDialog.showDialog();
            },
            displayLiveChannel(id) {
                if (!this.$authority.isHasAuthority('content:channel:get')) {
                    return;
                }
                this.$router.push({name: 'LiveChannelDetail', params: {id}});
            },
            toggleSearchField() {
                this.searchFieldVisible = !this.searchFieldVisible;
            },
            selectHandler(list, row) {
                let isSelected = list.findIndex((item) => item.id === row.id) >= 0;
                if (isSelected) {
                    this.selectedChannelList.push(row);
                } else {
                    this.selectedChannelList = this.selectedChannelList.filter((item) => item.id !== row.id);
                }
            },
            selectAllHandler(list) {
                if (list.length > 0) {
                    this.selectedChannelList = _.uniqBy(this.selectedChannelList.concat(list), 'id');
                } else {
                    this.selectedChannelList = this.selectedChannelList.filter((item) => {
                        let index = this.list.findIndex((programme) => {
                            return programme.id === item.id;
                        });
                        return index < 0;
                    });
                }
            },
            async multUpFrameChannelHandler() {
                if (!this.$authority.isHasAuthority('content:channel:batchVisible')) {
                    return;
                }
                let idList = this.selectedChannelList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要恢复所选频道吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.batchSetChannel({idList, visible: true});
                    if (res && res.code === 0) {
                        this.$message.success(`频道批量恢复成功`);
                        this.selectedChannelList = [];
                        this.getChannelList();
                    } else {
                        this.$message.error('频道批量恢复失败');
                    }
                }
            },
            async multLowerFrameChannelHandler() {
                if (!this.$authority.isHasAuthority('content:channel:batchVisible')) {
                    return;
                }
                let idList = this.selectedChannelList.map((item) => item.id);
                let confirm = await this.$confirm(`您确定要禁播所选频道吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.batchSetChannel({idList, visible: false});
                    if (res && res.code === 0) {
                        this.$message.success(`频道批量禁播成功`);
                        this.selectedChannelList = [];
                        this.getChannelList();
                    } else {
                        this.$message.error('频道批量禁播失败');
                    }
                }
            },
            displayRelated(item) {
                if (item.refCount && item.refCount > 0) {
                    this.currentItem = item;
                    this.$refs.displayRelatedDialog.showDialog();
                }
            },
            async exportAllLiveChannelExcelHandler() {
                try {
                    if (!this.$authority.isHasAuthority('content:channel:export')) {
                        return;
                    }
                    let res = await this.$service.exportAllChannelListExcel({channelCategory: 'LIVE'});
                    this.$util.downloadFile(res, `全部直播频道.xlsx`);
                } catch (err) {
                    console.log(err);
                }
            },
            initClipboard() {
                let clipboard = new ClipboardJS('.copy-btn');
                clipboard.on('success', (e) => {
                    this.$message.success('链接复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', (e) => {
                    this.$message.error('链接复制失败');
                });
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'no') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.list).sortBy('no').value();
                    } else {
                        sortedList = _.chain(this.list).sortBy('no').reverse().value();
                    }
                    this.setList({list: sortedList});
                }
                if (prop === 'name') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.list).sortBy('name').value();
                    } else {
                        sortedList = _.chain(this.list).sortBy('name').reverse().value();
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
<style scoped lang="scss">
    .my-other-dropdown {
        border: none;
        color: $mainColor;
        width: 70px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        background: transparent;
    }

    .yes {
        color: $successColor;
    }

    .no {
        color: $dangerColor;
    }

    .display-btn {
        cursor: pointer;
        &.disabled {
            opacity: 0.3;
        }
    }
</style>
<style lang="scss">
    #channel-operator {
        .el-dropdown {
            border: none;
            width: 70px;
            height: 18px;
            line-height: 18px;
        }
    }

    #multi-selecter {
        input {
            height: 34px !important;
        }
    }

    .btn-text {
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
        color: rgba(25, 137, 250, 1);
    }

    .search-field .field-row {
        &.second-row-block {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            > div.search-field-item {
                margin-right: 10px;
                flex-grow: 0;
                flex-shrink: 1;
            }
        }
    }

</style>

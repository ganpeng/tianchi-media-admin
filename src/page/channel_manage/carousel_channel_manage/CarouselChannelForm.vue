<!--轮播频道编辑页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="channelInfo"
            :model="channelInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="频道名称" prop="name" required>
                <el-input
                    v-model="channelInfo.name"
                    size="medium"
                    placeholder="请填写20个字以内的频道名称">
                </el-input>
            </el-form-item>
            <el-form-item label="内部名称" prop="innerName" required>
                <el-input
                    v-model="channelInfo.innerName"
                    size="medium"
                    placeholder="请填写20个字以内的内部名称">
                </el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input
                    v-model="channelInfo.no"
                    type="number"
                    size="medium"
                    placeholder="请填写频道编号数字，例如'001'">
                </el-input>
            </el-form-item>
            <!--轮播开始时间-->
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                    v-model="channelInfo.startDate"
                    type="date"
                    :disabled="status.indexOf('EDIT') !== -1 && channelInfo.applyStatus === 'ACTIVE'"
                    value-format="timestamp"
                    size="medium"
                    placeholder="请选择日期">
                </el-date-picker>
                <el-time-picker
                    v-model="channelInfo.startPoint"
                    value-format="timestamp"
                    :disabled="status.indexOf('EDIT') !== -1 && channelInfo.applyStatus === 'ACTIVE'"
                    size="medium"
                    placeholder="请选择时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeIdList" required>
                <el-select
                    v-model="channelInfo.typeIdList"
                    multiple
                    size="medium"
                    placeholder="请选择频道类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="组播地址" prop="multicastIp" required>
                <el-input
                    v-model="channelInfo.multicastIp"
                    size="medium"
                    placeholder="请填写组播地址">
                </el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="multicastPort" required>
                <el-input
                    v-model="channelInfo.multicastPort"
                    type="number"
                    size="medium"
                    placeholder="请填写端口号">
                </el-input>
            </el-form-item>
            <el-form-item label="推流方式" prop="protocolList" required>
                <el-checkbox-group v-model="channelInfo.protocolList">
                    <el-checkbox label="HLS"></el-checkbox>
                    <el-checkbox label="UDP"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="tsID" prop="tsId">
                <el-input
                    v-model="channelInfo.tsId"
                    type="number"
                    size="medium"
                    placeholder="请填写tsId">
                </el-input>
            </el-form-item>
            <el-form-item label="serviceID" prop="serviceId">
                <el-input
                    v-model="channelInfo.serviceId"
                    type="number"
                    size="medium"
                    placeholder="请填写serviceId">
                </el-input>
            </el-form-item>
            <!--  新加选项  -->
            <el-form-item label="服务器组" prop="serverGroup">
                <el-input
                    v-model="channelInfo.serverGroup"
                    size="medium"
                    placeholder="请填写所属服务器组">
                </el-input>
            </el-form-item>
            <el-form-item label="会员" prop="paymentType" required>
                <el-radio-group v-model="channelInfo.paymentType">
                    <el-radio label="VIP">是</el-radio>
                    <el-radio label="FREE">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="公共频道" prop="common" required>
                {{channelInfo.common ? '是' : '否'}}
            </el-form-item>
            <el-form-item label="区域码" prop="companyList" required>
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in channelInfo.companyList"
                        closable
                        @close="removeCompany(item, index)"
                        :disable-transitions="false">
                        {{item.name}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    @blur="validateCompanyList"
                    placeholder="请选择区域码"
                    @select="setCompanies">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                    </template>
                    <i v-if="channelInfo.companyList.length !== 0"
                       slot="suffix"
                       @click="removeAllCompany"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'CREATE_CHANNEL'" class="channel-status">
                <label>禁播</label>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'EDIT_CHANNEL'" class="channel-status">
                <el-radio-group v-model="channelInfo.visible">
                    <el-radio :label="true">正常</el-radio>
                    <el-radio :label="false">禁播</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道图" prop="logoUri" required class="channel-logo">
                <label class="tips">(260*260 频道图)</label>
                <div>
                    <img v-if="channelInfo.logoUri" :src="channelInfo.logoUri | imageUrl" class="logo-image">
                    <single-image-uploader
                        :allowResolutions="allowResolutions"
                        :uploadSuccessHandler="uploadSuccessHandler">
                    </single-image-uploader>
                </div>
            </el-form-item>
            <el-form-item class="channel-onplay-info" label-width="20px">
                <!--频道节目信息-->
                <div class="text-left" v-if="status === 'EDIT_CHANNEL'">
                    <h3 class="content-sub-title">频道节目信息</h3>
                    <ul class="channel-info">
                        <li>
                            <span>分组数量：</span>
                            <label>{{carouselGroup.length}}组</label>
                        </li>
                        <li>
                            <span>当前播放组：</span>
                            <label>{{channelInfo.onPlayGroupName ? channelInfo.onPlayGroupName : '暂无当前播放组'}}</label>
                        </li>
                        <li>
                            <span>当前播放：</span>
                            <label class="on-play">
                                {{channelInfo.onPlayVideoName ? channelInfo.onPlayVideoName : '暂无当前播放节目'}}
                            </label>
                        </li>
                        <li>
                            <span>播放时段：</span>
                            <label class="duration">
                                {{channelInfo.onPlayDurationStart | formatDate('yyyy年MM月DD日HH时mm分SS秒')}} -
                                {{channelInfo.onPlayDurationEnd | formatDate('yyyy年MM月DD日HH时mm分SS秒')}}
                            </label>
                        </li>
                    </ul>
                </div>
            </el-form-item>
        </el-form>
        <div class="seperator-line"></div>
        <!--分组与视频-->
        <div class="content-sub-title">分组与视频
            <el-button @click="addVideoGroup" class="contain-svg-icon btn-style-four">
                <svg-icon icon-class="video"></svg-icon>
                添加分组
            </el-button>
            <label class="data-show">共{{carouselGroup.length}}组，实际总播放时长{{carouselGroup |
                getGroupDuration | fromSecondsToTime}}，视频总时长{{carouselGroup | getTotalVideoListDuration |
                fromSecondsToTime}}。</label>
        </div>
        <div class="group-container">
            <draggable element="ul" id="group-list" v-model="carouselGroup">
                <li v-for="(item, index) in carouselGroup"
                    :key="index" :class="{'current-group':item.current}">
                    <div class="header-box">
                        <label>组{{index + 1}}</label>
                        <span v-if="item.duration">{{item.duration | fromSecondsToTime}}</span>
                    </div>
                    <div class="content-box" @click="selectCurrentGroup(index)">
                        <p class="name-box">
                            <label class="ellipsis one">{{item.name}}</label>
                            <span v-if="carouselGroup.length !== 1" @click.stop="removeGroup(index)">
                                <i class="el-icon-circle-close"></i>
                            </span>
                        </p>
                        <p class="no-box">
                            <label>
                                {{item.carouselVideoList.length === 0 ? '暂无视频' : item.carouselVideoList.length + '个视频'}}
                            </label>
                            <span @click.stop="editGroupInfo(index)"><svg-icon icon-class="edit"></svg-icon></span>
                        </p>
                        <p class="duration-box">
                            <label v-if="item.carouselVideoList.length === 0">暂无视频时长</label>
                            <label v-else>{{item.carouselVideoList | getCarouselVideoTime | fromSecondsToTime}}</label>
                        </p>
                    </div>
                </li>
            </draggable>
        </div>
        <!--频道内节目-->
        <div class="video-list-header">
            <div class="group-video-info">
                <div>
                    <span>组{{currentCarouselGroup.index + 1}}</span><label>{{currentCarouselGroup.name}}</label>
                </div>
                <div>
                    <label v-if="currentCarouselGroup.carouselVideoList.length === 0">暂无视频</label>
                    <span v-if="currentCarouselGroup.carouselVideoList.length !== 0">播放时长</span><label
                    v-if="currentCarouselGroup.carouselVideoList.length !== 0">{{currentCarouselGroup.duration |
                    fromSecondsToTime}}</label>
                </div>
                <div>
                    <label v-if="currentCarouselGroup.carouselVideoList.length === 0">暂无总时长</label>
                    <span v-if="currentCarouselGroup.carouselVideoList.length !== 0">{{currentCarouselGroup.carouselVideoList.length}}个视频</span>
                    <label v-if="currentCarouselGroup.carouselVideoList.length !== 0">
                        总时长{{currentCarouselGroup.carouselVideoList | getCarouselVideoTime | fromSecondsToTime}}</label>
                </div>
            </div>
            <el-button @click="popAppendVideoDialogue(0)" class="contain-svg-icon btn-style-four">
                <svg-icon icon-class="video"></svg-icon>
                关联视频
            </el-button>
        </div>
        <el-table
            v-if="currentCarouselGroup.carouselVideoList.length !== 0"
            header-row-class-name="common-table-header"
            :data="currentCarouselGroup.carouselVideoList"
            row-class-name=video-larger-row
            border
            style="width: 100%">
            <el-table-column
                width="60px"
                align="center"
                label="顺序">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                width="120px"
                align="center"
                prop="code"
                label="ID">
            </el-table-column>
            <el-table-column
                prop="originName"
                width="210px"
                align="center"
                label="文件名">
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="360px"
                align="center"
                label="展示名">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="90px"
                label="预览">
                <template slot-scope="scope">
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)">
                            4K
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For4K"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)">
                            1080
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For1080P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)">
                            720
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For720P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)">
                            480
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For480P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                        </svg-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="takeTimeInSec"
                width="90px"
                align="center"
                label="时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                width="60px"
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateVideoStatus(scope.row, scope.$index)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                    <i v-else class="off-the-shelf">禁播</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="排序"
                width="126px"
                class="operate">
                <template slot-scope="scope">
                    <div class="sort">
                        <span @click="movePosition('UP',scope.row,scope.$index)">
                            <svg-icon icon-class="move_up"></svg-icon>
                            上移
                        </span>
                        <span @click="movePosition('TOP',scope.row,scope.$index)">
                            置顶
                            <svg-icon icon-class="move_top"></svg-icon></span>
                        <span @click="movePosition('DOWN',scope.row,scope.$index)">
                            <svg-icon icon-class="move_down"></svg-icon>
                            下移
                        </span>
                        <span @click="movePosition('BOTTOM',scope.row,scope.$index)">
                            置底
                            <svg-icon icon-class="move_bottom"></svg-icon>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="popAppendVideoDialogue(scope.$index + 1)">添加</span>
                        <span class="btn-text text-danger" @click="removeConfirm(scope.$index,scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--排序工具-->
        <div id="sort-tool" v-if="currentCarouselGroup.carouselVideoList.length !== 0">
            <div class="sort-header" @click="sortToolVisible = !sortToolVisible">
                <label>排序工具</label>
                <i class="el-icon-arrow-down" v-if="sortToolVisible"></i>
                <i class="el-icon-arrow-right" v-else></i>
            </div>
            <div class="sort-body" v-if="sortToolVisible">
                <ul>
                    <li v-for="(item, index) in sectionList" :key="index">
                        <el-input v-model="item.name" placeholder="请填写'部'的名称"></el-input>
                        <span @click="removeSection(index)" v-if="sectionList.length !== 1">
                            <svg-icon icon-class="remove"></svg-icon>
                        </span>
                        <span @click="addSection" v-show="index === sectionList.length - 1">
                            <svg-icon icon-class="add"></svg-icon>
                        </span>
                    </li>
                </ul>
                <div class="sort-operate">
                    <el-tooltip content="根据填写的部的名称列表，例如'还珠格格2'，以及视频的展示名称，例如'还珠格格2-02'进行自动排序" placement="top"
                                effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="autoSort">自动排序</el-button>
                    </el-tooltip>
                    <el-tooltip content="拖动排序功能" placement="top" effect="light">
                        <el-button type="text" @click="sortVideoList">视频拖动排序</el-button>
                    </el-tooltip>
                    <el-tooltip content="反转当前视频列表功能" placement="top" effect="light">
                        <el-button type="text" @click="revertVideoList">反转列表</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!--设置展示名称-->
        <div id="display-name-setting" v-if="currentCarouselGroup.carouselVideoList.length !== 0">
            <div class="display-name-header" @click="displayNameSettingVisible = !displayNameSettingVisible">
                <label>设置展示名称</label>
                <i class="el-icon-arrow-down" v-if="displayNameSettingVisible"></i>
                <i class="el-icon-arrow-right" v-else></i>
            </div>
            <div class="display-name-body" v-if="displayNameSettingVisible">
                <div class="replace-other-setting">
                    <ul>
                        <li>
                            <label>删除原始文件名称第一部分：</label>
                            <el-input
                                v-model="originNameParams.prefix"
                                placeholder="请填写前缀等需要删除的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>删除原始文件名称第二部分：</label>
                            <el-input
                                v-model="originNameParams.midWords"
                                placeholder="请填写中间等需要删除的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>删除原始文件名称第三部分：</label>
                            <el-input
                                v-model="originNameParams.suffix"
                                placeholder="请填写后缀等需要删除的连续文字，例如'.mpg'等">
                            </el-input>
                        </li>
                    </ul>
                    <el-tooltip
                        content="根据填写的视频文件名称需要删除的部分，对视频原始文件名称进行截取删除操作，并填写到展示名称处"
                        placement="top"
                        effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="setDisplayNameFromOriginName">
                            填写展示名称
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="replace-self-setting">
                    <span>根据视频展示名对视频展示名称进行设置：</span>
                    <ul>
                        <li>
                            <label>被替换视频展示名部分：</label>
                            <el-input
                                v-model="displayNameParams.words"
                                placeholder="请填写需要被替换的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>替换为视频展示名部分：</label>
                            <el-input
                                v-model="displayNameParams.replacer"
                                placeholder="请填写需要替换为的连续文字，例如'-'等">
                            </el-input>
                        </li>
                    </ul>
                    <el-tooltip
                        content="根据填写的展示名称需要删除的部分，对视频展示名进行截取删除操作，并填回到展示名称处"
                        placement="top"
                        effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="setDisplayNameFromSelf">填写展示名称
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="display-name-operate">
                    <el-tooltip
                        content="分割原始文件名'&&'，自动填写展示名称，例如原始文件名称为'（高清）新还珠格格（收录）01&&新还珠格格-01.mpg'"
                        placement="top"
                        effect="light">
                        <el-button type="text" @click="setVideoNameList">设置展示名称</el-button>
                    </el-tooltip>
                    <el-tooltip content="删除当前视频中的展示名称中的最后面的数字" placement="top" effect="light">
                        <el-button type="text" @click="removeDisplayNameNo">删除展示名称后面的数字</el-button>
                    </el-tooltip>
                    <el-tooltip content="在展示名称的文字最后插入'-'，例如'天龙八部01'改为'天龙八部-01'" placement="top" effect="light">
                        <el-button type="text" @click="insertShortLine">插入'-'</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoPlayer"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveChannelInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toChannelList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :close-on-click-modal=false
            :visible.sync="selectDialogVisible"
            custom-class="normal-dialog"
            width="80%">
            <select-multiple-video
                v-if="selectDialogVisible"
                :currentSelectedVideoList="currentCarouselGroup.carouselVideoList"
                v-on:appendVideo="appendVideo"
                v-on:closeSelectVideoDialog="selectDialogVisible = false">
            </select-multiple-video>
        </el-dialog>
        <sort-dialog
            v-if="sortDialogVisible"
            :close-on-click-modal=false
            title="视频排序"
            :sourceList="currentCarouselGroup.carouselVideoList"
            sortKey="sort"
            uniqueKey="storageVideoId"
            displayKey="name"
            v-on:closeDialog="sortDialogVisible = false"
            v-on:setSortedList="setSortedList">
        </sort-dialog>
        <!--添加分组-->
        <el-dialog
            title="添加分组"
            :close-on-click-modal=false
            width="60%"
            top="25vh"
            custom-class="group-dialog"
            :visible.sync="createGroupDialogVisible">
            <el-form
                v-if="createGroupDialogVisible"
                :model="groupInfo"
                ref="groupInfo"
                :rules="groupInfoRules"
                status-icon>
                <el-form-item label="组名称" prop="name" required>
                    <el-input
                        v-model="groupInfo.name"
                        placeholder="请输入组名称，12字以内">
                    </el-input>
                </el-form-item>
                <el-form-item label="播放时长" prop="durationFormat">
                    <el-input
                        v-model="groupInfo.durationFormat"
                        type="number"
                        placeholder="请填写播放时长，例如'010023'">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmGroup">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
    import SelectMultipleVideo from './SelectMultipleVideo';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import {CHANNEL_LOGO_DIMENSION} from '@/util/config/dimension';
    import _ from 'lodash';
    import draggable from 'vuedraggable';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'EditCarouselChannel',
        props: {
            // 创建：'CREATE_CHANNEL'，编辑：'EDIT_CHANNEL'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_CHANNEL';
                }
            }
        },
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo,
            SortDialog,
            SingleImageUploader,
            draggable
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('频道名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('内部名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('内部名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkNo = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道编号不能为空'));
                } else if (!this.$util.isChannelNo(value)) {
                    return callback(new Error('请填写频道编号数字，例如"001"'));
                } else {
                    callback();
                }
            };
            let checkTypeIdList = (rule, value, callback) => {
                if (this.channelInfo.typeIdList.length === 0) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            let checkCompanyList = (rule, value, callback) => {
                if (this.channelInfo.companyList.length === 0) {
                    return callback(new Error('请选择区域码'));
                } else {
                    callback();
                }
            };
            let checkPaymentType = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请选择会员情况'));
                } else {
                    callback();
                }
            };
            let checkStartTime = (rule, value, callback) => {
                if ((this.channelInfo.startDate && !this.channelInfo.startPoint) || (!this.channelInfo.startDate && this.channelInfo.startPoint)) {
                    return callback(new Error('请完整选择开始时间'));
                } else if (!this.channelInfo.startDate && !this.channelInfo.startPoint) {
                    callback();
                } else if (this.channelInfo.applyStatus !== 'ACTIVE' && (parseInt(this.channelInfo.startDate) + this.getTimePointMilliseconds(this.channelInfo.startPoint)) < Date.now()) {
                    return callback(new Error('开始时间应大于当前时间'));
                } else {
                    callback();
                }
            };
            let checkMulticastIp = (rule, value, callback) => {
                this.channelInfo.multicastIp = this.$util.trim(this.channelInfo.multicastIp);
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('组播地址不能为空'));
                } else if (!this.$util.isMulticastIPAddress(value)) {
                    return callback(new Error('请填写正确的组播地址'));
                } else {
                    callback();
                }
            };
            let checkMulticastPort = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('端口号不能为空'));
                } else if (!this.$util.isPort(value)) {
                    return callback(new Error('请填写正确的端口号'));
                } else {
                    callback();
                }
            };
            let checkProtocolList = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('请勾选推流方式'));
                } else {
                    callback();
                }
            };
            let checkServiceId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelServiceId(value)) {
                    return callback(new Error('请填写正确的serviceId'));
                } else {
                    callback();
                }
            };
            let checkTsId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelTsId(value)) {
                    return callback(new Error('请填写正确的tsId'));
                } else {
                    callback();
                }
            };
            let checkPushServer = (rule, value, callback) => {
                this.channelInfo.pushServer = this.$util.trim(this.channelInfo.pushServer);
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写所属服务器'));
                } else {
                    callback();
                }
            };
            let checkLogoUri = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请设置频道的封面图片'));
                } else {
                    callback();
                }
            };
            let checkGroupName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('组名称不能为空'));
                } else if (this.$util.trim(value).length > 12) {
                    return callback(new Error('组名称不能超过12个字'));
                } else {
                    callback();
                }
            };
            let checkDurationFormat = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    callback();
                } else if (!/^[0-9]{6}$/.test(value)) {
                    return callback(new Error('请填写6位数字作为能播放时长'));
                } else {
                    callback();
                }
            };
            return {
                groupInfo: {
                    name: '',
                    durationFormat: '',
                    index: ''
                },
                createGroupDialogVisible: false,
                carouselGroup: [{
                    name: '默认分组1',
                    duration: '',
                    durationFormat: '',
                    videoDuration: '',
                    carouselVideoList: []
                }],
                isLoading: false,
                displayNameSettingVisible: false,
                sortToolVisible: true,
                allowResolutions: CHANNEL_LOGO_DIMENSION,
                originNameParams: {
                    prefix: '',
                    midWords: '',
                    suffix: ''
                },
                displayNameParams: {
                    words: '',
                    replacer: ''
                },
                sortDialogVisible: false,
                selectDialogVisible: false,
                channelInfo: {
                    category: 'CAROUSEL',
                    typeIdList: [],
                    common: false,
                    companyList: [],
                    startTime: '',
                    startDate: '',
                    startPoint: '',
                    protocolList: [],
                    multicastIp: '',
                    pushServer: '',
                    serverGroup: '', // 新加字段
                    paymentType: '',
                    visible: false,
                    logoUri: '',
                    onPlayGroupName: '',
                    onPlayVideoName: '',
                    onPlayDurationStart: '',
                    onPlayDurationEnd: ''
                },
                sectionList: [{name: ''}],
                typeOptions: [],
                companyOptions: [],
                // 当前选中的组
                currentCarouselGroup: {
                    name: '',
                    duration: '',
                    durationFormat: '',
                    videoDuration: '',
                    carouselVideoList: [],
                    index: 0
                },
                // 当前的频道含有的视频列表
                currentSelectedVideoList: [],
                currentVideoIndex: '',
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    innerName: [
                        {validator: checkInnerName, trigger: 'blur'}
                    ],
                    no: [
                        {validator: checkNo, trigger: 'blur'}
                    ],
                    typeIdList: [
                        {validator: checkTypeIdList, trigger: 'change'}
                    ],
                    companyList: [
                        {validator: checkCompanyList, trigger: 'blur'}
                    ],
                    startTime: [
                        {validator: checkStartTime, trigger: 'change'}
                    ],
                    multicastIp: [
                        {validator: checkMulticastIp, trigger: 'blur'}
                    ],
                    multicastPort: [
                        {validator: checkMulticastPort, trigger: 'blur'}
                    ],
                    protocolList: [
                        {validator: checkProtocolList, trigger: 'change'}
                    ],
                    tsId: [
                        {validator: checkTsId, trigger: 'blur'}
                    ],
                    serviceId: [
                        {validator: checkServiceId, trigger: 'blur'}
                    ],
                    pushServer: [
                        {validator: checkPushServer, trigger: 'blur'}
                    ],
                    paymentType: [
                        {validator: checkPaymentType, trigger: 'change'}
                    ],
                    serverGroup: [ // 新加校验
                        {required: true, message: '请输入所属服务器组'}
                    ],
                    logoUri: [
                        {validator: checkLogoUri, trigger: 'blur'}
                    ]
                },
                groupInfoRules: {
                    name: [
                        {validator: checkGroupName, trigger: 'blur'}
                    ],
                    durationFormat: [
                        {validator: checkDurationFormat, trigger: 'blur'}
                    ]
                }
            };
        },
        filters: {
            getCarouselVideoTime(videoList) {
                let duration = 0;
                for (let i = 0; i < videoList.length; i++) {
                    duration = duration + videoList[i].takeTimeInSec;
                }
                return duration;
            },
            getGroupDuration(groupList) {
                let duration = 0;
                for (let i = 0; i < groupList.length; i++) {
                    duration = duration + groupList[i].duration;
                }
                return duration;
            },
            // 获取视频列表总时间
            getTotalVideoListDuration(groupList) {
                let duration = 0;
                for (let i = 0; i < groupList.length; i++) {
                    for (let m = 0; m < groupList[i].carouselVideoList.length; m++) {
                        duration = duration + groupList[i].carouselVideoList[m].takeTimeInSec;
                    }
                }
                return duration;
            }
        },
        computed: {
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            removeGroup(index) {
                this.carouselGroup.splice(index, 1);
                this.$nextTick(function () {
                    let nodes = this.$el.querySelectorAll('#group-list li');
                    let selectTag = false;
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].className === 'current-group') {
                            selectTag = true;
                        }
                    }
                    if (!selectTag) {
                        this.selectCurrentGroup(0);
                    }
                });
            },
            editGroupInfo(index) {
                this.groupInfo.name = this.carouselGroup[index].name;
                this.groupInfo.durationFormat = this.carouselGroup[index].durationFormat;
                this.groupInfo.index = index;
                this.createGroupDialogVisible = true;
            },
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                // 获取所属区域的数据
                this.$service.getFilialeList().then(response => {
                    if (response && response.code === 0) {
                        this.companyOptions = response.data;
                        this.companyOptions.unshift({id: '0', code: '0', name: '全选'});
                    }
                });
                let that = this;
                let clipboard = new ClipboardJS('.copy-btn');
                clipboard.on('success', function (e) {
                    that.$message.success('视频链接复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    that.$message.error('视频链接复制失败');
                });
                if (this.status === 'EDIT_CHANNEL') {
                    this.getChannelDetail();
                } else {
                    this.selectCurrentGroup(0);
                }
            },
            getChannelDetail() {
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            if (!(key === 'protocolList' && !response.data.protocolList)) {
                                this.channelInfo[key] = response.data[key];
                            }
                            this.channelInfo.common = !!this.channelInfo.common;
                        }
                        response.data.typeList.map(type => {
                            this.channelInfo.typeIdList.push(type.id);
                        });
                        if (this.channelInfo.startTime) {
                            let startDate = new Date(this.channelInfo.startTime);
                            this.channelInfo.startDate = this.channelInfo.startTime - (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                            let currentDate = new Date();
                            this.channelInfo.startPoint = currentDate.valueOf() - (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 + (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                        }
                        // 处理添加默认分组问题
                        this.carouselGroup = response.data.carouselGroupList.length === 0 ? [{
                            name: '默认分组1',
                            duration: '',
                            durationFormat: '',
                            videoDuration: '',
                            carouselVideoList: []
                        }] : response.data.carouselGroupList;
                        // 设置频道节目信息
                        for (let i = 0; i < this.carouselGroup.length; i++) {
                            if (this.carouselGroup[i].onPlay) {
                                this.channelInfo.onPlayGroupName = this.carouselGroup[i].name;
                                this.carouselGroup[i].carouselVideoList.map(video => {
                                    if (video.onPlay) {
                                        this.channelInfo.onPlayVideoName = video.originName;
                                        // 设置播放时段
                                        this.channelInfo.onPlayDurationStart = video.lastPlayTime;
                                        this.channelInfo.onPlayDurationEnd = video.lastPlayTime + video.takeTimeInSec * 1000;
                                    }
                                });
                            }
                        }
                    }
                    this.selectCurrentGroup(0);
                });
            },
            confirmGroup() {
                this.$refs['groupInfo'].validate((valid) => {
                    if (valid) {
                        if (this.groupInfo.index !== '') {
                            this.carouselGroup[this.groupInfo.index].name = this.groupInfo.name;
                            this.carouselGroup[this.groupInfo.index].durationFormat = this.groupInfo.durationFormat;
                            this.carouselGroup[this.groupInfo.index].duration = parseInt(this.groupInfo.durationFormat.substring(0, 2) * 60 * 60) + parseInt(this.groupInfo.durationFormat.substring(2, 4) * 60) + parseInt(this.groupInfo.durationFormat.substring(4, 6));
                        } else {
                            this.carouselGroup.push({
                                name: this.groupInfo.name,
                                duration: parseInt(this.groupInfo.durationFormat.substring(0, 2) * 60 * 60) + parseInt(this.groupInfo.durationFormat.substring(2, 4) * 60) + parseInt(this.groupInfo.durationFormat.substring(4, 6)),
                                durationFormat: this.groupInfo.durationFormat,
                                videoDuration: '',
                                carouselVideoList: []
                            });
                        }
                        this.createGroupDialogVisible = false;
                        this.groupInfo.name = '';
                        this.groupInfo.durationFormat = '';
                        this.groupInfo.index = '';
                    }
                });
            },
            // 选择组
            selectCurrentGroup(index) {
                for (let i = 0; i < this.carouselGroup.length; i++) {
                    this.carouselGroup[i].current = false;
                }
                this.carouselGroup[index].current = true;
                this.currentCarouselGroup = this.carouselGroup[index];
                this.currentCarouselGroup.index = index;
            },
            addVideoGroup() {
                this.createGroupDialogVisible = true;
            },
            validateCompanyList() {
                this.$refs['channelInfo'].validateField('companyList');
            },
            // 删除所有选中的区域码
            removeAllCompany() {
                this.channelInfo.companyList.splice(0);
                this.channelInfo.common = false;
                this.validateCompanyList();
            },
            // 删除区域码
            removeCompany(company, index) {
                this.channelInfo.companyList.splice(index, 1);
                this.channelInfo.common = false;
                this.validateCompanyList();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.companyOptions.filter(this.createFilter(queryString)) : this.companyOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (companyOptions) => {
                    return (companyOptions.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置区域码，对全选进行处理
            setCompanies(item) {
                // 对全选进行处理
                if (item.name === '全选') {
                    this.channelInfo.companyList.splice(0);
                    this.companyOptions.map(company => {
                        if (company.name !== '全选') {
                            this.channelInfo.companyList.push(company);
                        }
                    });
                    this.channelInfo.common = true;
                } else {
                    // 对非全选进行处理
                    this.channelInfo.companyList.push({id: item.id, name: item.name, code: item.code});
                    this.channelInfo.companyList = _.uniqBy(this.channelInfo.companyList, 'id');
                    this.channelInfo.common = this.channelInfo.companyList.length === this.companyOptions.length - 1;
                }
                this.validateCompanyList();
            },
            // 对关联的视频进行排序
            movePosition(model, video, index) {
                switch (model) {
                    // 上移
                    case 'UP':
                        if (index === 0) {
                            this.$message.warning('当前视频不能向上移动');
                            return;
                        }
                        let moveUpItem = this.currentCarouselGroup.carouselVideoList.splice(index, 1)[0];
                        this.currentCarouselGroup.carouselVideoList.splice(index - 1, 0, moveUpItem);
                        this.$message.success('"' + video.name + '"' + '已向上移动');
                        break;
                    // 下移
                    case 'DOWN':
                        if (index === this.currentCarouselGroup.carouselVideoList.length - 1) {
                            this.$message.warning('当前视频不能向下移动');
                            return;
                        }
                        let moveDownItem = this.currentCarouselGroup.carouselVideoList.splice(index, 1)[0];
                        this.currentCarouselGroup.carouselVideoList.splice(index + 1, 0, moveDownItem);
                        this.$message.success('"' + video.name + '"' + '已向下移动');
                        break;
                    // 置顶
                    case 'TOP':
                        if (index === 0) {
                            this.$message.warning('当前视频已在顶部');
                            return;
                        }
                        let moveTopItem = this.currentCarouselGroup.carouselVideoList.splice(index, 1)[0];
                        this.currentCarouselGroup.carouselVideoList.splice(0, 0, moveTopItem);
                        this.$message.success('"' + video.name + '"' + '已置顶');
                        break;
                    // 置底
                    case 'BOTTOM':
                        if (index === this.currentCarouselGroup.carouselVideoList.length - 1) {
                            this.$message.warning('当前视频已在底部');
                            return;
                        }
                        let moveBottomItem = this.currentCarouselGroup.carouselVideoList.splice(index, 1)[0];
                        this.currentCarouselGroup.carouselVideoList.splice(this.currentCarouselGroup.carouselVideoList.length, 0, moveBottomItem);
                        this.$message.success('"' + video.name + '"' + '已置底');
                        break;
                    default:
                        break;
                }
            },
            uploadSuccessHandler(image) {
                this.channelInfo.logoUri = image.uri;
            },
            // 将当前时间选择器的毫秒数改为只是小时、分钟、秒的毫秒数
            getTimePointMilliseconds(milliseconds) {
                let currentDate = new Date(milliseconds);
                return (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000;
            },
            // 根据视频展示名在文字的最后添加'-'
            insertShortLine() {
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].name.replace(/([\u4e00-\u9fa5]+)/, '$1-');
                    Vue.set(this.currentCarouselGroup.carouselVideoList, i, this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.$message({
                    message: '已根据视频展示名在文字的最后添加"-"',
                    type: 'success'
                });
            },
            setDisplayNameFromOriginName() {
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].originName.replace(this.originNameParams.prefix, '');
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].name.replace(this.originNameParams.midWords, '');
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].name.replace(this.originNameParams.suffix, '');
                    Vue.set(this.currentCarouselGroup.carouselVideoList, i, this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.$message({
                    message: '已根据删除文字部分填写完成视频展示名称',
                    type: 'success'
                });
            },
            removeDisplayNameNo() {
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].name.replace(/\d+$/, '');
                    Vue.set(this.currentCarouselGroup.carouselVideoList, i, this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.$message({
                    message: '已删除展示名称后面的数字',
                    type: 'success'
                });
            },
            setDisplayNameFromSelf() {
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].name.replace(this.displayNameParams.words, this.displayNameParams.replacer);
                    Vue.set(this.currentCarouselGroup.carouselVideoList, i, this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.$message({
                    message: '已根据填写的删除部分对展示名称进行了处理',
                    type: 'success'
                });
            },
            // 打开视频列表，设置当前点击的某一行视频
            popAppendVideoDialogue(index) {
                this.currentVideoIndex = index;
                this.selectDialogVisible = true;
            },
            // 添加相应的视频
            appendVideo(selectedVideoList) {
                // 设置视频状态
                this.currentCarouselGroup.carouselVideoList.map(currentVideo => {
                    selectedVideoList.map(selectVideo => {
                        if (currentVideo.code === selectVideo.code) {
                            selectVideo.visible = currentVideo.visible;
                        }
                    });
                });
                for (let i = 0; i < selectedVideoList.length; i++) {
                    if (!selectedVideoList[i].storageVideoId) {
                        selectedVideoList[i].storageVideoId = selectedVideoList[i].id;
                    }
                    // 添加的视频统一设置 status 为 NORMAL
                    selectedVideoList[i].status = 'NORMAL';
                    // 添加的视频设置为默认正常
                    if (selectedVideoList[i].visible !== false) {
                        selectedVideoList[i].visible = true;
                    }
                    delete selectedVideoList[i].id;
                }
                // 对于新增的视频添加到index之后
                let insertVideoArray = [];
                for (let m = 0; m < selectedVideoList.length; m++) {
                    let insertTag = true;
                    for (let n = 0; n < this.currentCarouselGroup.carouselVideoList.length; n++) {
                        if (selectedVideoList[m].storageVideoId === this.currentCarouselGroup.carouselVideoList[n].storageVideoId) {
                            insertTag = false;
                        }
                    }
                    if (insertTag) {
                        insertVideoArray.push(selectedVideoList[m]);
                    }
                }
                for (let k = 0; k < insertVideoArray.length; k++) {
                    this.currentCarouselGroup.carouselVideoList.splice(this.currentVideoIndex + k, 0, insertVideoArray[k]);
                }
                // 对删除的视频在列表中删除
                let currentArray = [];
                for (let z = 0; z < this.currentCarouselGroup.carouselVideoList.length; z++) {
                    for (let h = 0; h < selectedVideoList.length; h++) {
                        if (this.currentCarouselGroup.carouselVideoList[z].storageVideoId === selectedVideoList[h].storageVideoId) {
                            currentArray.push(this.currentCarouselGroup.carouselVideoList[z]);
                        }
                    }
                }
                // 检测当前视频列表中禁播的视频，在新的视频列表中禁播
                for (let n = 0; n < this.currentCarouselGroup.carouselVideoList.length; n++) {
                    if (!this.currentCarouselGroup.carouselVideoList[n].visible) {
                        for (let j = 0; j < currentArray.length; j++) {
                            if (currentArray[j].storageVideoId === this.currentCarouselGroup.carouselVideoList[n].storageVideoId) {
                                currentArray[j].visible = false;
                            }
                        }
                    }
                }
                this.currentCarouselGroup.carouselVideoList = currentArray;
            },
            // 视频列表排序
            sortVideoList() {
                /** 在频道排序时，含有的视频必须有展示名称  */
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    if (!this.currentCarouselGroup.carouselVideoList[i].name) {
                        this.$message({
                            message: '请先完整填写当前频道中的视频展示名称',
                            type: 'warning'
                        });
                        return;
                    }
                }
                this.sortDialogVisible = true;
            },
            // 设置视频列表中每个视频的展示名称,'（高清）新还珠格格（收录）01&&新还珠格格-01.mpg'
            setVideoNameList() {
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    if (this.currentCarouselGroup.carouselVideoList[i].originName.indexOf('&&') === -1) {
                        this.currentCarouselGroup.carouselVideoList[i].name = '';
                    } else {
                        this.currentCarouselGroup.carouselVideoList[i].name = this.currentCarouselGroup.carouselVideoList[i].originName.split('&&')[1].split('.')[0];
                    }
                    Vue.set(this.currentCarouselGroup.carouselVideoList, i, this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.$message({
                    message: '设置视频展示名称已完成',
                    type: 'success'
                });
            },
            revertVideoList() {
                let array = [];
                for (let i = this.currentCarouselGroup.carouselVideoList.length - 1; i > -1; i--) {
                    array.push(this.currentCarouselGroup.carouselVideoList[i]);
                }
                this.currentCarouselGroup.carouselVideoList = array;
                this.$message({
                    message: '视频列表已反转',
                    type: 'success'
                });
            },
            removeSection(index) {
                this.sectionList.splice(index, 1);
            },
            // 自动化排序
            autoSort() {
                // 检测是否全部填写部的列表
                let sectionTag = true;
                this.sectionList.map(section => {
                    if (!section.name) {
                        sectionTag = false;
                    }
                });
                if (!sectionTag) {
                    this.$message('请完整部填写名称');
                    return;
                }
                // 检测是否完整填写展示名称
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    if (!this.currentCarouselGroup.carouselVideoList[i].name) {
                        this.$message({
                            message: '请完整填写当前频道中的视频展示名称',
                            type: 'warning'
                        });
                        return;
                    }
                }
                // 检测部的列表中的名称是否完整包含当前视频列表
                for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                    let tag = false;
                    for (let k = 0; k < this.sectionList.length; k++) {
                        if (this.currentCarouselGroup.carouselVideoList[i].name.split('-')[0] === this.sectionList[k].name) {
                            tag = true;
                        }
                    }
                    if (!tag) {
                        this.$message({
                            message: '第' + (i + 1) + '个视频的名称没有包含在部的名称列表中',
                            type: 'warning'
                        });
                        return;
                    }
                }
                // 对每一部进行分类
                let videoTwoDimension = [];
                for (let k = 0; k < this.sectionList.length; k++) {
                    videoTwoDimension.push([]);
                    // 分析所有的视频是否属于当前的部的名称中，并添加
                    for (let i = 0; i < this.currentCarouselGroup.carouselVideoList.length; i++) {
                        if (this.currentCarouselGroup.carouselVideoList[i].name.split('-')[0] === this.sectionList[k].name) {
                            videoTwoDimension[k].push(this.currentCarouselGroup.carouselVideoList[i]);
                        }
                    }
                }
                this.currentCarouselGroup.carouselVideoList = this.sortTwoDimension(videoTwoDimension);
                this.$message('已完成根据部的名称列表以及视频展示名称对其进行排序');
            },
            sortTwoDimension(videoTwoDimension) {
                for (let k = 0; k < videoTwoDimension.length; k++) {
                    videoTwoDimension[k].sort(function (pre, next) {
                        return parseInt(pre.name.split('-')[1]) - parseInt(next.name.split('-')[1]);
                    });
                }
                let array = [];
                for (let k = 0; k < videoTwoDimension.length; k++) {
                    for (let i = 0; i < videoTwoDimension[k].length; i++) {
                        array.push(videoTwoDimension[k][i]);
                    }
                }
                return array;
            },
            addSection() {
                this.sectionList.push({name: ''});
            },
            // 设置排序完成的列表
            setSortedList(sortedList) {
                this.currentCarouselGroup.carouselVideoList = sortedList;
                this.sortDialogVisible = false;
                this.$message('视频列表排序成功');
            },
            // 预览视频
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
                this.previewVideoInfo.visible = true;
                this.$refs.displayVideoPlayer.showDialog();
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 禁播、恢复视频,当前正在播放视频可以禁播-2018.08.09
            updateVideoStatus(videoItem, index) {
                this.$confirm('是否确认' + (videoItem.visible ? '禁播' : '恢复') + '视频，此操作将在点击保存时生效，请知晓。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    videoItem.visible = !videoItem.visible;
                    Vue.set(this.currentCarouselGroup.carouselVideoList, index, videoItem);
                    this.$message.success((videoItem.visible ? '恢复' : '禁播') + '视频成功!');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (videoItem.visible ? '禁播' : '恢复')
                    });
                });
            },
            // 删除视频，当前正在播放视频可以删除-2018.08.09
            removeConfirm(index) {
                this.$confirm('是否确认删除视频，此操作将在点击保存时生效，请知晓。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.currentCarouselGroup.carouselVideoList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 保存频道信息
            saveChannelInfo() {
                /** 不能存在空的视频组，分组中的视频不能全部为禁播状态  */
                for (let i = 0; i < this.carouselGroup.length; i++) {
                    if (this.carouselGroup[i].carouselVideoList.length === 0) {
                        this.$message.warning('"' + this.carouselGroup[i].name + '"分组没有视频，暂时不能保存');
                        return;
                    } else {
                        let ableTag = false;
                        for (let k = 0; k < this.carouselGroup[i].carouselVideoList.length; k++) {
                            if (this.carouselGroup[i].carouselVideoList[k].visible) {
                                ableTag = true;
                            }
                            // 视频必须含有展示名称
                            if (!this.carouselGroup[i].carouselVideoList[k].name) {
                                this.$message.warning('"' + this.carouselGroup[i].name + '"分组-' + this.carouselGroup[i].carouselVideoList[k].originName + '视频没有展示名称，暂时不能保存');
                                return;
                            }
                        }
                        if (!ableTag) {
                            this.$message.warning('"' + this.carouselGroup[i].name + '"分组视频都为禁播状态，暂时不能保存');
                            return;
                        }
                    }
                }
                this.$refs['channelInfo'].validate((valid) => {
                    if (valid) {
                        for (let i = 0; i < this.carouselGroup.length; i++) {
                            for (let k = 0; k < this.carouselGroup[i].carouselVideoList.length; k++) {
                                this.carouselGroup[i].carouselVideoList[k].sort = k;
                            }
                        }
                        this.channelInfo.carouselGroupList = this.carouselGroup;
                        this.channelInfo.typeList = [];
                        this.channelInfo.typeIdList.map(typeId => {
                            this.typeOptions.map(type => {
                                if (typeId === type.id) {
                                    this.channelInfo.typeList.push(type);
                                }
                            });
                        });
                        //  设置开始时间
                        if (this.channelInfo.startDate && this.channelInfo.startPoint) {
                            this.channelInfo.startTime = parseInt(this.channelInfo.startDate) + this.getTimePointMilliseconds(this.channelInfo.startPoint);
                        } else {
                            this.channelInfo.startTime = '';
                        }
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_CHANNEL':
                                this.$service.createChannels(this.channelInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建频道');
                                        this.toChannelList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_CHANNEL':
                                this.$service.updateChannelById(
                                    this.$route.params.id,
                                    this.channelInfo
                                ).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存频道信息成功');
                                        this.toChannelList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toChannelList() {
                this.$router.push({name: 'CarouselChannelList'});
            }
        }
    }
    ;
</script>

<style lang="scss">

    .video-list-header {
        margin-bottom: 10px;
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .group-video-info {
            display: flex;
            div {
                margin-left: 10px;
                padding: 0px 10px;
                height: 20px;
                line-height: 20px;
                background: #3E495E;
                border-radius: 10px;
                font-size: 14px;
                color: #FFFFFF;
                span {
                    margin-right: 20px;
                }
            }
        }
        .el-button {
            margin-right: 10px;
        }
    }

    // 创建分组弹窗
    .group-dialog {
        width: 430px !important;
        background: rgba(65, 74, 93, 0.90);
        border: 1px solid rgba(99, 116, 151, 0.50);
        box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
        border-radius: 4px;
        .el-dialog__header {
            padding: 0px;
            height: 45px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            line-height: 45px;
            background: rgba(65, 74, 93, 0.90);
            .el-dialog__title {
                font-size: 18px;
                color: #FFFFFF;
            }
            .el-dialog__headerbtn {
                top: 14px;
                font-size: 15px;
                .el-dialog__close {
                    color: #C35757;
                    &:hover {
                        color: #D0021B;
                    }
                }
            }
        }
        .el-dialog__body {
            .el-form {
                width: 386px !important;
                margin-top: 0px;
                .el-form-item__label {
                    font-size: 14px;
                    color: #A3D0FD;
                }
                .el-input {
                    width: 280px;
                    height: 34px;
                    .el-input__inner {
                        height: 34px;
                        border: 1px solid #A3D0FD;
                        &::-webkit-input-placeholder {
                            color: rgb(99, 116, 151);
                        }
                    }
                }
                .el-form-item__error {
                    padding-left: 86px;
                }
            }
        }
        .el-dialog__footer {
            margin-top: 12px;
            text-align: center;
            .el-button {
                width: 100px;
                height: 40px;
                &.el-button--default {
                    color: #C35757;
                }
                &.el-button--default.el-button--primary {
                    color: #A3D0FD;
                }
            }
        }
    }

</style>

<style lang="scss" scoped>

    .el-form {
        position: relative;
        width: 1240px;
        .channel-status {
            position: absolute;
            top: 0px;
            right: 327px;
            border-left: 1px solid #252D3F;
        }
        .channel-logo {
            position: absolute;
            top: 50px;
            right: 279px;
            border-left: 1px solid #252D3F;
        }
        .channel-onplay-info {
            position: absolute;
            top: 200px;
            right: 0px;
            width: 580px;
            border-top: 1px solid #252D3F;
            border-left: 1px solid #252D3F;
            li {
                margin-bottom: 0px;
            }
        }
    }

    .data-show {
        padding: 2px 6px;
        margin-left: 30px;
        font-size: 14px;
        color: #A8ABB3;
        background: #252D3F;
        border-radius: 10px;
    }

    // 视频分组
    .group-container {
        ul {
            padding-bottom: 20px;
            display: flex;
            flex-wrap: nowrap;
            overflow: scroll;
            li {
                margin-right: 10px;
                &.current-group {
                    .header-box {
                        label, span {
                            color: #fff;
                        }
                    }
                    .content-box {
                        padding-bottom: 10px;
                        background: #0062C4;
                        &:hover {
                            background: #0062C4;
                        }
                        .name-box {
                            label {
                                color: #FFFFFF;
                            }
                            span {
                                visibility: visible;
                            }
                        }
                        .no-box {
                            margin-bottom: 5px;
                            label {
                                color: #A3D0FD;
                            }
                            span {
                                visibility: visible;
                                .svg-icon {
                                    fill: #A3D0FD;
                                }
                            }
                        }
                        .duration-box {
                            display: block;
                            text-align: left;
                            label {
                                text-align: left;
                                color: #A3D0FD;
                            }
                        }
                    }
                }
                .header-box {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    label {
                        padding: 2px 6px;
                        font-size: 14px;
                        color: #6F7480;
                        background: #252D3F;
                        border-radius: 10px;
                    }
                    span {
                        padding: 2px 8px;
                        font-size: 14px;
                        color: #6F7480;
                        background: #252D3F;
                        border-radius: 10px;
                    }
                }
                .content-box {
                    width: 200px;
                    height: auto;
                    padding: 10px 10px 15px 10px;
                    background: #252D3F;
                    border-radius: 8px;
                    cursor: pointer;
                    &:hover {
                        background: #2E384D;
                        .name-box {
                            span {
                                visibility: visible;
                            }
                        }
                        .no-box {
                            span {
                                visibility: visible;
                            }
                        }
                    }
                    p {
                        height: 20px;
                        line-height: 20px;
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        label {
                            cursor: pointer;
                        }
                        &.name-box {
                            margin-bottom: 15px;
                            label {
                                width: 145px;
                                font-size: 14px;
                                color: #A8ABB3;
                                text-align: left;
                            }
                            span {
                                visibility: hidden;
                                i {
                                    font-size: 16px;
                                    color: #C35757;
                                    cursor: pointer;
                                }
                            }
                        }
                        &.no-box {
                            label {
                                font-size: 14px;
                                color: #6F7480;
                            }
                            span {
                                visibility: hidden;
                                cursor: pointer;
                                .svg-icon {
                                    width: 13px !important;
                                    height: 18px !important;
                                    fill: #1989FA;
                                }
                            }
                        }
                        &.duration-box {
                            display: none;
                        }
                    }
                }
            }
        }
    }

    .el-date-picker {
        width: 230px;
    }

    .el-time-picker {
        width: 100px;
    }

    /*设置展示名称*/
    #display-name-setting {
        margin-top: 20px;
        margin-bottom: 20px;
        background: #2A3040;
        border-radius: 8px;
        .display-name-header {
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            cursor: pointer;
            label {
                float: left;
                padding-left: 10px;
                font-size: 18px;
                color: #A8ABB3;
            }
            i {
                float: right;
                padding-right: 5px;
                margin-top: 20px;
                font-size: 14px;
                color: #3E495E;
                cursor: pointer;
            }
        }
        .display-name-body {
            border-top: 1px solid #3E495E;
            .el-input {
                margin-right: 20px;
                width: 300px;
            }
            .replace-other-setting {
                text-align: left;
                ul {
                    padding-left: 20px;
                    margin-top: 20px;
                    text-align: left;
                    li {
                        margin-bottom: 20px;
                        label {
                            color: #fff;
                        }
                    }
                }
                .el-tooltip {
                    margin-left: 160px;
                }
            }
            .replace-self-setting {
                margin-top: 40px;
                text-align: left;
                span {
                    padding-left: 20px;
                    font-size: 16px;
                    color: #A8ABB3;
                }
                ul {
                    padding-left: 20px;
                    margin-top: 20px;
                    text-align: left;
                    li {
                        margin-bottom: 20px;
                        label {
                            color: #fff;
                        }
                    }
                }
                .el-tooltip {
                    margin-left: 160px;
                }
            }
            .display-name-operate {
                margin-top: 40px;
                padding-left: 20px;
                padding-bottom: 20px;
                text-align: left;
                .el-tooltip {
                    margin-right: 50px;
                }
            }
        }
    }

    /*排序工具*/
    #sort-tool {
        margin-top: 40px;
        margin-bottom: 20px;
        background: #2A3040;
        border-radius: 8px;
        .sort-header {
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            cursor: pointer;
            label {
                float: left;
                padding-left: 10px;
                font-size: 18px;
                color: #A8ABB3;
            }
            i {
                float: right;
                padding-right: 5px;
                margin-top: 20px;
                font-size: 14px;
                color: #3E495E;
                cursor: pointer;
            }
        }
        .sort-body {
            border-top: 1px solid #3E495E;
            .el-input {
                margin-right: 20px;
                width: 300px;
            }
            ul {
                padding-left: 20px;
                margin-top: 20px;
                text-align: left;
                li {
                    margin-bottom: 20px;
                    span {
                        margin-right: 15px;
                        width: auto;
                        cursor: pointer;
                    }
                }
            }
            .sort-operate {
                padding-top: 5px;
                padding-left: 20px;
                padding-bottom: 20px;
                text-align: left;
                .el-tooltip {
                    margin-right: 50px;
                }
            }
        }
    }

    .el-input, .el-select {
        width: 600px;
    }

    /*频道基本信息*/
    .el-form {
        margin-top: 20px;
        .logo-image {
            display: inline-block;
            margin-right: 30px;
            width: 78px;
            height: 78px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.50);
        }
        .single-image-uploader-container {
            display: inline-block;
        }
    }

    /*频道节目信息*/
    ul.channel-info {
        padding-left: 40px;
        li {
            margin-bottom: 18px;
            span {
                display: inline-block;
                margin-right: 10px;
                width: 100px;
                height: 22px;
                font-size: 16px;
                color: #A8ABB3;
            }
            label {
                &.on-play {
                    padding: 6px 8px;
                    font-size: 12px;
                    color: #FFFFFF;
                    background: #0062C4;
                    border-radius: 4px;
                }
                &.duration {
                    font-size: 12px;
                    color: #A8ABB3;
                    line-height: 17px;
                }
                &.count {
                    font-size: 16px;
                    color: #A8ABB3;
                }
            }
        }
    }

    .tips {
        color: #A8ABB3;
    }

    /*频道内关联的视频*/
    .el-table {
        .el-input {
            width: 100%;
        }
        .sort {
            span {
                display: inline-block;
                font-size: 14px;
                color: #1989FA;
                cursor: pointer;
                &:first-child, &:nth-child(2) {
                    margin-bottom: 20px;
                }
                &:first-child, &:nth-child(3) {
                    margin-right: 8px;
                }
            }
        }
        .copy-btn {
            cursor: pointer;
        }
    }

    .svg-icon-remove {
        fill: #1989FA;
    }

    .svg-icon-video {
        height: 15px !important;
        width: 20px !important;
    }

    .el-checkbox-group {
        .el-checkbox {
            padding: 0;
        }
    }

    .my-tags {
        max-width: 1050px;
    }

</style>

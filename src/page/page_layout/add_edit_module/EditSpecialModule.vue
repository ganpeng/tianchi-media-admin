<template>
    <div class="edit-special-module-container">
        <h2 class="content-title">{{title}}</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutBlock" status-icon ref="specialModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block my-form">
                <el-col :span="8">
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="layoutBlock.iconImage ? layoutBlock.iconImage.uri : ''"
                            :showDelete="false"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="添加模块内容" required>
                            <div class="special-square-contianer">
                                <div :style="styleBgImageStr(0)" class="left-field">
                                    <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                                    <shuffle-btn :addShuffleLayout="addShuffleLayout(0)"></shuffle-btn>
                                </div>
                                <div :style="styleBgImageStr(1)" class="right-field">
                                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                                    <shuffle-btn :addShuffleLayout="addShuffleLayout(1)"></shuffle-btn>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <person-subject-dialog
            :allowResolutions="allowResolutions"
            :squareIndex="squareIndex"
            ref="personSubjectDialog"
        ></person-subject-dialog>
        <edit-programme
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </edit-programme>
        <!-- 新增 -->
        <edit-programme-subject
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeSubjectDialog">
        </edit-programme-subject>
        <edit-programme-video
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeVideoDialog">
        </edit-programme-video>
        <link-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectLinkDialog">
        ></link-dialog>
        <edit-filter
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectFilterDialog">
        ></edit-filter>
        <channel-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectChannelDialog">
        ></channel-dialog>

        <!--  2.2.0 新增 -->
        <subject-video
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="subjectVideoDialog"
        ></subject-video>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectDialog from './PersonSubjectDialog';
import EditProgramme from './EditProgramme';
import CornerMark from '../CornerMark';

//  新增部分
import ShuffleBtn from '../mixed_module/ShuffleBtn';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import LinkDialog from '../add_edit_module/LinkDialog';
import EditFilter from '../add_edit_module/EditFilter';
import ChannelDialog from '../add_edit_module/ChannelDialog';

//  2.2.0新增
import SubjectVideo from '../add_edit_module/SubjectVideo';

export default {
    name: 'EditSpecialModule',
    components: {
        SingleImageUploader,
        PersonSubjectDialog,
        EditProgramme,
        CornerMark,
        //  新增部分
        ShuffleBtn,
        EditProgrammeSubject,
        EditProgrammeVideo,
        LinkDialog,
        EditFilter,
        ChannelDialog,

        //  2.2.0新增
        SubjectVideo
    },
    data() {
        return {
            title: '',
            navbarId: '',
            index: '',
            operator: '',
            squareIndex: 0,
            layoutItemType: '',
            saveFlag: false, // 判断页面跳转之前如果没有点保存按钮的话，就删除新增的这个layoutItem
            allowResolutions: [],

            layoutBlockId: ''
        };
    },
    async created() {
        try {
            let {navbarId, index, operator} = this.$route.params;
            this.navbarId = navbarId;
            this.index = parseInt(index);
            this.operator = operator;

            await this.getLayoutByNavbarId(navbarId);

            if (this.operator === 'edit') {
                let {id} = this.$route.query;
                this.layoutBlockId = id;
                this.title = '编辑特殊模块';
            } else {
                this.title = '添加特殊模块';
                this.insertLayoutBlockByIndex({
                    index,
                    navbarId,
                    renderType: 'SPECIAL',
                    layoutTemplate: 'LT_SP_2',
                    layoutItemMultiList: _.times(2, () => _.cloneDeep(this.$util.defaultLayoutBlock))
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            selectAll: 'pageLayout/selectAll',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark',

            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        layoutBlock() {
            let layoutBlock = _.get(this.activeLayout, `${this.index}`);
            return layoutBlock || {};
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        }
    },
    methods: {
        ...mapMutations({
            //  2.3.0新增
            updateLayoutBlockDataById: 'pageLayout/updateLayoutBlockDataById',
            updateLayoutBlockDataByIndex: 'pageLayout/updateLayoutBlockDataByIndex',
            insertLayoutBlockByIndex: 'pageLayout/insertLayoutBlockByIndex'
        }),
        ...mapActions({
            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        }),
        iconImageuploadSuccessHandler(image) {
            if (this.operator === 'edit') {
                this.updateLayoutBlockDataById({layoutBlockId: this.layoutBlockId, key: 'iconImage', value: image});
            } else {
                this.updateLayoutBlockDataByIndex({index: this.index, key: 'iconImage', value: image});
            }
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.specialModuleForm.validate();
                if (valid) {
                    if (!this.selectAll(this.navbarId, this.index)) {
                        if (this.operator === 'edit') {
                            let layoutBlock = this.activeLayout.find((item) => item.id === this.layoutBlockId);
                            if (layoutBlock) {
                                let putLayoutBlockRes = await this.$service.putLayoutBlock(this.layoutBlockId, layoutBlock);
                                if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                    this.$message.success('保存成功');
                                    this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                                }
                            }
                        } else {
                            this.updateLayoutBlockDataByIndex({index: this.index, key: 'sort', value: this.index});
                            let layoutBlock = _.get(this.activeLayout, `${this.index}`);
                            if (layoutBlock) {
                                    let postLayoutBlockRes = await this.$service.postLayoutBlock(this.navbarId, layoutBlock);
                                    if (postLayoutBlockRes && postLayoutBlockRes.code === 0) {
                                        this.$message.success('保存成功');
                                        this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                                    }
                            }
                        }
                    } else {
                        this.$message.error('专题色块必须全部选择');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                switch (squareIndex) {
                    case 0:
                        this.allowResolutions = [{width: 560, height: 600}];
                        break;
                    case 1:
                        this.allowResolutions = [{width: 1160, height: 600}];
                        break;
                    default:
                        throw new Error('squarIndex索引错误');
                }
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
                        break;
                    case 'PROGRAMME_VIDEO':
                        this.$refs.selectProgrammeVideoDialog.showDialog('PROGRAMME_VIDEO');
                        break;
                    case 'PROGRAMME_SUBJECT':
                        this.$refs.selectProgrammeSubjectDialog.showDialog('PROGRAMME_SUBJECT');
                        break;
                    case 'LINK':
                        this.$refs.selectLinkDialog.showDialog('LINK');
                        break;
                        //  新增加的部分
                    case 'FIGURE_SUBJECT':
                        this.$refs.personSubjectDialog.showDialog('FIGURE_SUBJECT');
                        break;
                    case 'FILTER':
                        this.$refs.selectFilterDialog.showDialog();
                        break;
                    case 'CHANNEL':
                        this.$refs.selectChannelDialog.showDialog('CHANNEL');
                        break;
                        //  2.2.0新增
                    case 'SUBJECT_VIDEO':
                        this.$refs.subjectVideoDialog.showDialog('SUBJECT_VIDEO');
                        break;
                    default:
                        throw new Error('layoutItemType类型错误');
                }
            };
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
}
.special-square-contianer {
    display: flex;
    .left-field {
        width: 32.0733%;
        height: 100px;
        margin-right: 1.4891%;
        cursor: pointer;
        border: 1px solid #2A3040;
        @include paddingBg(34.3642%);
        &:hover {
            border-color: $mainColor;
        }
    }
    .right-field {
        width: 66.4375%;
        height: 100px;
        cursor: pointer;
        border: 1px solid #2A3040;
        @include paddingBg(34.3642%);
        &:hover {
            border-color: $mainColor;
        }
    }
    .square-text {
        position: absolute;
        left: 50%;
        bottom: -30px;
        transform: translateX(-50%);
        color: #A8ABB3;
    }
}
</style>

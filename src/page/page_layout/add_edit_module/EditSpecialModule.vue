<template>
    <div class="edit-special-module-container">
        <h2 class="content-title">新增特殊模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutData" status-icon ref="specialModuleForm"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="模块名称" prop="title">
                        <el-input
                            :value="layoutData.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="layoutData.iconImage ? layoutData.iconImage.uri : ''"
                            :deleteImage="deleteIconImage"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 82, height: 82}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="添加模块内容" required>
                            <div class="special-square-contianer">
                                <div :style="styleBgImageStr(0)" @click="selectPersonSubject" class="left-field">
                                    <span class="square-text">人物专题</span>
                                </div>
                                <div :style="styleBgImageStr(1)" @click="selectProgramme" class="right-field">
                                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                                    <span class="square-text">节目</span>
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
            :squareIndex="0"
            ref="personSubjectDialog"
        ></person-subject-dialog>
        <edit-programme
            :squareIndex="1"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </edit-programme>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectDialog from './PersonSubjectDialog';
import EditProgramme from './EditProgramme';
import CornerMark from '../CornerMark';
export default {
    name: 'EditSpecialModule',
    components: {
        SingleImageUploader,
        PersonSubjectDialog,
        EditProgramme,
        CornerMark
    },
    data() {
        return {
            navbarId: '',
            index: '',
            saveFlag: false, // 判断页面跳转之前如果没有点保存按钮的话，就删除新增的这个layoutItem
            allowResolutions: []
        };
    },
    beforeRouteLeave(to, from, next) {
        let {operator} = from.params;
        if (!this.saveFlag && operator === 'add') {
            this.deleteLayoutDataByIndex({navbarId: this.navbarId, index: this.index});
            this.saveLayoutToStore();
        }
        next();
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = index;
    },
    computed: {
        ...mapGetters({
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId',
            selectAll: 'pageLayout/selectAll',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark'
        }),
        layoutData() {
            let layoutData = this.getLayoutDataByNavbarId(this.navbarId, this.index);
            return layoutData;
        },
        layoutItem() {
            return (squareIndex) => {
                return this.getLayoutItemByNavbarId(this.navbarId, this.index, squareIndex);
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let uri = _.get(this.layoutItem(squareIndex), 'coverImage.uri');
                let bgStr = `background-image: url(${uri})`;
                return bgStr;
            };
        }
    },
    methods: {
        ...mapMutations({
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            updateLayoutDataByKey: 'pageLayout/updateLayoutDataByKey',
            setLayoutItemByIndex: 'pageLayout/setLayoutItemByIndex'
        }),
        inputHandler(value, key) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key, value});
        },
        iconImageuploadSuccessHandler(image) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'iconImage', value: image});
        },
        deleteIconImage() {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'iconImage', value: null});
        },
        async saveHandler() {
            try {
                let valid = await this.$refs.specialModuleForm.validate();
                if (valid) {
                    if (!this.selectAll(this.navbarId, this.index)) {
                        this.saveLayoutToStore(this.navbarId);
                        this.saveFlag = true;
                        this.$message.success('保存成功');
                        this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                    } else {
                        this.$message.error('专题色块必须全部选择');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        selectPersonSubject() {
            this.allowResolutions = [{width: 560, height: 600}];
            this.$refs.personSubjectDialog.showDialog();
        },
        selectProgramme() {
            this.allowResolutions = [{width: 1160, height: 600}];
            this.$refs.selectProgrammeDialog.showDialog();
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

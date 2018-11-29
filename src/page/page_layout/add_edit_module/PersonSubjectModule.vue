<template>
    <div class="person-module-container">
        <h2 class="content-title">新增人物专题模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="layoutData" status-icon ref="createPerson"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="人物模块名称" prop="title" required>
                        <el-input
                            :value="layoutData.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入人物姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            id="personSubjectIconUploader"
                            :uri="layoutData.iconImage ? layoutData.iconImage.uri : ''"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 200, height: 200}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="选择人物专题" required>
                            <div class="person-subject-square-container">
                                <div :style="styleBgImageStr(0)" @click="selectPersonSubject(0)" class="field"></div>
                                <div :style="styleBgImageStr(1)" @click="selectPersonSubject(1)" class="field"></div>
                                <div :style="styleBgImageStr(2)" @click="selectPersonSubject(2)" class="field"></div>
                                <div :style="styleBgImageStr(3)" @click="selectPersonSubject(3)" class="field"></div>
                                <div :style="styleBgImageStr(4)" @click="selectPersonSubject(4)" class="field"></div>
                                <div :style="styleBgImageStr(5)" @click="selectPersonSubject(5)" class="field"></div>
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
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectDialog from './PersonSubjectDialog';
export default {
    name: 'PersonSubjectModule',
    components: {
        SingleImageUploader,
        PersonSubjectDialog
    },
    data() {
        return {
            navbarId: '',
            index: '',
            saveFlag: false, // 判断页面跳转之前如果没有点保存按钮的话，就删除新增的这个layoutItem
            allowResolutions: [],
            squareIndex: 0
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
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
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
            updateLayoutDataByKey: 'pageLayout/updateLayoutDataByKey'
        }),
        inputHandler(value, key) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key, value});
        },
        iconImageuploadSuccessHandler(image) {
            this.updateLayoutDataByKey({navbarId: this.navbarId, index: this.index, key: 'iconImage', value: image});
        },
        saveHandler() {
            this.saveLayoutToStore();
            this.saveFlag = true;
            this.$message.success('保存成功');
            this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
        },
        selectPersonSubject(squareIndex) {
            this.allowResolutions = [{width: 260, height: 600}];
            this.squareIndex = squareIndex;
            this.$refs.personSubjectDialog.showDialog();
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
.searchForm {
    margin-top: 20px;
}
.step-two {
    margin-top: 20px;
}
.person-subject-square-container {
    display: flex;
    .field {
        flex: 1;
        @include paddingBg(34.0909%);
    }
    .field + .field {
        margin-left: 2%;
    }
}
</style>

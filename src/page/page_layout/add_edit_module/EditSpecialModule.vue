<template>
    <div class="edit-special-module-container">
        <h2 class="content-title">新增特殊模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="specialModule" status-icon ref="createPerson"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="模块名称" prop="title" required>
                        <el-input
                            :value="specialModule.title"
                            @input="inputHandler($event, 'title')"
                            placeholder="请输入模块名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon">
                        <single-image-uploader
                            :uri="specialModule.iconImage ? specialModule.iconImage.uri : ''"
                            :uploadSuccessHandler="iconImageuploadSuccessHandler"
                            :allowResolutions="[{width: 200, height: 200}]"
                        ></single-image-uploader>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="添加模块内容" required>
                            <div class="special-square-contianer">
                                <div @click="selectPersonSubject" class="left-field">

                                </div>
                                <div class="right-field">

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
            :successhandler="PersonSubjectSuccesshandler"
            :layoutItemMultiList="layoutItemMultiList"
            ref="personSubjectDialog"
        ></person-subject-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PersonSubjectDialog from './PersonSubjectDialog';
export default {
    name: 'EditSpecialModule',
    components: {
        SingleImageUploader,
        PersonSubjectDialog
    },
    data() {
        return {
            allowResolutions: [],
            specialModule: {
                title: '',
                iconImage: {},
                layoutItemMultiList: []
            }
        };
    },
    computed: {
        ...mapGetters({})
    },
    methods: {
        ...mapMutations({}),
        iconImageuploadSuccessHandler() {},
        saveHandler() {},
        selectPersonSubject() {
            this.allowResolutions = [{width: 560, height: 600}];
            this.$refs.personSubjectDialog.showDialog();
        },
        PersonSubjectSuccesshandler(layoutItem) {
            this.specialModule.layoutItemMultiList[0] = layoutItem;
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
        @include paddingBg(34.3642%);
    }
    .right-field {
        width: 66.4375%;
        height: 100px;
        @include paddingBg(34.3642%);
    }
}
</style>

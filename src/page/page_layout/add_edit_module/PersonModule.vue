<template>
    <div class="person-module-container">
        <h2 class="content-title">新增人物模块</h2>
        <div class="seperator-line"></div>
        <div class="form-container">
            <el-form :model="personModule" status-icon ref="createPerson"
                    label-width="120px"
                    @submit.native.prevent
                    class="form-block">
                <el-col :span="8">
                    <el-form-item label="人物模块名称" prop="name" required>
                        <el-input
                            :v-model="personModule.name"
                            placeholder="请输入人物姓名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名称icon" prop="icon">
                        <single-image-uploader
                            :dimension="{width: 40, height: 40}"
                            :allowResolutions="{width: 80, height: 80}"
                        ></single-image-uploader>
                    </el-form-item>
                    <el-form-item label="选择人物" required>
                        <el-button class="btn-style-two" @click="selectPersonClickHandler">选择人物</el-button>
                        <span>只能选择6个人物</span>
                    </el-form-item>
                    <el-form-item label=" ">
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <el-dialog
            title="选择人物"
            class="my-dialog"
            width="80%"
            :visible.sync="selectPersonDialogVisible"
            :show-close="true"
            :before-close="closeSelectPersonDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="video-list">
                <el-form :inline="true" @submit.native.prevent>
                    <el-form-item class="search">
                        <el-input
                            placeholder="搜索你想要的信息"
                            clearable
                            class="border-input"
                            :value="''"
                            @input="searchInputHandler($event, 'name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeSelectPersonDialog">取 消</el-button>
                    <el-button type="primary" @click="selectPersonEnterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
export default {
    name: 'PersonModule',
    components: {
        SingleImageUploader
    },
    data() {
        return {
            selectPersonDialogVisible: false,
            personModule: {
                name: '',
                icon: ''
            }
        };
    },
    methods: {
        saveHandler() { },
        //  弹窗控制方法
        showSelectPersonDialog() {
            this.selectPersonDialogVisible = true;
        },
        closeSelectPersonDialog() {
            this.selectPersonDialogVisible = false;
        },
        //  搜索人物的事件处理函数
        searchInputHandler() {

        },
        //  选择人物点击事件处理函数
        selectPersonClickHandler() {
            this.showSelectPersonDialog();
        },
        selectPersonEnterHandler() {}
    }
};
</script>
<style lang="scss" scoped>

</style>

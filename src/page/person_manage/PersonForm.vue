<!-- 新建人物的表单组件  -->
<template>
    <div class="person-form-container">
        <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                label-width="100px"
                class="form-block">
            <el-form-item label="人物姓名" prop="name">
                <el-input v-model="person.name" :readonly="readonly" placeholder="请输入人物姓名"></el-input>
            </el-form-item>
            <el-form-item label="人物简介" prop="description">
                <el-input type="textarea" :readonly="readonly" :autosize="{ minRows: 4, maxRows: 12}" placeholder="请输入人物简介" v-model="person.description"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
                <el-date-picker v-model="person.birthday" :readonly="readonly" type="date" placeholder="年/月/日"></el-date-picker>
            </el-form-item>
            <el-form-item label="所属地区" prop="area">
                <el-select :disabled="readonly" clearable filterable v-model="person.area" placeholder="请选择地区">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身高" prop="height">
                <el-input :readonly="readonly" placeholder="" v-model="person.height">
                    <template slot="append">cm</template>
                </el-input>
            </el-form-item>
            <el-form-item label="体重" prop="weight">
                <el-input :readonly="readonly" placeholder="" v-model="person.weight">
                    <template slot="append">kg</template>
                </el-input>
            </el-form-item>
            <el-form-item label="职业" prop="mainRole">
                <el-input :readonly="readonly" v-model="person.mainRole" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="人物图片">
                <el-button type="primary" @click="uploadImageHandler">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-form-item>
            <el-form-item class="tips">
                <label class="tips">带 <i>*</i> 号的为必填项</label>
            </el-form-item>
        </el-form>
        <upload-program-image-dialog title="上传人物图片" :imageUploadDialogVisible="imageUploadDialogVisible" v-on:changeImageDialogStatus="closeImageDialog($event)"></upload-program-image-dialog>
    </div>
</template>
<script>
import UploadProgramImageDialog from '../program_manage/UploadProgramImageDialog';

// 默认的person
let personDefault = {
    name: '',
    description: '',
    birthday: '',
    area: '',
    height: '',
    weight: '',
    mainRole: '',
    avatar: ''
};

export default {
    name: 'PersonForm',
    props: {
        person: {
            type: Object,
            default: () => personDefault
        },
        status: {
            type: Number,
            default: 0
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    components: {
        UploadProgramImageDialog
    },
    data() {
        return {
            infoRules: {
                name: [
                    { required: true, message: '请输入人物名称', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请输入人物简介', trigger: 'change' }
                ],
                birthday: [
                    { required: true, message: '请输入出生日期', trigger: 'change' }
                ],
                area: [
                    { required: true, message: '请选择区域', trigger: 'change' }
                ],
                mainRole: [
                    { required: true, message: '请输入人物职业', trigger: 'change' }
                ]
            },
            imageUploadDialogVisible: false,
            areaOptions: this.$util.countryList()
        };
    },
    methods: {
        uploadImageHandler() {
            if (!this.readonly) {
                this.imageUploadDialogVisible = true;
            }
        },
        closeImageDialog(status) {
            this.imageUploadDialogVisible = status;
        }
    }
};
</script>
<style scoped>
.person-form-container {
    margin-top: 60px;
}
</style>

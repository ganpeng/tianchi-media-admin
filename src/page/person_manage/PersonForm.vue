<!-- 新建人物的表单组件 -->
<template>
    <div class="person-form-container">
        <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                label-width="100px"
                class="form-block">
            <el-form-item label="人物姓名" prop="name">
                <el-input
                    :value="person.name"
                    :readonly="readonly"
                    @input="inputHandler($event, 'name')"
                    placeholder="请输入人物姓名"
                ></el-input>
            </el-form-item>
            <el-form-item label="人物简介" prop="description">
                <el-input
                    type="textarea"
                    :readonly="readonly"
                    :autosize="{ minRows: 4, maxRows: 12}"
                    placeholder="请输入人物简介"
                    :value="person.description"
                    @input="inputHandler($event, 'description')"
                ></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
                <el-date-picker
                    :value="person.birthday"
                    :readonly="readonly"
                    type="date"
                    placeholder="年/月/日"
                    @input="inputHandler($event, 'birthday')"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="所属地区" prop="area">
                <el-select
                    :disabled="readonly"
                    clearable
                    filterable
                    :value="person.area"
                    placeholder="请选择地区"
                    @input="inputHandler($event, 'area')"
                >
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身高" prop="height">
                <el-input
                    :readonly="readonly"
                    placeholder=""
                    :value="person.height"
                    @input="inputHandler($event, 'height')"
                >
                    <template slot="append">cm</template>
                </el-input>
            </el-form-item>
            <el-form-item label="体重" prop="weight">
                <el-input
                    :readonly="readonly"
                    placeholder=""
                    :value="person.weight"
                    @input="inputHandler($event, 'weight')"
                >
                    <template slot="append">kg</template>
                </el-input>
            </el-form-item>
            <el-form-item label="职业" prop="mainRole">
                <el-select
                    :disabled="readonly"
                    :value="person.mainRole"
                    placeholder="请选择职业"
                    @input="inputHandler($event, 'mainRole')"
                >
                    <el-option
                    v-for="item in mainRoleoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="!readonly" label="人物图片">
                <el-button type="primary" @click="uploadImageHandler">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-form-item>
            <el-form-item class="tips">
                <label class="tips">带 <i>*</i> 号的为必填项</label>
            </el-form-item>
        </el-form>
        <person-image-upload
            :size='size'
            ref="uploadImageDialog"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)"
        >
        </person-image-upload>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import PersonImageUpload from './PersonImageUpload';

export default {
    name: 'PersonForm',
    props: {
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
        PersonImageUpload
    },
    computed: {
        ...mapGetters({
            person: 'person/currentPerson'
        })
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
            areaOptions: this.$util.countryList(),
            mainRoleoptions: [
                {
                    value: 'DIRECTOR',
                    label: '导演'
                },
                {
                    value: 'VICE_DIRECTOR',
                    label: '副导演'
                },
                {
                    value: 'CHIEF_ACTOR',
                    label: '主演'
                },
                {
                    value: 'ACTOR',
                    label: '演员'
                }
            ],
            size: [
                {
                    value: '200*200',
                    label: '200*200'
                },
                {
                    value: '700*1000',
                    label: '700*1000'
                }
            ]
        };
    },
    methods: {
        ...mapMutations({
            updateCurrentPerson: 'person/updateCurrentPerson'
        }),
        uploadImageHandler() {
            if (!this.readonly) {
                this.imageUploadDialogVisible = true;
            }
        },
        closeImageDialog(status) {
            this.imageUploadDialogVisible = status;
        },
        inputHandler(value, haha) {
            this.updateCurrentPerson({[haha]: value});
        }
    }
};
</script>
<style scoped>
.person-form-container {
    margin-top: 60px;
}
</style>

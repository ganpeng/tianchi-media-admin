<!-- 新建人物的表单组件 -->
<template>
    <div class="person-form-container">
        <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                label-width="100px"
                class="form-block">
            <el-col :span="isDialog ? 24 : 8">
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
                        @change="inputHandler($event, 'area')"
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
                        @change="inputHandler($event, 'mainRole')"
                    >
                        <el-option
                        v-for="item in mainRoleoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="人物图片" required>
                    <el-button v-if="!readonly" type="primary" @click="uploadImageHandler">上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
                    <ul class="cover-list">
                        <li v-for="(img, index) in person.posterImageList" :key="index" class="img-item">
                            <img :src="img.uri" alt="">
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item class="tips">
                    <label class="tips">带 <i>*</i> 号的为必填项</label>
                </el-form-item>
            </el-col>
        </el-form>
        <upload-image
            :size='size'
            title="上传人物图片"
            ref="uploadImageDialog"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)"
        >
        </upload-image>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import UploadImage from 'sysComponents/custom_components/global/UploadImage';
import imageDimension from '@/util/config/image_dimension';

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
        },
        isDialog: {
            type: Boolean,
            default: false
        }
    },
    components: {
        UploadImage
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
            size: imageDimension.PERSON_DIMENSION
        };
    },
    methods: {
        ...mapMutations({
            updateCurrentPerson: 'person/updateCurrentPerson',
            addPosterImage: 'person/addPosterImage'
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
<style lang="less" scoped>
.person-form-container {
    margin-top: 60px;
}
.cover-list {
    margin-top: 30px;
    overflow: hidden;
    li {
        float: left;
        margin-right: 30px;
        height: 230px;
        img {
            display: block;
            height: 180px;
            cursor: zoom-in;
        }
        label {
            text-align: center;
            font-size: 16px;
        }
    }
}
</style>

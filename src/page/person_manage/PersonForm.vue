<!-- 新建人物的表单组件 -->
<template>
    <div class="person-form-container">
        <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                label-width="100px"
                @submit.native.prevent
                class="form-block">
            <el-col :span="isDialog ? 24 : 8">
                <el-form-item label="人物姓名" prop="name">
                    <el-input
                        :value="person.name"
                        :disabled="readonly"
                        @input="inputHandler($event, 'name')"
                        placeholder="请输入人物姓名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="人物别名" prop="alias">
                    <el-input
                        :value="person.alias"
                        :disabled="readonly"
                        @input="inputHandler($event, 'alias')"
                        placeholder="请输入人物别名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="englishName">
                    <el-input
                        :value="person.englishName"
                        :disabled="readonly"
                        @input="inputHandler($event, 'englishName')"
                        placeholder="请输入人物英文名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="人物简介" prop="description">
                    <el-input
                        type="textarea"
                        :disabled="readonly"
                        :maxlength="300"
                        :minlength="110"
                        :autosize="{ minRows: 4, maxRows: 12}"
                        placeholder="请输入人物简介"
                        :value="person.description"
                        @input="inputHandler($event, 'description')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker
                        :value="person.birthday"
                        :disabled="readonly"
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
                            v-for="(item, index) in areaOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职业" prop="mainRoleList">
                    <div class="my-tags">
                        <draggable v-model="mainRoleList">
                            <el-tag
                                :key="index"
                                v-for="(item, index) in mainRoles(mainRoleList)"
                                closable
                                :disable-transitions="false"
                                @close="deleteMainRoleHandler(item.value)">
                                {{item.label}}
                            </el-tag>
                        </draggable>
                    </div>
                    <main-role-search
                        :handleSelect="selectMainRoleHandler"
                    ></main-role-search>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="人物图片" required>
                    <single-image-uploader
                        :uri="person.avatarImage ? person.avatarImage.uri : ''"
                        :deleteImage="deleteAvatarImage"
                        :uploadSuccessHandler="uploadSuccessHandler"
                        :allowResolutions="[{width: 260, height: 260}, {width: 200, height: 200}, {width: 260, height: 280}]"
                    ></single-image-uploader>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import {mapGetters, mapMutations} from 'vuex';
import store from 'store';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import role from '@/util/config/role';
import {requiredValidator} from '@/util/formValidate';
import mainRoleSearch from './mainRoleSearch';

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
        SingleImageUploader,
        draggable,
        mainRoleSearch
    },
    computed: {
        ...mapGetters({
            person: 'person/currentPerson',
            mainRoleLabel: 'person/mainRoleLabel'
        }),
        mainRoleList: {
            get() {
                return this.person.mainRoleList;
            },
            set(value) {
                this.updateCurrentPerson({key: 'mainRoleList', value});
            }
        },
        mainRoles() {
            return (mainRoleList) => {
                return mainRoleList.map((item) => {
                    let obj = role.MAIN_ROLE_OPTIONS.find((mainRoleItem) => mainRoleItem.value === item);
                    return obj;
                });
            };
        }
    },
    data() {
        return {
            infoRules: {
                name: [
                    { required: true, message: '请输入人物名称' }
                ],
                alias: [
                    { required: true, message: '请输入人物别名' }
                ],
                description: [
                    { required: true, message: '请输入人物简介' }
                ],
                area: [
                    { required: true, message: '请选择区域' },
                    { validator: requiredValidator('请选择区域') }
                ],
                mainRoleList: [
                    { required: true, message: '请输入人物职业' },
                    { validator: requiredValidator('请输入人物职业') }
                ]
            },
            areaOptions: store.get('areaList'),
            mainRoleoptions: role.MAIN_ROLE_OPTIONS
        };
    },
    methods: {
        ...mapMutations({
            updateCurrentPerson: 'person/updateCurrentPerson',
            addMainRoleToList: 'person/addMainRoleToList',
            deleteMainRoleByValue: 'person/deleteMainRoleByValue'
        }),
        inputHandler(value, key) {
            this.updateCurrentPerson({key, value});
            if (key === 'name') {
                this.updateCurrentPerson({key: 'alias', value});
            }
        },
        uploadSuccessHandler(img) {
            this.updateCurrentPerson({key: 'avatarImage', value: img});
        },
        deleteAvatarImage() {
            this.updateCurrentPerson({key: 'avatarImage', value: null});
        },
        selectMainRoleHandler(mainRole) {
            this.addMainRoleToList({mainRole});
        },
        deleteMainRoleHandler(value) {
            this.deleteMainRoleByValue({value});
        }
    }
};
</script>
<style lang="scss" scoped>
.img-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #3E495E;
    border-radius: 4px;
    cursor: pointer;
    img {
        display: inline-block;
        width: 100px;
        height: 100px;
    }
    i {
        display: none;
        position: absolute;
        top: 4px;
        right: 4px;
        color: $closeBtnHoverColor;
    }
    &:hover {
        opacity: 0.6;
        i {
            display: block;
        }
    }
}
</style>

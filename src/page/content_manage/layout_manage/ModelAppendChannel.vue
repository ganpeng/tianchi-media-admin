<template>
    <div class="set-channel-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道页面设置</el-breadcrumb-item>
            <el-breadcrumb-item>频道模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            label-width="100px"
            :model="modelForm"
            status-icon
            class="form"
            :rules="modelFormRules"
            ref="modelForm"
            >
            <el-col :span="8">
                <el-form-item label="模块名称" prop="title">
                    <el-input
                        v-model="modelForm.title"
                        clearable
                        placeholder="请输入模块名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="模块板式" prop="templateType">
                        <el-select
                            v-model="modelForm.templateType"
                            clearable
                            placeholder="请选择模块板式"
                            @change="setBlockModel"
                            prop="templateType">
                            <el-option
                                v-for="item in templateTypeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <div class="model-block">
                    <ul v-for="(row,rowIndex) in layoutItemList" :key="rowIndex">
                        <li v-for="(item,index) in row"
                            :key="index"
                            :class="'item-' + item.itemClass"
                            @click="setModelItem(rowIndex,index,('model-' + item.itemClass),item.layoutItemType === 'ALL',item)">
                            <div class="ab-center text-center">
                                <img :src="item.coverImage ? item.coverImage.uri : '' | imageUrl"
                                    :alt="item.coverImage.name"
                                    v-if="item.coverImage && item.coverImage.id">
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="24" class="text-center">
                <el-button class="model-btn" type="primary" @click="saveChannelModel">确定</el-button>
            </el-col>
        </el-form>
        <el-dialog
            title=""
            :visible.sync="setChannelDialogVisible">
            <select-channel
                :size="size"
                ref="selectChannel"
                :existList="layoutItemList"
                v-on:closeSetChannelDialog="closeSetChannelDialog"
                :successHandler="setChannelBlock"
                ></select-channel>
        </el-dialog>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
import templateType from '@/util/config/template_type';
import SelectChannel from './SelectChannel';
export default {
    name: 'ModelAppendChannel',
    components: {
        SelectChannel
    },
    data() {
        return {
            templateTypeOptions: templateType.TYPE,
            layoutItemList: [],
            setChannelDialogVisible: false,
            modelForm: {
                title: '',
                templateType: ''
            },
            modelFormRules: {
                title: [
                    { required: true, message: '请输入模块名称' }
                ],
                templateType: [
                    { required: true, message: '请输入模块板式' }
                ]
            },
            size: [],
            //  一些临时的变量
            currentRow: 0,
            currentIndex: 0
        };
    },
    methods: {
        ...mapMutations({
            setSubjectLayoutItem: 'layout/setSubjectLayoutItem'
        }),
        setBlockModel() {
            this.layoutItemList = [];
            if (this.modelForm.templateType) {
                for (let k = 0; k < this.modelForm.templateType.split('+').length; k++) {
                    this.layoutItemList[k] = [];
                    for (let i = 0; i < templateType.SIZE[this.modelForm.templateType.split('+')[k]].count; i++) {
                        this.layoutItemList[k].push({itemClass: this.modelForm.templateType.split('+')[k]});
                    }
                }
            }
        },
        // 设置模板样式中的节目项
        setModelItem(row, index, imageModel, isAll, item) {
            let {width, height} = LAYOUT_IMAGE_DIMENSION[imageModel].coverImage;
            this.size = [{
                value: `${width}*${height}`,
                label: `当前块尺寸: ${width}*${height}`
            }];
            this.currentRow = row;
            this.currentIndex = index;
            this.showSetChannelDialog();
        },
        showSetChannelDialog() {
            this.setChannelDialogVisible = true;
        },
        closeSetChannelDialog() {
            this.setChannelDialogVisible = false;
        },
        setChannelBlock(data) {
            let {itemClass} = this.layoutItemList[this.currentRow][this.currentIndex];
            data.itemClass = itemClass;
            this.layoutItemList[this.currentRow][this.currentIndex] = data;
        },
        checkBlockSeted() {
            let resultList = [];
            this.layoutItemList.forEach((item) => {
                resultList = resultList.concat(item);
            });
            let flag = resultList.findIndex((item) => !item.coverImage || !item.coverImage.id);
            return flag > -1;
        },
        saveChannelModel() {
            this.$refs.modelForm.validate(valid => {
                if (valid) {
                    if (this.checkBlockSeted()) {
                        this.$message.error('请选择色块频道');
                        return false;
                    } else {
                        console.log(this.layoutItemList);
                    }
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>

    .form {
        margin-top: 20px;
    }
    .model-btn {
        margin-top: 40px;
    }

    // 根据一行节目数量，确定模块样式
    .model-block {
        ul {
            display: flex;
            margin-top: 30px;
            justify-content: space-between;
            li {
                position: relative;
                margin-right: 30px;
                flex-grow: 1;
                background: #5daf34;
                cursor: pointer;
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .all-tip {
                    font-size: 20px;
                    color: #fff;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }
        }
        li.item-1 {
            width: 100%;
            padding-bottom: 12%;
        }

        li.item-2 {
            width: 48%;
            padding-top: 13%;
        }

        li.item-3 {
            width: 31%;
            padding-top: 13%;
        }

        li.item-4 {
            width: 23%;
            padding-top: 13%;
        }

        li.item-6 {
            width: 14%;
            padding-top: 20%;
        }

        li.item-s6 {
            width: 14%;
            padding-top: 8%;
        }
    }

    .item-operate {
        position: absolute;
        right: 40px;
        top: 14px;
        .el-tooltip {
            margin-right: 26px;
        }
        i {
            margin-right: 16px;
            font-size: 24px;
            color: white;
            cursor: pointer;
        }
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>

<template>
    <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
            label-width="100px"
            class="form-block">
        <el-form-item label="人物姓名" prop="name" required>
            <el-input v-model="person.name" :readonly="readonly" placeholder="请输入人物姓名"></el-input>
        </el-form-item>
        <el-form-item label="人物简介" prop="profile" required>
            <el-input type="textarea" :readonly="readonly" :autosize="{ minRows: 4, maxRows: 12}" placeholder="请输入人物简介" v-model="person.profile"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="person.birthday" :readonly="readonly" type="date" placeholder="年/月/日"></el-date-picker>
        </el-form-item>
        <el-form-item label="所属地区" prop="area" required>
            <el-select :disabled="readonly" v-model="person.area" placeholder="请选择地区">
                <el-option
                    v-for="item in options"
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
        <el-form-item label="职业" prop="mainRole" required>
            <el-input :readonly="readonly" v-model="person.mainRole" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="人物图片" prop="imageList">
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="person.imageList"
                list-type="picture"
                :disabled="readonly">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item class="tips">
            <label class="tips">带 <i>*</i> 号的为必填项</label>
        </el-form-item>
    </el-form>
</template>
<script>
// 默认的person
let personDefault = {
    name: '',
    profile: '',
    birthday: '',
    area: '',
    height: '',
    weight: '',
    mainRole: '',
    avatar: '',
    imageList: [
        {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
    ]
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
    data() {
        let checkName = (rule, value, callback) => {
            if (this.$util.isEmpty(value)) {
                return callback(new Error('姓名不能为空'));
            } else {
                callback();
            }
        };

        return {
            infoRules: {
                name: [{ validator: checkName, trigger: 'blur' }]
            },
            options: [
                {
                    value: '大陆',
                    label: '大陆'
                },
                {
                    value: '香港',
                    label: '香港'
                },
                {
                    value: '台湾',
                    label: '台湾'
                }
            ]
        };
    }
};
</script>
<style scoped>

</style>

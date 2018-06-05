<!--内容管理-栏目管理-设置专题内的节目第三步--设置角标组件-->
<template>
    <div>
        <h3 class="text-left">请勾选需要展示的角标：</h3>
        <el-checkbox :indeterminate="isIndeterminate"
                     v-model="checkAll"
                     @change="handleCheckAllChange"
                     class="text-left">全选
        </el-checkbox>
        <el-checkbox-group v-model="checkedCornerMarks" @change="checkedCornerMarksChange" class="text-left">
            <el-checkbox v-for="(item,index) in cornerMarks" :label="item.id" :key="index">
                <label>{{item.position}}</label>
                <label>{{item.type}}</label>
                <label>{{item.value}}</label>
            </el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
    import cornerMarkOptions from '@/util/config/corner_mark';

    export default {
        name: 'SetSubjectProgrammeThird',
        props: ['programme'],
        data() {
            return {
                checkAll: false,
                checkedCornerMarks: [],
                cornerMarks: cornerMarkOptions,
                isIndeterminate: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getProgrammeInfo({id: this.programme.id}).then(response => {
                    if (response && response.code === 0) {

                    }
                });
            },
            // 选择所有
            handleCheckAllChange(val) {
                this.checkedCornerMarks = val ? [1, 2, 3, 4] : [];
                this.isIndeterminate = false;
                this.$emit('setCornerMarks', this.getCornerMarksSetting());
            },
            // 选择某一个
            checkedCornerMarksChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cornerMarks.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cornerMarks.length;
                this.$emit('setCornerMarks', this.getCornerMarksSetting());
            },
            getCornerMarksSetting() {
                return {
                    leftTop: {
                        'caption': '爱奇艺',
                        'markType': 'COPYRIGHT_RESERVER'
                    },
                    leftBottom: {
                        'caption': '45集',
                        'markType': 'EPISODES_NUMBER'
                    },
                    rightTop: {
                        'caption': '最新',
                        'imageUrl': '',
                        'markType': 'CUSTOM'
                    },
                    rightBottom: {
                        'caption': '9.4分',
                        'markType': 'SCORE'
                    }
                };
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-checkbox {
        display: block;
        margin-top: 20px;
        margin-left: 30px;
        label {
            margin-right: 20px;
        }
    }

</style>

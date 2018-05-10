<!-- 广告组弹出框 -->
<template>
    <el-dialog
        :title="dialogStatus === 0 ? '新增广告组' : '编辑广告组'"
        :show-close="false"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="80%"
        >
        <el-steps style="text-align:left;" align-center :active="active" finish-status="success">
            <el-step title="请选择广告素材"></el-step>
            <el-step v-if="totalStep === 2 && type !==7" title="排序"></el-step>
            <el-step v-if="totalStep === 2 && type ===7" title="选择展现系统"></el-step>
            <el-step title="输入广告组名称"></el-step>
        </el-steps>
        <!-- 第一步 -->
        <advert-table v-show="active === 0"></advert-table>
        <!-- 第二步 -->
        <sort-step v-show="active === 1 && totalStep === 2 && type !== 7" :type="type" ref="sortStep"></sort-step>
        <div v-show="active === 1 && type === 7" class="display-system">
            <label>选择展现系统：</label>
              <el-select v-model="displaySystem" placeholder="请选择">
                    <el-option
                        v-for="item in [{value: 1, label: 1}, {value: 2, label: 2}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                    </el-option>
            </el-select>
        </div>
        <!-- 第三步 -->
        <div v-show="active === totalStep" class="step3">
            <div class="input-item">
                <label>广告组名称: </label>
                <el-input
                    class="input"
                    placeholder="请输入广告组名称：广告内容+匹配策略+日期"
                    v-model="advertGroupName"
                    clearable>
                </el-input>
                <el-tooltip
                    placement="top"
                    content='建议广告组名称采用: "广告内容+匹配策略+日期" 的格式'
                >
                    <i class="el-icon-question pointer"></i>
                </el-tooltip>
            </div>
        </div>
        <span v-show="active !== totalStep" slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button v-show="active !== 0" @click="prevStepHandler">上一步</el-button>
            <el-button type="primary" @click="nextStepHandler">下一步</el-button>
        </span>
        <span v-show="active === totalStep" slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="prevStepHandler">上一步</el-button>
            <el-button type="primary" @click="closeDialog">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import AdvertTable from './AdvertTable';
import SortStep from './SortStep';
export default {
    name: 'AdvertGroupDialog',
    components: {
        AdvertTable,
        SortStep
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        dialogStatus: {
            type: Number,
            default: 0
        },
        type: {
            type: Number
        }
    },
    data() {
        return {
            active: 0,
            advertGroupName: '',
            displaySystem: ''
        };
    },
    methods: {
        closeDialog() {
            this.$emit('closeDialog', false);
            this.clearData();
        },
        prevStepHandler() {
            this.active -= 1;
        },
        nextStepHandler() {
            this.active += 1;
            if (this.active === 1) {
                this.$refs.sortStep.initDragula();
            }
        },
        clearData() {
            this.active = 0;
            this.advertGroupName = '';
        }
    },
    computed: {
        totalStep() {
            let type = Number(this.type);
            return type === 4 || type === 5 || type === 6 ? 1 : 2;
        }
    }
};
</script>
<style lang="less" scoped>
.input {
    width: 40%;
    margin-top: 40px;
}
.display-system {
    margin-top: 40px;
}
</style>

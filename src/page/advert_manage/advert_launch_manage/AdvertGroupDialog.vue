<!-- 广告组弹出框 -->
<template>
    <el-dialog
        :title="dialogTitle"
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
        <advert-table :advertList="advertList" v-show="active === 0" ref="advertTable"></advert-table>
        <!-- 第二步 -->
        <sort-step :checkedAdvertList="checkedAdvertList" v-show="active === 1 && totalStep === 2 && type !== 7" :type="type" ref="sortStep"></sort-step>
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
            displaySystem: '',
            checkedAdvertList: [],
            advertList: [
                {
                    id: 1,
                    preview: '素材预览',
                    name: '广告图片名称',
                    format: 'jpg',
                    dimension: '1232*3432',
                    size: '5M',
                    checked: false,
                    img: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                },
                {
                    id: 2,
                    preview: '素材预览',
                    name: '广告图片名称',
                    format: 'jpg',
                    dimension: '1232*3432',
                    size: '4M',
                    checked: true,
                    img: 'http://pic.4j4j.cn/upload/pic/20151015/465ce1d4b0.jpg',
                    createdAt: new Date().getTime() + (Math.floor(Math.random() * 1000000000))
                }
            ]
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
            if (this.active === 0 && this.$refs.advertTable.checkedAdvertList.length <= 0) {
                return false;
            } else {
                this.checkedAdvertList = this.$refs.advertTable.checkedAdvertList;
            }

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
        },
        dialogTitle() {
            if (this.dialogStatus === 0) {
                switch (Number(this.type)) {
                    case 1:
                        return '新增开机广告组';
                    case 2:
                        return '新增节目前置广告组';
                    case 3:
                        return '新增屏保广告组';
                    case 4:
                        return '新增暂停广告组';
                    case 5:
                        return '新增直播换台广告组';
                    case 6:
                        return '新增音量条广告组';
                    case 7:
                        return '新增弹窗广告组';
                    case 8:
                        return '新增节目详情页广告组';
                    default:
                        return '';
                }
            } else {
                switch (Number(this.type)) {
                    case 1:
                        return '编辑开机广告组';
                    case 2:
                        return '编辑节目前置广告组';
                    case 3:
                        return '编辑屏保广告组';
                    case 4:
                        return '编辑暂停广告组';
                    case 5:
                        return '编辑直播换台广告组';
                    case 6:
                        return '编辑音量条广告组';
                    case 7:
                        return '编辑弹窗广告组';
                    case 8:
                        return '编辑节目详情页广告组';
                    default:
                        return '';
                }
            }
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

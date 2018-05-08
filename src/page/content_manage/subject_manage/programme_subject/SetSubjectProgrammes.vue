<!--设置节目专题内节目组件-->
<template>
    <div>
        <div class="block-box text-left">
            <select-multiple-programme
                v-on:setProgramme="setProgramme">
            </select-multiple-programme>
            <el-tag>已选节目</el-tag>
            <div v-if="selectedProgrammeList.length === 0" class="no-programme">目前暂无选择的节目</div>
            <ul class="programme-list" v-else>
                <li v-for="(item,index) in selectedProgrammeList" :key="index">
                    <el-card :body-style="{ padding: '0px' }" class="text-center">
                        <img :src="item.url">
                        <label>{{item.name}}</label>
                        <el-button type="text" @click="removeProgramme(index)">删除</el-button>
                    </el-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectMultipleProgramme from './SelectMultipleProgramme';

    export default {
        name: 'SetSubjectProgrammes',
        components: {
            SelectMultipleProgramme
        },
        // status: 0代表添加节目，1代表编辑节目
        props: ['status'],
        data() {
            return {
                selectedProgrammeList: []
            };
        },
        mounted() {
            if (this.status === '1') {
                this.init();
            }
        },
        methods: {
            init() {
                this.selectedProgrammeList = [
                    {
                        id: 1,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 2,
                        name: '琅琊榜',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        feature: '54',
                        relative: '23',
                        released: '1462243166999',
                        area: '中国大陆',
                        category: '电视剧',
                        type: '剧情/古装',
                        actor: ['胡歌', '刘涛', '王凯', '陈龙'],
                        director: ['孔笙', '李雪'],
                        status: 'NORMAL',
                        updatedAt: 1402233166999
                    }
                ];
            },
            // 删除选中的节目
            removeProgramme(index) {
                this.selectedProgrammeList.splice(index, 1);
            },
            // 设置选择的节目
            setProgramme(selectedProgramme) {
                this.selectedProgrammeList = selectedProgramme;
            }
        }
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
        .el-tag {
            margin-top: 50px;
        }
    }

    .programme-list {
        display: flex;
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            .el-card {
                position: relative;
                padding-bottom: 10px;
            }
            img {
                display: block;
                margin-bottom: 10px;
                height: 180px;
            }
            label {
                font-size: 16px;
            }
            .el-button {
                position: absolute;
                bottom: 0px;
                right: 10px;
            }
        }
    }

    .no-programme {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>

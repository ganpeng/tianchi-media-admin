<!--人物专题中的人物设置组件-->
<template>
    <div>
        <div class="block-box text-left">
            <select-multiple-person
                v-on:setPerson="setPerson">
            </select-multiple-person>
            <el-tag>已选人物</el-tag>
            <div v-if="selectedPersonList.length === 0" class="no-person">目前暂无选择的人物</div>
            <ul class="person-list" v-else>
                <li v-for="(item,index) in selectedPersonList" :key="index">
                    <el-card :body-style="{ padding: '0px' }" class="text-center">
                        <img :src="item.url">
                        <label>{{item.name}}</label>
                        <el-button type="text" @click="removePerson(index)">删除</el-button>
                    </el-card>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import SelectMultiplePerson from './SelectMultiplePerson';

    export default {
        name: 'SetSubjectPersons',
        components: {
            SelectMultiplePerson
        },
        // status: 0代表增添人物，1代表编辑人物
        props: ['status'],
        data() {
            return {
                selectedPersonList: []
            };
        },
        mounted() {
            if (this.status === '1') {
                this.init();
            }
        },
        methods: {
            init() {
                this.selectedPersonList = [
                    {
                        id: 1,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    },
                    {
                        id: 2,
                        name: '胡歌',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.zn7At_hL_CSW6MsoVrzGuAHaEo&w=300&h=187&c=7&o=5&pid=1.7',
                        description: '十二年前七万赤焰军被奸人所害导致全军覆没，冤死梅岭，只剩少帅林殊（张哲瀚 饰）侥幸生还。十二年后林殊改头换面化身“麒麟才子”梅长苏（胡歌 饰），建立江左盟，以“琅琊榜”第一才子的身份重返帝都。梅长苏背负血海深仇，暗中帮助昔日挚友靖王（王凯 饰）周旋于太子（高鑫 饰）与誉王（黄维德 饰）的斗争之中，同时又遇到了昔日未婚妻——云南王郡主穆霓凰（刘涛 饰）却不能相见。梅长苏以病弱之躯为昭雪冤案、为振兴河山，踏上了一条黑暗又惊心动魄的夺嫡之路。',
                        area: '中国大陆',
                        updatedAt: 1402233166999
                    }
                ];
            },
            // 删除选中的人物
            removePerson(index) {
                this.selectedPersonList.splice(index, 1);
            },
            // 设置选择的人物
            setPerson(selectedPerson) {
                this.selectedPersonList = selectedPerson;
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

    .person-list {
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

    .no-person {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>

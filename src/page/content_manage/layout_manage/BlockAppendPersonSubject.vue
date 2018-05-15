<!--内容管理-栏目管理-人物模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入人物模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="blockName"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择要推荐的人物专题：</h3>
        <select-single-subject
            v-on:selectSubject="selectSubject">
        </select-single-subject>
        <h3 class="text-left">3.请对专题中的人物排序：</h3>
        <ul id="person-list" v-dragula="{direction: 'horizontal',data:personList}">
            <li v-for="(item, index) in personList" :key="index" :index="index">
                <img :src="item.url" :alt="item.name"/>
                <label>{{item.name}}</label>
            </li>
        </ul>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';

    export default {
        name: 'BlockAppendPersonSubject',
        components: {
            SelectSingleSubject
        },
        data() {
            return {
                blockName: '',
                currentSubject: {},
                personList: [
                    {
                        id: 1,
                        name: '胡歌',
                        url: 'https://tse3-mm.cn.bing.net/th?id=OIP.1-acNShtMsNIMQJsroHMuwHaKI&w=158&h=216&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 2,
                        name: '高圆圆',
                        url: 'https://tse4-mm.cn.bing.net/th?id=OIP.22zt7hCq2Em5PD0DumIP5gHaKp&w=202&h=290&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 3,
                        name: '韩雪',
                        url: 'https://tse4-mm.cn.bing.net/th?id=OIP.o74CBfjLIX0xK99xUulMyQHaEo&w=202&h=126&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 4,
                        name: '吴秀波',
                        url: 'https://tse2-mm.cn.bing.net/th?id=OIP.fSKNRnnI4tnlYuGHP-8voAHaHa&w=197&h=197&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 5,
                        name: '林允儿',
                        url: 'https://tse3-mm.cn.bing.net/th?id=OIP.NqtiBSJBvQXIzh5VWhd6GAHaL2&w=146&h=216&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 6,
                        name: '吴磊',
                        url: 'https://tse4-mm.cn.bing.net/th?id=OIP.RBLvxnKlbS1a7cZOh3TedgHaLH&w=199&h=299&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 7,
                        name: '张歆艺',
                        url: 'https://tse2-mm.cn.bing.net/th?id=OIP.oK9RHAqmuLXhGnRjI7D7cwHaHa&w=202&h=202&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 8,
                        name: '张一山',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.b8k03mWs8v3G7HE-7SIExwHaEo&w=202&h=126&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 9,
                        name: '宋祖儿',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.QuIRAXQDDUYPXjW4tBljkAHaI0&w=202&h=240&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 10,
                        name: '韩东君',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.Y_owRPO1KuYUUcFDjsKvPQHaJ0&w=202&h=267&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 11,
                        name: '罗晋',
                        url: 'https://tse2-mm.cn.bing.net/th?id=OIP.PBOQ2It90CEAY6j3jNva1QHaJ4&w=202&h=269&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 12,
                        name: '戚薇',
                        url: 'https://tse2-mm.cn.bing.net/th?id=OIP.ud2NpVUJ47791VsD4uksJQHaJ5&w=202&h=269&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 13,
                        name: '黄晓明',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.-5j-asMrQhANaoiEWsgs5gHaGl&w=247&h=217&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 14,
                        name: '刘德华',
                        url: 'https://tse1-mm.cn.bing.net/th?id=OIP.a1_0YYQ5SuE6dHx4gGsyFgHaIK&w=198&h=218&c=7&o=5&pid=1.7'
                    },
                    {
                        id: 15,
                        name: '文章',
                        url: 'https://tse4-mm.cn.bing.net/th?id=OIP.ZqzRpdPAD5kdqmb8PLrqVgHaJR&w=202&h=253&c=7&o=5&pid=1.7'
                    }
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 选择某一个专题
            selectSubject(item) {
                this.currentSubject = item;
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

    .el-input {
        width: 500px;
    }

    #person-list {
        display: flex;
        margin-top: 30px;
        padding: 0 20px 20px 20px;
        justify-content: left;
        flex-wrap: wrap;
        border: 1px dotted gray;
        li {
            display: flex;
            margin-right: 30px;
            margin-top: 20px;
            flex-direction: column;
            justify-content: space-between;
            height: 230px;
            img {
                display: block;
                height: 200px;
                width: 200px;
                border-radius: 180px;
                cursor: grab;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
        }
    }

    /*
     * 设置拖拽效果样式
     */

    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.4s ease-in-out;
        text-align: center;
        img {
            display: block;
            height: 200px;
            width: 200px;
            border-radius: 180px;
            cursor: grab;
        }
        label {
            text-align: center;
            font-size: 16px;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }
</style>

<template>
    <div class="search-container">
        <h2 class="content-title">搜索管理</h2>
        <ul class="search-list clearfix">
            <li v-for="(item, index) in list" :key="index" class="search-item">
                <span class="index">{{index + 1}}</span>
                <input v-if="item.edit" :value="item.temp" type="text" @change="searchItemChangeHandler($event, index)">
                <span v-else class="search-name">{{item.name}}</span>
                <button v-if="!item.edit" class="edit-btn" @click="searchItemEditHandler(index)">编辑</button>
                <button v-else class="save-btn" @click="searchItemSaveHandler(index)">保存</button>
            </li>
        </ul>
        <search-person></search-person>
    </div>
</template>
<script>
import _ from 'lodash';
import SearchPerson from '../../components/custom_components/custom/SearchPerson';
export default {
    name: 'Search',
    components: {
        SearchPerson
    },
    data() {
        return {
            list: [
                {
                    name: 'haha',
                    temp: '',
                    edit: false
                },
                {
                    name: 'xixi',
                    temp: '',
                    edit: false
                }
            ]
        };
    },
    created() {
        this.generatorList();
    },
    methods: {
        searchItemChangeHandler(e, index) {
            this.list[index].temp = e.target.value;
        },
        searchItemEditHandler(index) {
            this.list[index].edit = true;
            this.list[index].temp = this.list[index].name;
        },
        searchItemSaveHandler(index) {
            this.list[index].edit = false;
            this.list[index].name = this.list[index].temp;
            this.list[index].temp = '';
        },
        generatorList() {
            let list = _.times(20, () => {
                return {
                    name: 'haha',
                    temp: '',
                    edit: false
                };
            });
            this.list = list;
        }
    }
};
</script>
<style lang="scss" scoped>
.search-list {
    width: 440px;
    margin: 30px auto;
    .search-item {
        position: relative;
        float: left;
        width: 200px;
        height: 40px;;
        line-height: 40px;
        background: #fff;
        color: #000;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #f5f5f5;
        input, .search-name {
            position: absolute;
            top: 0;
            left: 30px;
            bottom: 0;
            width: 140px;
            border: none;
            text-indent: 10px;
        }
        button {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 40px;
            border: none;
        }
        .index {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 30px;
            border-right: 1px solid #f5f5f5;
        }
    }
}
</style>

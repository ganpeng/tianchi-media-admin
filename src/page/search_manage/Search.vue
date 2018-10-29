<template>
    <div class="search-container">
        <h2 class="content-title">搜索管理</h2>
        <ul class="search-list clearfix">
            <li v-for="(item, index) in list" :key="index" class="search-item">
                <input v-if="item.edit" :value="item.temp" type="text" @change="searchItemChangeHandler($event, index)">
                <span v-else class="search-name">{{item.name}}</span>
                <button v-if="!item.edit" class="edit-btn" @click="searchItemEditHandler(index)">编辑</button>
                <button v-else class="save-btn" @click="searchItemSaveHandler(index)">保存</button>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Search',
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
        }
    }
};
</script>
<style lang="scss" scoped>
.search-list {
    margin-top: 30px;
    .search-item {
        position: relative;
        float: left;
        width: 200px;
        height: 30px;;
        line-height: 30px;
        background: #fff;
        color: #000;
        margin-right: 10px;
        input, span {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 140px;
        }
        button {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 40px;
        }
    }
}
</style>

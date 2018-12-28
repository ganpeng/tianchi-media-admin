<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        placeholder="请选择人物"
        @select="selectHandler"
    ></el-autocomplete>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    name: 'SearchPerson',
    props: {
        handleSelect: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            restaurants: [],
            qs: ''
        };
    },
    methods: {
        ...mapActions({
            searchPerson: 'person/searchPerson'
        }),
        querySearchAsync(name, cb) {
            this.searchPerson(name)
                .then((res) => {
                    if (res && res.code === 0) {
                        let {list} = res.data;
                        let resList = list.map((item) => {
                            item.value = item.name;
                            return item;
                        });
                        cb(resList);
                    }
                });
        },
        selectHandler(person) {
            this.handleSelect(person);
            this.qs = '';
        }
    }
};
</script>
<style lang="scss" scoped>
</style>

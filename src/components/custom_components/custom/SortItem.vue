<template>
    <div class="sort-item-container">
            <!-- trigger="click" -->
        <el-dropdown
            :hide-on-click="false"
            class="my-dropdown">
            <span class="el-dropdown-link">
                排序<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <div v-for="(sort, index) in sortKeyList" :key="index" @click="selectSortKey(sort)" :class="['sort-key-item', sortKeyItemActive(sort) && 'active']">
                    {{sort.label}}
                </div>
                <div class="seperator-line"></div>
                <div @click="selectSortDirection('ASC')" :class="['sort-key-item', sortDirection === 'ASC' && 'active']">增序</div>
                <div @click="selectSortDirection('DESC')" :class="['sort-key-item', sortDirection === 'DESC' && 'active']">降序</div>
                <div @click="resetSort" class="sort-key-item">重置</div>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
export default {
    name: 'SortItem',
    props: {
        sortKeyList: {
            type: Array,
            default: () => [{label: '创建时间', value: 'CREATED_AT'}, {label: '更新时间', value: 'UPDATED_AT'}]
        },
        sortQueryChangeHandler: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            sortKey: '', // 选中的排序项目
            sortDirection: ''
        };
    },
    computed: {
        sortKeyItemActive() {
            return (sort) => {
                let {value} = sort;
                return value === this.sortKey;
            };
        }
    },
    methods: {
        selectSortKey(sort) {
            let {value} = sort;
            this.sortKey = value;
            this.sortQueryChangeHandler({sortKey: this.sortKey, sortDirection: this.sortDirection});
        },
        selectSortDirection(sortDirection) {
            this.sortDirection = sortDirection;
            this.sortQueryChangeHandler({sortKey: this.sortKey, sortDirection: this.sortDirection});
        },
        resetSort() {
            this.sortKey = '';
            this.sortDirection = '';
            this.sortQueryChangeHandler({sortKey: this.sortKey, sortDirection: this.sortDirection});
        }
    }
};
</script>
<style lang="scss">
.el-dropdown-menu.el-popper {
    .sort-key-item {
        color: #D8D8D8;
        font-size: 12px;
        height: 20px;
        line-height: 20px;;
        padding: 0 20px;
        margin: 2px 0;
        text-align: center;
        cursor: pointer;
        &:hover,
        &.active {
            color: #fff;
            background-color: #1989FA;
        }
    }
    .seperator-line {
        margin: 10px 0;
    }
}
</style>

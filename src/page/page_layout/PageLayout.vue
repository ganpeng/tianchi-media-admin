<template>
    <div class="page-layout-container">
        <div class="columns-container">
            <ul class="columns-list clearfix">
                <li
                    v-for="(column, index) in columns"
                    :key="index"
                    @click="columnsTabChangeHandler(index)"
                    :class="['columns-item', columnsActiveIndex === index ? 'active' : '']">
                    {{column.text}}
                </li>
            </ul>
        </div>
        <div class="page-layout-content">

        </div>
    </div>
</template>
<script>
import {columns} from '../../util/config/column';
export default {
    name: 'PageLayout',
    data() {
        return {
            columnsActiveIndex: 0,
            columns: columns
        };
    },
    methods: {
        columnsTabChangeHandler(index) {
            this.columnsActiveIndex = index;
        }
    }
};
</script>
<style lang="scss" scoped>
.page-layout-container {
    background: #fff;
}
.columns-list {
    .columns-item {
        float: left;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &.active {
            color: red;
        }
    }
}
</style>

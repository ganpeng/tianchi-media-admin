<template>
    <div class="other-layout-container">
        <mlt1
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'M_LT_1'"
        ></mlt1>
    </div>
</template>
<script>
import Mlt1 from './mixed_module/Mlt1';
export default {
    name: 'OtherLayout',
    components: {
       Mlt1
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        },
        layoutTemplate: {
            type: String,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss" scoped>
</style>

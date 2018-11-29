<template>
    <div class="other-layout-container">
        <person
            :item="item"
            :index="index"
            v-if="layoutTemplate === 'LT_F_6'"
        ></person>
        <special
            :item="item"
            :index="index"
            v-if="layoutTemplate === 'LT_SP_2'"
        ></special>
        <person-subject
            :item="item"
            :index="index"
            v-if="layoutTemplate === 'LT_FS_6'"
        ></person-subject>
    </div>
</template>
<script>
// import Mixeds6 from './mixed_module/Mixeds6';
import Person from './mixed_module/Person';
import Special from './mixed_module/Special';
import PersonSubject from './mixed_module/PersonSubject';
export default {
    name: 'OtherLayout',
    components: {
        Special,
        Person,
        PersonSubject
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
        renderType: {
            type: String,
            required: true
        },
        layoutTemplate: {
            type: String,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    created() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
</style>

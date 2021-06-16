<template>
    <div class="fixed-layout-container">
        <recommend-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_0'"
        ></recommend-fixed-module>
        <teleplay-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_1'"
        ></teleplay-fixed-module>
        <movie-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_2'"
        ></movie-fixed-module>
        <news-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_3'"
        ></news-fixed-module>
        <subject-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_4'"
        ></subject-fixed-module>
        <child-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_5'"
        ></child-fixed-module>
        <category-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_6'"
        ></category-fixed-module>
        <party-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_7'"
        ></party-fixed-module>
        <education-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_8'"
        ></education-fixed-module>
        <my-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_9'"
        ></my-fixed-module>
        <watch-tv-fixed-module
            :isEdit="isEdit"
            v-if="layoutTemplate === 'FS_10'"
        ></watch-tv-fixed-module>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ChildFixedModule from './fixed_module/ChildFixedModule';
import MovieFixedModule from './fixed_module/MovieFixedModule';
import NewsFixedModule from './fixed_module/NewsFixedModule';
import RecommendFixedModule from './fixed_module/RecommendFixedModule';
import TeleplayFixedModule from './fixed_module/TeleplayFixedModule';
import CategoryFixedModule from './fixed_module/CategoryFixedModule';
import SubjectFixedModule from './fixed_module/SubjectFixedModule';
import PartyFixedModule from './fixed_module/PartyFixedModule';
import EducationFixedModule from './fixed_module/EducationFixedModule';
// dev2.9新增
import MyFixedModule from './fixed_module/MyFixedModule';
import WatchTvFixedModule from './fixed_module/WatchTvFixedModule';
export default {
    name: 'FixedLayout',
    components: {
        ChildFixedModule,
        MovieFixedModule,
        NewsFixedModule,
        RecommendFixedModule,
        TeleplayFixedModule,
        CategoryFixedModule,
        SubjectFixedModule,
        PartyFixedModule,
        EducationFixedModule,
        // dev2.9
        MyFixedModule,
        WatchTvFixedModule
    },
    props: {
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
    computed: {
        ...mapGetters({})
    },
    methods: {
        ...mapMutations({}),
        ...mapActions({})
    }
};
</script>
<style lang="scss" scoped>
</style>

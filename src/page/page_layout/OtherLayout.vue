<template>
    <div class="other-layout-container">
        <person
            :item="item"
            :index="index"
            v-if="layoutTemplate === 'LT_F_6' || layoutTemplate === 'LT_KID_6'"
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
        <mixed4
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_4'"
        ></mixed4>
        <mixed66
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_6_6' && item.renderType === 'SHUFFLE'"
        ></mixed66>
        <ps-template66
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_6_6' && item.renderType === 'PROGRAMME_SUBJECT'"
        ></ps-template66>
        <mixeds6
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_S6'"
        ></mixeds6>
        <mixed26
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_2_6' && item.renderType === 'SHUFFLE'"
        ></mixed26>
        <ps-template26
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_2_6' && item.renderType === 'PROGRAMME_SUBJECT'"
        ></ps-template26>
        <mixed32
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_3_2' && item.renderType === 'SHUFFLE'"
        ></mixed32>
        <ps-template32
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_3_2' && item.renderType === 'PROGRAMME_SUBJECT'"
        ></ps-template32>
        <mixed114
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_1_1_4' && item.renderType === 'SHUFFLE'"
        ></mixed114>
        <ps-template114
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_1_1_4' && item.renderType === 'PROGRAMME_SUBJECT'"
        ></ps-template114>
        <mixed33
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_3_3'"
        ></mixed33>
        <mixed23
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_2_3' && item.renderType === 'SHUFFLE'"
        ></mixed23>
        <ps-template23
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_2_3' && item.renderType === 'PROGRAMME_SUBJECT'"
        ></ps-template23>
        <mixedsn
            :item="item"
            :index="index"
            :isEdit="false"
            v-if="layoutTemplate === 'LT_SN'"
        ></mixedsn>
    </div>
</template>
<script>
// import Mixeds6 from './mixed_module/Mixeds6';
import Person from './mixed_module/Person';
import Special from './mixed_module/Special';
import PersonSubject from './mixed_module/PersonSubject';
import Mixed4 from './mixed_module/Mixed4';
import Mixed66 from './mixed_module/Mixed66';
import Mixeds6 from './mixed_module/Mixeds6';
import Mixed26 from './mixed_module/Mixed26';
import Mixed32 from './mixed_module/Mixed32';
import Mixed114 from './mixed_module/Mixed114';
import Mixed33 from './mixed_module/Mixed33';
import Mixed23 from './mixed_module/Mixed23';
import Mixedsn from './mixed_module/Mixedsn';
import PsTemplate114 from './programme_subject_module/PsTemplate114';
import PsTemplate23 from './programme_subject_module/PsTemplate23';
import PsTemplate26 from './programme_subject_module/PsTemplate26';
import PsTemplate32 from './programme_subject_module/PsTemplate32';
import PsTemplate66 from './programme_subject_module/PsTemplate66';
export default {
    name: 'OtherLayout',
    components: {
        Special,
        Person,
        PersonSubject,
        Mixed4,
        Mixed66,
        Mixeds6,
        Mixed26,
        Mixed32,
        Mixed114,
        Mixed33,
        Mixed23,
        Mixedsn,
        PsTemplate114,
        PsTemplate23,
        PsTemplate26,
        PsTemplate32,
        PsTemplate66
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

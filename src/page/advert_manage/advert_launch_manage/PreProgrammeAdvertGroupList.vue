<!-- 前置节目广告组件 -->
<template>
    <advert-group-list :type="2"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'PreProgrammeAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>

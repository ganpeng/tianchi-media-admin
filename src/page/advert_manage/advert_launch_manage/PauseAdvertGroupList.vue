<!-- 暂停广告组件 -->
<template>
    <advert-group-list :type="4"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'PauseAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>

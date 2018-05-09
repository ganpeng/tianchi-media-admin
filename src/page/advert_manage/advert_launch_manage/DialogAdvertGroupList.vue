<!-- 弹窗广告组件 -->
<template>
    <advert-group-list :type="7"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'DialogAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>

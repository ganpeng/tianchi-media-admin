<!-- 屏保广告组件 -->
<template>
    <advert-group-list :type="3"></advert-group-list>
</template>
<script>
import AdvertGroupList from './AdvertGroupList';
export default {
    name: 'ScreensaverAdvertGroupList',
    components: {
        AdvertGroupList
    }
};
</script>

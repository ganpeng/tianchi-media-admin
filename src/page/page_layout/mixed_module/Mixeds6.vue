<template>
    <div class="mixeds6-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
            <div class="wrapper">
                <div class="field"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixeds6',
    data() {
        return {};
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background: #2A3040;
    border-radius: 8px;
}
.mixeds6-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            flex: 1;
            .field {
                @include paddingBg(100%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>

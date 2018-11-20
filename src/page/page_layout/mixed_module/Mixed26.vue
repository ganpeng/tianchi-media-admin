<template>
    <div class="mixed26-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div class="top-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="top-right-field"></div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div class="bottom-1-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-2-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-3-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-4-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-5-field"></div>
                </div>
                <div class="wrapper">
                    <div class="bottom-6-field"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed26',
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
.mixed26-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                &:first-child {
                    margin-right: 2%;
                }
                .top-left-field,
                .top-right-field {
                    @include paddingBg(51.1627%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
            .bottom-1-field,
            .bottom-2-field,
            .bottom-3-field,
            .bottom-4-field,
            .bottom-5-field,
            .bottom-6-field {
                @include paddingBg(150%);
            }
        }
    }
}
</style>

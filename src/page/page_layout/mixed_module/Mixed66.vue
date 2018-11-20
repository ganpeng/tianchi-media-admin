<template>
    <div class="mixed66-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="top-field">
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
            <div class="bottom-field">
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
    </div>
</template>
<script>
export default {
    name: 'Mxied66',
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
.mixed66-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                .field {
                    @include paddingBg(150%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                .field {
                    @include paddingBg(150%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
    }
}
</style>

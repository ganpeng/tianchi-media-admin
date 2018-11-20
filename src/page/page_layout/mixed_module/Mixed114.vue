<template>
    <div class="mixed114-container">
        <div class="header"></div>
        <div class="content-field">
            <div class="wrapper">
                <div class="left-field"></div>
            </div>
            <div class="wrapper">
                <div class="right-field">
                    <div class="right-top-field"></div>
                    <div class="right-bottom-field">
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                        <div class="wrapper">
                            <div class="right-bottom-field-item"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Mixed114',
    data() {
        return {}
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
.mixed114-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            &:first-child {
                width: 31.8181%;
                .left-field {
                    @include paddingBg(130.3571%);
                }
            }
            &:last-child {
                flex: 1;
                margin-left: 2%;
                .right-field {
                    display: flex;
                    flex-direction: column;
                    .right-top-field {
                        @include paddingBg(25.2620%);
                    }
                    .right-bottom-field {
                        display: flex;
                        flex: 1;
                        margin-top: 2.6%;
                        .wrapper {
                            flex: 1;
                            .right-bottom-field-item {
                                @include paddingBg(150%);
                            }
                        }
                        .wrapper + .wrapper {
                            margin-left: 2.5%;
                        }
                    }
                }
            }
        }
    }
}
</style>

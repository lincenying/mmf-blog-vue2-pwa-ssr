<template>
    <div class="settings-section">
        <div class="settings-item with-input">
            <h4 class="settings-title">{{ title }}</h4>
            <div class="settings-item-content" :class="classes">
                <div class="settings-input-wrap"><slot></slot></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AInput',
    props: ['title', 'classes'],
}
</script>

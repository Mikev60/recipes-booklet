<template>
    <v-snackbar :model-value="modelValue" @update:model-value="onUpdateModelValue" :timeout="timeOut" :color="type"><v-icon
            :icon="icon"></v-icon> {{
                text }}</v-snackbar>
</template>

<script>
export default {
    name: 'SnackBar',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timeOut: {
            type: String,
            required: false,
            default: 2000
        }
    },
    emits: ['update:modelValue'],
    setup(props, context) {
        function onUpdateModelValue(value) {
            context.emit('update:modelValue', value);
        }

        return {
            onUpdateModelValue
        }
    }
}
</script>
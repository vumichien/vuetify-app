<template>
    <v-container>
        <h1>マニュアル作成</h1>
        <v-text-field label="情報を入力してください" v-model="text"></v-text-field>
        <FileUpload />
    </v-container>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue';

export default {
components: { FileUpload },
data() {
    return {
    text: ''
    };
}
};
</script>
<template>
  <div class="file-upload">
    <v-file-input
      v-model="files"
      label="ファイルをアップロード"
      filled
      prepend-icon="mdi-upload"
      multiple
      chips
      show-size
      counter
      @change="handleFiles"
    >
      <template v-slot:selection="{ text }">
        <v-chip
          small
          label
          color="primary"
        >
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <!-- アップロードされたファイルを表示 -->
    <v-list v-if="uploadedFiles.length > 0" dense>
      <v-subheader>アップロードされたファイル</v-subheader>
      <v-list-item v-for="(file, index) in uploadedFiles" :key="index">
        <v-list-item-icon>
          <v-icon>mdi-file</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ file.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="removeFile(index)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    initialFiles: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      files: [],
      uploadedFiles: []
    }
  },
  watch: {
    initialFiles: {
      immediate: true,
      handler(newFiles) {
        console.log('FileUpload - initialFiles changed:', newFiles);
        if (newFiles && newFiles.length > 0) {
          this.files = [...newFiles];
          this.uploadedFiles = [...newFiles];
          this.handleFiles(newFiles);
        }
      }
    }
  },
  methods: {
    handleFiles(files) {
      console.log('FileUpload - handleFiles:', files);
      if (files) {
        this.uploadedFiles = Array.isArray(files) ? files : [files];
        this.files = this.uploadedFiles;
        this.$emit('files-selected', this.uploadedFiles);
      } else {
        this.uploadedFiles = [];
        this.files = [];
      }
      console.log('FileUpload - Current state:', {
        files: this.files,
        uploadedFiles: this.uploadedFiles
      });
    },
    removeFile(index) {
      console.log('FileUpload - Removing file at index:', index);
      this.uploadedFiles.splice(index, 1);
      this.files = this.uploadedFiles;
      this.$emit('files-selected', this.uploadedFiles);
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    getFiles() {
      return this.uploadedFiles;
    }
  },
  mounted() {
    console.log('FileUpload - Component mounted', {
      files: this.files,
      uploadedFiles: this.uploadedFiles,
      initialFiles: this.initialFiles
    });
  }
}
</script>

<style scoped>
.v-list {
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>

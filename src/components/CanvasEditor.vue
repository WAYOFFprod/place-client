<template>
  <n-modal 
      :show="isOpen"
      :on-after-enter="afterEnter"
      preset="dialog"
      title="Dialog"
      :mask-closable="false"
      @handleCloseClick="closeModal">
      <template #header>
        <div>Account</div>
      </template>
        <n-form
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-grid :span="24" class="margin-top">
            <n-form-item-gi :span="24" label="Canvas name" path="name">
              <n-input v-model:value="formValue.name" :default-value="formValue.name" placeholder="Value" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Width" path="width">
              <n-input-number :step="100" v-model:value="formValue.width" :default-value="formValue.width" placeholder="1000" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Height" path="height">
              <n-input-number :step="100" v-model:value="formValue.height" :default-value="formValue.height" placeholder="1000" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Allow manual pixel placement" path="manual">
              <n-switch v-model:value="formValue.manual" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Allow Script and Bot pixel placement" path="script">
              <n-switch v-model:value="formValue.script" />
            </n-form-item-gi>
            <n-form-item-gi :span="24" label="Make canvas private" path="private">
              <n-switch v-model:value="formValue.private" />
            </n-form-item-gi>
            <n-form-item-gi :span="12" class="validation-right">
              <n-button @click="save">
                Save
              </n-button>
              <n-button @click="cancel">
                Cancel
              </n-button>
            </n-form-item-gi>
          </n-grid>
        </n-form>
    </n-modal>
</template>

<script>
import { NModal, NForm, NInput, NFormItemGi, NButton, NGrid, NSwitch, NInputNumber} from 'naive-ui';
import VueAxios from './common/http-common';
import { UIStore, sessionStore } from './../store.js'
export default {
  mixins: [VueAxios],
  props: ['isOpen', 'isNew', 'id', 'width', 'height', 'script_allowed', 'manual_allowed', 'private', 'label'],
  components: {
    NModal,
    NForm,
    NInput,
    NButton,
    NFormItemGi,
    NGrid,
    NSwitch,
    NInputNumber,
  },
  data () {
    return {
      UIStore,
      sessionStore,
      name: this.label,
      formValue: {
        name: this.label,
        width: this.width,
        height: this.height,
        manual: this.script_allowed,
        script: this.manual_allowed,
        private: this.private,
      },
      rules: {
        name: {
          required: true,
          message: 'Please input your name',
          trigger: ['input', 'blur']
        },
        width: {
          required: true,
          message: 'Please input a width',
          trigger: ['input', 'blur']
        },
        height: {
          required: true,
          message: 'Please input a height',
          trigger: ['input', 'blur']
        }
      },
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeCanvas");
    },
    save() {
      if(this.isNew) {
        const bodyFormData = new FormData()
        bodyFormData.append('width', this.formValue.width)
        bodyFormData.append('height', this.formValue.height)
        bodyFormData.append('label', this.formValue.name)
        bodyFormData.append('manual_allowed', this.formValue.manual == true ? 1 : 0)
        bodyFormData.append('script_allowed', this.formValue.script == true ? 1 : 0)
        bodyFormData.append('private', this.formValue.private == true ? 1 : 0)
        this.HTTP
          .post('canvas/create', bodyFormData, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
          .then(response => {
            this.$emit("closeCanvas", response.data);
          })
          .catch(error => {
            let e = JSON.parse(error.request.response); 
            console.log(e.code, e.message)
          })
      } else {
        const bodyFormData = new FormData()
        bodyFormData.append('width', this.formValue.width)
        bodyFormData.append('height', this.formValue.height)
        bodyFormData.append('label', this.formValue.name)
        bodyFormData.append('manual_allowed', this.formValue.manual == true ? 1 : 0)
        bodyFormData.append('script_allowed', this.formValue.script == true ? 1 : 0)
        bodyFormData.append('private', this.formValue.private == true ? 1 : 0)
        this.HTTP
          .post('canvas/'+this.id, bodyFormData, { headers: {"Authorization" : 'Bearer ' + sessionStore.token} })
          .then(response => {
            this.$emit("closeCanvas", response.data);
          })
          .catch(error => {
            let e = JSON.parse(error.request.response); 
            console.log(e.code, e.message)
          })
      }
      
    },
    cancel() {
      this.$emit("closeCanvas");
    },
    afterEnter() {
      this.formValue.name = this.label
      this.formValue.width = this.width
      this.formValue.height = this.height
      this.formValue.manual = this.script_allowed == 1 ? true : false
      this.formValue.script = this.manual_allowed == 1 ? true : false
      this.formValue.private = this.private == 1 ? true : false
    }
  }
}
</script>

<style>

</style>
<template>
  <a-modal :title="title" :width="500" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
    <a-form :form="form" :rules="rules" ref="form">
      <a-form-item label="原密码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
                type="password"
                prop="old_password"
                v-decorator="['old_password', {initialValue:'',rules: [{required: true,  message: '请输入原密码'}]}]"
                placeholder='请输入原密码'
        />
      </a-form-item>
      <a-form-item label="新密码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">

        <div>
          <a-col :span="28">
            <a-input
                    v-decorator="['new_password2', {rules: [{required: true, min: 6, message: '请输入新密码'},{validator: handlePass}]}]"
                    @focus.capture.native='changePasswordTip(true)' @blur.capture.native='changePasswordTip(false)' auto-complete="new-password" type="password" placeholder='请输入新密码' prop="password" />
            <div style="position: absolute">
              <verify-pass-word-tip :password="new_password2" :isShowTip = 'isShowTip'></verify-pass-word-tip>
            </div>
          </a-col>
        </div>
      </a-form-item>
      <a-form-item label="确认新密码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
                type="password"
                prop="new_password"
                v-decorator="['new_password', {initialValue:'',rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
                placeholder='请再次输入新密码'
        />
      </a-form-item>


    </a-form>
  </a-modal>
</template>
<script>
    import { modifyPassword } from '@/api/framework/user'
    import verifyPassWordTip from '../../../utils/vue/verifyPassWordTip'
    export default {
        name: 'VerifyPassWord',
        components: {
            verifyPassWordTip
        },
        data() {
            return {
                new_password: '',
                old_password: '',
                new_password2: '',
                values: [],
                visible: false,
                isShowTip: false,
                title: '修改密码',
                rules: {
                    // password: [{ require: true, message: '请选择', trigger: 'blur' }]
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 13 }
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 }
                },
                form: this.$form.createForm(this)
            }
        },
        methods: {
            reset(id) {
                this.id = id,
                    this.visible = true
                this.isShowTip = false
                this.form.setFieldsValue({
                    new_password: '',
                    old_password: '',
                    new_password2: '',
                });
            },
            handleCancel() {
                this.visible = false
                this.id = null
                this.confirmLoading = false
                this.show = false
            },
            handlePass(rule, value, callback) {
                this.new_password2 = value
                console.log(value)
                //this.password = value
                callback()
            },
            handleSubmit() {
                if (this.new_password2 != this.new_password) {
                    //
                }
                this.values = {
                    new_password2: this.new_password2,
                    new_password: this.new_password,
                    old_password: this.old_password,
                };
                const {
                    form: { validateFields }
                } = this

                validateFields((errors, values) => {
                    values.new_password2 = this.new_password2
                    if (!errors) {
                        this.confirmLoading = true
                        modifyPassword(values)
                            .then(res => {
                                this.refresh(res.message)
                            })
                    }
                })
            },
            refresh(message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                this.handleCancel()
                //   this.$parent.$parent.handleOk()
            },

            /**
             * 改变密码提示是否显示
             **/
            changePasswordTip(isShow) {
                if (isShow) {
                    this.isShowTip = true
                } else {
                    this.isShowTip = false
                }
            }
        }
    }
</script>
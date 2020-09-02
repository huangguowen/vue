<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
    <a-form :form="form" :rules="rules" ref="form">
        <a-form-item label="新密码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">

            <a-row style="width: 300px;">
                <a-col :span="24">
                    <a-input
                            v-decorator="['password', {rules: [{required: true, min: 6, message: '密码长度不少于6位'},{validator: handlePass}]}]"
                             @focus.capture.native='changePasswordTip(true)' @blur.capture.native='changePasswordTip(false)' auto-complete="new-password" type="password" placeholder='请输入密码' prop="password" />
                    <div style="position: absolute">
                        <verify-pass-word-tip :password="password" :isShowTip = 'isShowTip'></verify-pass-word-tip>
                    </div>
                </a-col>
            </a-row>
            </a-form-item>

    </a-form>
    </a-modal>

</template>
<script>
    import { updatePass } from '@/api/framework/user'
    import verifyPassWordTip from '../../../utils/vue/verifyPassWordTip'
    export default {
        name: "VerifyPassWord",
        components: {
            verifyPassWordTip
        },
        data() {
            return {
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 13 }
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 }
                },
                password: '',
                values:[],
                visible: false,
                isShowTip: false,
                title: '重置密码',
                rules: {
                    'password':[{require: true, message: '请选择', trigger: 'blur'}]
                },
                form: this.$form.createForm(this)
            }
        },
        methods: {
            reset(id) {
                this.password = '',
                this.id = id,
                this.visible = true
                this.isShowTip = true
            },
            handleCancel () {
                this.visible = false
                this.id = null
                this.confirmLoading = false
                this.show = false
            },
            handlePass(rule, value, callback) {
                this.password = value
                console.log(value)
                //this.password = value
                callback()
            },
            handleSubmit () {
                this.values = {
                    password: this.password
                };
                const {
                    form: {validateFields}
                } = this
                validateFields((errors, values) => {
                    if (!errors) {
                        updatePass(this.id, this.values)
                            .then(res => {
                                this.refresh(res.message)
                            }).catch(err => this.failed(err))
                    }
                });
            },
            refresh(message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                this.handleCancel()
                this.$parent.$parent.handleOk()
            },
            failed(errors) {
                this.$notification['error']({
                    message: errors.message,
                    duration: 4
                })
                this.confirmLoading = false
            },
            /**
             * 改变密码提示是否显示
             **/
            changePasswordTip(isShow) {
                if (isShow) {
                    this.isShowTip = true;
                } else {
                    this.isShowTip = false;
                }
            },
        }
    }
</script>

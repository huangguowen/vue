<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <a-form>
            <a-form-item
                    label="密码"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
            >
                <a-input allowClear allotype="password" v-decorator="['password', {rules: [{required: password_required, min: 5, message: '请输入密码'}]}]" />
            </a-form-item>
        </a-form>

    </a-modal>

</template>
<script>
    import AFormItem from "ant-design-vue/es/form/FormItem";
    export default {
        data() {
            return {
                visible: false,
                title: '重置密码',
            }
        },
        components: {AFormItem},
        methods: {
            reset() {
                this.visible = true
                console.log(1)
            },
            handleCancel () {
                this.visible = false
                this.id = null
                this.confirmLoading = false
                this.parent_id = 0
                this.permissionids = []
                this.department_ids = []
                this.show = false
                this.form.resetFields()
            },
            handleSubmit () {

            }
        }
    }
</script>

<div style="position: absolute; top: 40%; left:40%">
    <el-row style="width: 300px;">
        <el-col :span="24">
            <el-input v-model="password" @focus.capture.native='changePasswordTip(true)' @blur.capture.native='changePasswordTip(false)' auto-complete="new-password" type="password" placeholder='请输入密码' ></el-input>
            <div style="position: absolute">
                <verify-pass-word-tip :password="password" :isShowTip = 'isShowTip'></verify-pass-word-tip>
            </div>
        </el-col>
    </el-row>
</div>
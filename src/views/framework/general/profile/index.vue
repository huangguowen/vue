<template>
<div>
    <a-card
    :width="1"
    >
    <a-form :form="form" @submit="handleSubmit">
        <a-form-item
                label="姓名"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
        >
            <a-input
                    v-decorator="['user_name', { initialValue:row.user_name, rules: [{ required: true, message: '请输入昵称' }] }]"
            />
        </a-form-item>
        <a-form-item
                label="账号"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
        >
            <a-input
                    v-decorator="['user_name', { initialValue:row.login_name, rules: [{ required: true, message: '请输入昵称' }] }]"
            />
        </a-form-item>
        <a-form-item
                :wrapper-col="{ span: 2, offset: 3 }"
        >
            <a-button type="primary" html-type="submit">
                提交
            </a-button>
        </a-form-item>
    </a-form>
    </a-card>
</div>
</template>

<script>
    import { updateProfile,getProfile } from '@/api/framework/user'
    export default {
        data() {
            return {
                labelCol: {
                    xs: { span: 10 },
                    sm: { span: 3 }
                },
                wrapperCol: {
                    xs: { span: 10 },
                    sm: { span: 3 }
                },
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
                visible: true,
                row: {
                    user_name: '',
                },
            };
        },
        mounted(){
            this.getProfile()
        },
        methods: {
            getProfile(){
                getProfile()
                    .then(res => {
                        this.row.user_name = res.data.user_name
                        this.row.login_name = res.data.login_name
                    })
                    .catch(err => this.failed(err))
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        updateProfile(values)
                            .then(res => {
                                this.refresh(res.message)
                            })
                            .catch(err => this.failed(err))
                    }
                });
            },
            refresh(message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })

            },
            failed(errors) {
                this.$notification['error']({
                    message: errors.message,
                    duration: 4
                })
            },
        },
    };
</script>
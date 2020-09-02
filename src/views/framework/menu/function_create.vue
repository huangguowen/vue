<template>
    <a-modal
            :title="title"
            :width="640"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                        label="功能名称"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                <a-input allowClear v-decorator="['function_name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
                </a-form-item>
                <a-form-item
                        label="功能标识"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input allowClear v-decorator="['function_identity',{rules: [{required: true,min: 2, message: '请输入至少2个字符！'}]}]" />
                </a-form-item>
                <a-form-item
                        label="控制器方法"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input allowClear v-decorator="['permission_id',{rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" placeholder="roles@index"/>
                </a-form-item>

                <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="是否启用"
                >
                    <a-radio-group v-decorator="['is_enabled',{initialValue: is_enabled},{rules: [{required: true}]}]">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                        :label-col="labelCol"
                        :wrapper-col="wrapperCol"
                        label="组件名称"
                >
                    <a-select allowClear placeholder="选择组件"
                              v-decorator="['component_name', {initialValue:component_name}, {rules: [{required: true}]}]">
                        <a-select-opt-group v-for="(item, key) in components" :key="key" :label="key">
                            <a-select-option v-for="(v, k) in item" :key="k" :value="v">{{ v }}</a-select-option>
                        </a-select-opt-group>
                    </a-select>
                </a-form-item>
                <a-form-item  label="排序"
                              :labelCol="labelCol"
                              :wrapperCol="wrapperCol">
                    <a-input-number allowClear v-decorator="['sort_number',{initialValue:sort_number}]" ></a-input-number>

                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import {components} from '@/enums/data/components'
    import AFormItem from "ant-design-vue/es/form/FormItem"
    import {functionAdd,functionUpdate} from '@/api/framework/menu'

    export default {
        name:'action_create',
        components: {AFormItem},
        data () {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 13 }
                },
                visible: false,
                confirmLoading: false,
                menu_function_id: null,
                form: this.$form.createForm(this),
                required: true,
                title: '新建操作',
                sort_number: 1,
                is_enabled: 1,
                components: components,
                component_name:'',
                menu_info:[]
            }
        },
        methods: {
            addAction () {
                this.title ='新建操作'
                this.menu_function_id =''
                this.visible = true
                this.menu_info = this.$parent.$parent.$parent.$parent.$parent.$parent.menu_info
                this.form.resetFields()

            },
            editAction (record) {
                this.visible = true
                this.required = false
                this.menu_function_id = record.menu_function_id
                this.title = '编辑岗位'
                this.sort_number = record.sort_number
                const { form: { setFieldsValue } } = this
                this.$nextTick(() => {
                    setFieldsValue(pick(record, ['function_name','permission_id', 'function_identity', 'is_enabled','sort_number', 'component_name']))
                })
            },
            handleSubmit () {
                const {form: {validateFields}} = this
                if (this.menu_function_id) {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            if (values.component_name === undefined) {
                                values.component_name = ''
                            }
                            values.is_enabled = this.is_enabled
                            functionUpdate(this.menu_function_id, values).then((res) => {

                                this.refresh(res.message)
                                // refreshMenus()
                            }).catch(err => this.failed(err))
                        }
                    })
                } else {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values['menu_id'] = this.menu_info['menu_id']
                            functionAdd(values).then((res) => {
                                this.refresh(res.message)
                                //refreshMenus()
                            }).catch(err => this.failed(err))
                        }
                    })
                }
            },
            failed (errors) {
                this.$notification['error']({
                    message: errors.message,
                    duration: 4
                })
                this.handleCancel()
            },
            handleCancel () {
                this.id = null
                this.visible = false
                this.required = true
                this.confirmLoading = false
                this.form.resetFields()
                this.sort = 1
                this.status = 1
            },
            refresh (message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                this.handleCancel()
                this.$parent.$parent.$parent.$parent.$parent.$parent.initFunction()
            },
            onChange (value, node, extra) {
                this.roleids = value
            }
        }
    }
</script>

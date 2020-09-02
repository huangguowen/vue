<template>
    <div>
        <a-card
                :title="title"
                :width="740"
                :visible="visible"
                :confirmLoading="confirmLoading"
        >
            <a-spin :spinning="confirmLoading">
                <a-form :form="form">
                    <div style="display: none">
                    </div>
                    <a-form-item
                            label="分类名称"
                            type="text"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                    >
                        <a-input allowClear
                                 v-decorator="['category_name', {rules: [{required: true, min: 2, message: '请输入名称, 至少2个字符！'}],initialValue: dict_category.category_name}]"/>
                    </a-form-item>
                    <a-form-item label="备注" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
                      <a-textarea
                        v-decorator="['remark_info', {initialValue:dict_category.remark_info,rules: [{required: false, min: 1, message: '请输入至少1个字符！'}]}]"
                      />
                    </a-form-item>
                    <a-form-item
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol"
                            label="选项"
                    >
                        <a-row :gutter="0">
                            <a-col :span="8">
                                <a-form-item>
                                    <a-checkbox v-decorator="['is_enabled',{initialValue: dict_category.is_enabled}]"
                                                @change="onChange"
                                                :checked="is_enabled==1?true:false">
                                        是否启用
                                    </a-checkbox>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <div style="text-align: center">
                        <a-button v-if="!show&&hiddenMenu(u_menu)" type="primary" @click="handleSubmit">修改</a-button>
                        <a-button v-if="!show&&hiddenMenu(a_menu)" :style="{ marginLeft: '8px' }" type="primary" @click="addSon">添加子节点
                        </a-button>
                        <a-button v-if="show&&(hiddenMenu(u_menu)||hiddenMenu(a_menu))" :style="{ marginLeft: '8px' }" type="primary" @click="handleSubmit">保存
                        </a-button>
                        <a-button v-if="hiddenMenu(d_menu)" type="primary" :style="{ marginLeft: '8px' }" @click="handleDelete">删除</a-button>
                        <a-button v-if="show" :style="{ marginLeft: '8px' }" type="primary" @click="handleCancel">重置
                        </a-button>
                    </div>
                </a-form>
            </a-spin>
        </a-card>

        <a-modal title="选择图标" v-model="iconVisible">
            <icon-selector zIndex="2000" :width="1200" v-model="currentSelectedIcon" @change="handleIconChange"/>
        </a-modal>
    </div>
</template>

<script>
    import {store as add, update, read} from '@/api/framework/dict'
    import IconSelector from '@/components/IconSelector'
    import {components} from '@/enums/data/components'
    import AFormItem from "ant-design-vue/es/form/FormItem"
    import ACol from "ant-design-vue/es/grid/Col"
    import ARow from "ant-design-vue/es/grid/Row"
    import { mixin } from '@/utils/mixin.js'

    export default {
        mixins: [mixin],
        components: {
            ARow,
            ACol,
            AFormItem,
            IconSelector,
        },
        data() {
            return {
                u_menu: 'menu@update',
                a_menu:'menu@save',
                d_menu:'menu@delete',


                labelCol: {
                    xs: {span: 24},
                    sm: {span: 7}
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 13}
                },
                actionCount: 0,
                is_enabled: 1,
                is_protected: 1,
                menu_name: '',
                permission_mark: '',
                link_page: '',
                small_icon: '',
                dict_category_id: null,
                dict_category_parent_id: 0,
                dict_category: {},
                visible: false,
                title: '添加分类',
                confirmLoading: false,
                form: this.$form.createForm(this),
                currentSelectedIcon: '',
                iconVisible: false,
                components: components,
                hideChildrenInMenu: 2,
                show: true
            }
        },
        methods: {
            initEdit(){
                read(this.dict_category_id).then(res => {
                    this.form =  this.$form.createForm(this)
                    if (res) {
                        this.confirmLoading = false
                        this.dict_category = res.data
                        this.actionCount = this.dict_category.inc_functions
                        this.is_enabled = res.data.is_enabled
                        this.is_protected = res.data.is_protected
                    }

                })
            },
            selectIcon() {
                this.iconVisible = true
            },
            handleIconChange(icon) {
                // this.$message.info(<span>选中图标 <code>{icon}</code></span>)
                this.form.setFieldsValue({
                    small_icon: icon
                })
                this.iconVisible = false
            },
            add() {
                this.visible = true
                this.dict_category_id = null
                this.show = true
                this.title = '添加菜单'
                this.dict_category = {}
                this.form.resetFields()
            },
            edit(record) {
                this.confirmLoading = true
                this.dict_category_id = record.id
                this.visible = true
                this.show = false
                this.title = '编辑菜单'
                    //读取单条详细记录
                this.initEdit()

            },
            addSon() {

                this.visible = true
                this.show = true
                this.title = '新增子菜单 '
                this.dict_category_parent_id = this.dict_category_id
                this.dict_category_id = ''
                this.dict_category = {}
                this.form.resetFields()

            },
            handleDelete() {
                this.$parent.$parent.$parent.handleDel()
            },
            handleSubmit() {
                const {form: {validateFields}} = this;
                if (this.dict_category_id) {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values.is_enabled = this.is_enabled
                            update(this.dict_category_id, values).then((res) => {
                                this.refresh(res.message,'edit')
                            }).catch(err => this.failed(err))
                        }
                    })
                } else {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values['dict_category_parent_id'] = this.dict_category_parent_id
                            values['is_enabled'] = this.is_enabled
                            add(values).then((res) => {
                                this.refresh(res.message)
                            }).catch(err => this.failed(err))
                        }
                    })
                }
            },
            failed(errors) {
                this.$notification['error']({
                    message: errors.message,
                    duration: 4
                })
                this.handleCancel()
            },
            handleCancel() {
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                )
            },
            refresh(message,action) {
                this.confirmLoading = false
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                if(action!='edit'){
                    this.form.resetFields()
                }
                this.$parent.$parent.$parent.handleOk()
            },
            handleOk() {
                this.$refs.table.refresh(true)
            },
            onChange(e) {
                if (e.target.id == 'is_enabled')
                    this.is_enabled = e.target.checked
                if (e.target.id == 'is_expand')
                    this.is_expand = e.target.checked
                if (e.target.id == 'is_protected')
                    this.is_protected = e.target.checked
            }
        }
    }
</script>

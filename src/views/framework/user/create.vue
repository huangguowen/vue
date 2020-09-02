<template>
    <a-modal
            :title="title"
            :width="650"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-row>
                    <a-col :span="14">
                        <a-row>
                            <a-form-item
                                    label="姓名"
                                    type="text"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                            >
                                <a-input allowClear
                                         v-decorator="['user_name', {rules: [{required: true, min: 3, message: '请输入至少3个字符'}]}]"/>

                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item
                                    label="账户"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                            >
                                <a-input allowClear
                                         v-decorator="['login_name', {rules: [{ required: true , message: '请输入账户名'}]}]"/>
                            </a-form-item>
                        </a-row>
                        <a-row>
                            <a-form-item
                                    v-if="is_edit"
                                    label="密码"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                            >
                                <a-input allowClear allotype="password"
                                         v-decorator="['password', {rules: [{required: password_required, min: 5, message: '请输入密码'},{validator: handlePass}]}]"
                                         @focus.capture.native='changePasswordTip(true)'
                                         @blur.capture.native='changePasswordTip(false)' auto-complete="new-password"
                                         prop="password"/>
                                <div style="position: absolute">
                                    <verify-pass-word-tip :password="password"
                                                          :isShowTip='isShowTip'></verify-pass-word-tip>
                                </div>
                            </a-form-item>
                        </a-row>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item
                                label="角色"
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol"
                        >
                            <a-tree-select
                                    v-decorator="['roles',{rules: [{required: true, message: '请选择角色'}],initialValue: roleids}]"
                                    :style="treeStyle"
                                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                                    :treeData="roles"
                                    multiple
                                    placeholder="请选择角色"
                                    allowClear
                                    treeDefaultExpandAll
                                    @change="onChange"
                            >
                            </a-tree-select>
                        </a-form-item>
                    </a-col>
                </a-row>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import {validEmail} from '@/utils/validate'
    import {store, update, read} from '@/api/framework/user'
    import {getRolesByUserId} from '@/api/framework/role'
    import pick from 'lodash.pick'
    import {refreshMenus} from '@/utils/util'
    import verifyPassWordTip from '../../../utils/vue/verifyPassWordTip'
    import ARow from "ant-design-vue/es/grid/Row";

    export default {
        components: {
            ARow,
            verifyPassWordTip
        },
        data() {
            return {
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 7}
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 13}
                },
                is_edit: false,
                isShowTip: false,
                visible: false,
                confirmLoading: true,
                title: '新建用户',
                id: null,
                form: this.$form.createForm(this),
                roles: [],
                defaultRoles: [],
                roleids: [],
                password_required: true,
                password: '',
                treeStyle:{width: '200px'}
            }
        },
        methods: {
            handlePass(rule, value, callback) {
                this.password = value
                console.log(value)
                //this.password = value
                callback()
            },


            add() {
                this.is_edit = true
                this.init()
                this.title = '新建用户'
                this.treeStyle={'width': '200px'}
            },
            edit(record) {
                this.is_edit = false
                this.password_required = false
                this.title = '编辑用户'
                this.id = record.id
                this.init()
                if (record.department_id) {
                    this.department.has = String(record.department_id)
                }
                const {form: {setFieldsValue}} = this
                this.$nextTick(() => {
                    //编辑新增页面的字段
                    setFieldsValue(pick(record, ['login_name', 'user_name', 'id', 'login_password']))
                    this.treeStyle={'width': '200px', 'overflow-y': 'auto','height': '110px'}
                })
            },
            init() {
                this.visible = true
                this.getRoles()
                if (this.id) {
                    this.getUserRoles(this.id)
                }
            },
            handleEmail(rule, value, callback) {
                if (!validEmail(value)) {
                    callback(new Error('请输入登录账号'))
                }
                callback()
            },
            // 获取角色
            getRoles() {
                this.confirmLoading = true
                getRolesByUserId().then(res => {
                    if (res) {
                        this.confirmLoading = false
                    }
                    this.roles = this.resetRoles(res.data)
                })
            },
            // 获取用户角色
            getUserRoles(id) {
                read(id).then(res => {
                    const roles = res.data.roles
                    roles.map(item => {
                        this.roleids.push(item.role_id)
                    })
                    console.log(this.roleids)
                })
            },
            // 重组树结构
            resetRoles(roles) {
                roles.map(item => {
                    item.value = item.role_id
                    item.title = item.role_name
                    if (item.children) {
                        this.resetRoles(item.children)
                    }
                })
                return roles
            },
            handleSubmit() {
                const {form: {validateFields}} = this
                if (this.id) {
                    validateFields(['user_name', 'login_name', 'roles'], (errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values['roles'] = this.roleids
                            // values['department_id'] = this.department.id
                            update(this.id, values).then((res) => {
                                this.refresh(res.message)
                                refreshMenus()
                            }).catch(err => this.failed(err))
                        }
                    })
                } else {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            store(values).then((res) => {
                                this.refresh(res.message)
                                refreshMenus()
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
                this.confirmLoading = false

            },
            handleCancel() {
                this.id = null
                this.visible = false
                this.required = true
                this.confirmLoading = false
                this.form.resetFields()
                this.roleids = []
                this.roles = []
            },
            refresh(message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                this.handleCancel()
                this.$parent.$parent.handleOk()
            },
            onChange(value, node, extra) {
                this.roleids = value
            },
            onDepartmentSelect(value, node, extra) {
                console.log(node)
                if (node.dataRef.parent_id === 0 || node.dataRef.children && node.dataRef.children.length > 0) {
                    this.$message.error('不允许选择父节点')
                    this.$nextTick(() => {
                        this.form.setFieldsValue({department_id: null})
                    })
                    return false
                } else {
                    this.department.id = value
                }
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

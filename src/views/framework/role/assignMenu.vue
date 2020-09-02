<template>
    <a-modal
            :title="title"
            :width="800"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
            @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                        label="权限"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                    <a-tree style="overflow-y: auto;
    height: 550px;"
                            checkable
                            checkStrictly
                            :tree-data="permissions"
                            @check="onCheck"
                            :checkedKeys="permissionids"
                            :selected-keys="selectedKeys"
                            defaultExpandAll
                    >
                    </a-tree>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { save_assign_menu, get_all_menu_data, get_assigned_menu_data } from '@/api/framework/role'
    import pick from 'lodash.pick'
    import { refreshMenus } from '@/utils/util'

    export default {
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
                title: '新建角色',
                confirmLoading: false,
                id: null,
                parent_id: 0,
                form: this.$form.createForm(this),
                permissions: [],
                permissionids: [],
                types: [],
                show: false,
                dataRange: [
                    { id: 1, text: '全部数据权限' },
                    { id: 2, text: '自定义数据权限' },
                    { id: 3, text: '仅本人数据权限' },
                    { id: 4, text: '本部门数据权限' },
                    { id: 5, text: '部门以及以下数据权限' }
                ],
                range: 1,
                departments: [],
                department_ids: [],
                permissionTreeIds: [], // 树状权限ID
                selectedKeys: []
            }
        },
        methods: {

            edit (record) {
                this.visible = true
                this.title = '编辑权限'
                const { form: { setFieldsValue } } = this
                this.id = record.id
                this.range = record.data_range
                if (this.range === 2) {
                    this.show = true
                }
                this.getRolePermissions(this.id)
                this.getPermissions(record.parent_id > 0 ? { role_id: record.parent_id } : {})
                this.$nextTick(() => {
                    setFieldsValue(pick(record, ['role_name', 'role_identity', 'permissions']))
                })
            },
            // 获取角色权限
            getRolePermissions (id) {
                get_assigned_menu_data(id).then((res) => {
                    const permissionids = res.data.permissionids
                    permissionids.map(item => {
                        this.permissionids.push(item.menu_id)
                    })
                })
            },
            // 获取权限列表
            getPermissions (params) {
                get_all_menu_data(params).then(res => {
                    this.permissions = this.resetPermissions(res.data)
                })
            },
            handleSubmit () {
                const { form: { validateFields } } = this
                if (this.id) {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values['permissions'] = this.permissionids
                            values['type'] = this.types
                            console.log(values['type'])
                            save_assign_menu(this.id, values).then((res) => {
                                this.refresh(res.message)
                                refreshMenus()
                            }).catch(err => this.failed(err))
                        }
                    })
                } else {
                    validateFields((errors, values) => {
                        if (!errors) {
                            this.confirmLoading = true
                            values['permissions'] = this.permissionids
                            if (this.parent_id > 0) {
                                values['parent_id'] = this.parent_id
                            }
                            store(values).then((res) => {
                                this.refresh(res.message)
                                refreshMenus()
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
                this.visible = false
                this.id = null
                this.confirmLoading = false
                this.parent_id = 0
                this.permissionids = []
                this.department_ids = []
                this.show = false
                this.form.resetFields()
            },
            refresh (message) {
                this.$notification['success']({
                    message: message,
                    duration: 4
                })
                this.handleCancel()
                this.$parent.$parent.handleOk()
            },
            // 重组树结构
            resetPermissions (permissions) {
                permissions.map(item => {
                    item.title = item.menu_name
                    item.key = item.menu_id
                    if (item.children) {
                        this.resetPermissions(item.children)
                    }
                })
                return permissions
            },
            // 重组部门结构
            resetDepartments (departments) {
                departments.map(item => {
                    item.value = item.id
                    if (item.children) {
                        this.resetDepartments(item.children)
                    }
                })
                return departments
            },
            onSelect(selectedKeys, info) {
                console.log('onSelect', info);
                this.selectedKeys = selectedKeys;
            },
            onCheck (checkedKeys, info) {
                const data = info.node.dataRef
                let ids = []
                let types = []
                ids.push(data.id)
                types.push(data.type)
                // debugger
                if (data.hasOwnProperty('children')) {
                    this.getAllLeaf(data.children, ids)
                }
                if (info.checked) {
                    if (data.level) {
                        const levelIds = data.level.split('-')
                        for (const item in levelIds) {
                            const id = levelIds[item]
                            ids.push(id)
                        }
                    }
                    this.permissionids = Array.from(new Set(this.permissionids.concat(ids)))
                    this.type = types
                    console.log(this.type)
                    console.log(this.permissionids)
                } else {
                    this.permissionids = this.permissionids.filter(function (v) { return ids.indexOf(v) === -1 })
                    this.type = types
                    console.log(this.type)
                }
            },
            getAllLeaf (data, ids = []) {
                data.forEach(item => {
                    ids.push(item.id)
                    if (item.hasOwnProperty('children')) {
                        this.getAllLeaf(item.children, ids)
                    }
                })
            },
        }
    }
</script>

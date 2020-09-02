<template>
    <a-modal :title="title"
             :width="800"
             :visible="visible"
             @cancel="handleCancel"
             @ok="handleCancel"
    >
        <a-row :gutter="8">
            <a-col :span="24">
                <div class="table-operator">
                    <a-button type="primary"  v-if="hiddenMenu(f_add)" icon="plus" @click="$refs.functionCreateModel.addAction()">新建</a-button>
                    <a-dropdown >
                        <a-menu slot="overlay">
                            <a-menu-item v-if="hiddenMenu(f_delete)" @click="multiDel()"><a-icon type="delete"/>删除</a-menu-item>
                            <!-- lock | unlock -->
                           <!-- <a-menu-item @click="multiAble()"><a-icon type="lock"/>启用/禁用</a-menu-item>-->
                        </a-menu>
                        <a-button style="margin-left: 8px">
                            批量操作 <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                </div>
                <a-table
                        ref="table"
                        rowKey="menu_function_id"
                        :bordered="true"
                        :columns="columns"
                        :data-source="data"
                        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                        showPagination="auto"
                        :loading = "loading"
                >
      <span slot="is_enabled" slot-scope="text,record">
        <template>
          <a-switch
                  checkedChildren="启用"
                  :value="record.menu_function_id"
                  unCheckedChildren="禁用"
                  @change="onSwitchClick"
                  v-if="text === 1"
                  defaultChecked/>
          <a-switch checkedChildren="启用" v-else :value="record.menu_function_id" unCheckedChildren="禁用" @change="onSwitchClick"/>
        </template>
      </span>
                    <span slot="action" slot-scope="text, record">
        <template>
          <a  v-if="hiddenMenu(f_update)" @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a  v-if="hiddenMenu(f_delete)" @click="handleDel(record)">删除</a>
        </template>
      </span>
                </a-table>
            </a-col>
        </a-row>
        <function-create ref="functionCreateModel" @click="initFunction()"></function-create>
    </a-modal>
</template>

<script>
    import { STable } from '@/components'
    import FunctionCreate from './function_create'
    import {functionDel, getFunctionList,switchFunction} from '@/api/framework/menu'
    import { mixin } from '@/utils/mixin.js'

    export default {
        name: 'action',
        mixins: [mixin],
        components: {
            STable,
            FunctionCreate
        },
        data () {
            return {
                f_add:'menu@functionAdd',
                f_update:'menu@functionUpdate',
                f_delete:'menu@functionDel',
                // 查询参数
                queryParam: {
                    id:''
                },
                // 表头
                columns: [
                    {
                        title: '功能名称',
                        dataIndex: 'function_name'
                    },
                    {
                        title: '启用状态',
                        dataIndex: 'is_enabled',
                        scopedSlots: { customRender: 'is_enabled' }
                    },
                    {
                        title: '功能标识',
                        dataIndex: 'function_identity'

                    },
                    {
                        title: '控制器方法',
                        dataIndex: 'permission_id'

                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '150px',
                        scopedSlots: { customRender: 'action' }
                    }
                ],
                title: '操作列表',
                menu_info :[],
                total :0,
                loading:false,
                data :[],

                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return getFunctionList(Object.assign(parameter, this.queryParam))
                        .then(res => {
                            if(res){
                                this.loading = false
                            }
                            this.total = res.count
                            this.data = res.data
                            return res
                        })
                },
                selectedRowKeys: [],
                visible: false

            }
        },
        methods: {
            initFunction(){
                getFunctionList(this.queryParam)
                    .then(res => {
                        if(res){
                            this.loading = false
                        }
                        this.total = res.count
                        this.data = res.data
                    })
            },
            list(){
                this.loading = true
                this.title = '操作列表'
                this.visible = true
                this.menu_info = this.$parent.$parent.menu_record
                this.queryParam.id = this.menu_info.menu_id
                this.initFunction()

            },
            handleCancel(){
                this.visible = false
                this.$parent.$parent.actionCount =this.total

            },
            handle(){
                this.visible = false
                this.$parent.$parent.actionCount =this.total
            },
            handleEdit (record) {
                console.log(record)
                this.$refs.functionCreateModel.editAction(record)
            },
            handleDel (record) {
                this.$confirm({
                    title: '确定删除' + record.function_name + '吗?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                        functionDel(record.menu_function_id).then((res) => {
                            this.$notification['success']({
                                message: res.message,
                                duration: 4
                            })
                            this.initFunction()
                        })
                    },
                    onCancel () {}
                })
            },

            multiDel () {
                if(this.selectedRowKeys.length>0){
                    this.$confirm({
                        title: '确定批量删除吗?',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk: () => {
                            functionDel(this.selectedRowKeys.join(',')).then((res) => {
                                this.$notification['success']({
                                    message: res.message,
                                    duration: 4
                                })
                                this.selectedRowKeys = []
                                this.initFunction()
                            })
                        },
                        onCancel () {}
                    })
                }else{
                    this.$notification['error']({
                        message: '请选择要删除的菜单',
                        duration: 4
                    })
                }

            },
            multiAble () {
                console.log(this.selectedRowKeys)
                this.onSwitchStatus(this.selectedRowKeys.join(','))
            },
            onSwitchStatus (id) {
                switchFunction(id).then((res) => {
                    this.$notification['success']({
                        message: res.message,
                        duration: 4
                    })
                    this.onSelectChange([], [])
                    this.initFunction()
                })
            },
            onSwitchClick (checked, event) {
                let id = event.target.value
                if (!id) {
                    id = event.target.offsetParent.value
                }
                this.onSwitchStatus(id)
            },
            onSelectChange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                console.log(this.selectedRowKeys)

            },
            resetSearchForm () {
                this.queryParam = {}
                this.initFunction()
            }
        }
    }
</script>

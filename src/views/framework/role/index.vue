/*
name:角色设置
user:
date:
*/

<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="4" :sm="24">
            <a-input allowClear v-model="queryParam.role_name" placeholder="请输入角色名称" />
          </a-col>
          <a-col :md="4" :sm="24">
            <a-select
              allowClear
              v-model="queryParam.is_enabled"
              placeholder="请选择状态"
              default-value="0"
            >
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="0">禁用</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" icon="plus" @click="$refs.createPage.add()" v-if="hiddenMenu(r_add)">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :bordered="true"
      :columns="columns"
      :data="loadData"
      :showPagination="true"
      :pageSize="8"
      :showQuickJumper="true"
    >
      <span slot="is_enabled" slot-scope="text,record">
        <template>
          <a-switch
                  checkedChildren="启用"
                  :value="record.id"
                  unCheckedChildren="禁用"
                  @change="onSwitchClick"
                  v-if="record.is_enabled === 1"
                  defaultChecked/>
          <a-switch checkedChildren="启用" v-else :value="record.id" unCheckedChildren="禁用" @change="onSwitchClick"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)" v-if="hiddenMenu(r_update)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDel(record)" v-if="hiddenMenu(r_delete)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAssignMenu(record)" v-if="hiddenMenu(r_permission)">权限</a>
              </a-menu-item>
            </a-menu>
            <a>
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </template>
      </span>
    </s-table>

    <create-page ref="createPage" @ok="handleOk" />
    <assign-menu-page ref="assignMenuPage" @ok="handleOk"/>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import createPage from './create'
import assignMenuPage from './assignMenu'
import { list, del, swtichStatus } from '@/api/framework/role'
import { mixin } from '@/utils/mixin.js'


export default {
  name: 'default',
    mixins: [mixin],
    components: {
    STable,
    createPage,
    assignMenuPage
  },
  data() {
    return {
      // 权限
        r_update: 'role@update',
        r_add: 'role@save',
        r_delete: 'role@delete',
        r_permission: 'role@getAllMenuData',

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色',
          dataIndex: 'role_name',
          sorter: true
        },
        {
          title: '备注',
          dataIndex: 'remark_info'
        },
        {
          title: '状态',
          dataIndex: 'is_enabled',
          scopedSlots: { customRender: 'is_enabled' }
        },
        {
          title: '创建时间',
          dataIndex: 'created',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return list(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    handleEdit(record) {
      this.$refs.createPage.edit(record)
    },
    handleDel(record) {
      this.$confirm({
        title: '确定删除“' + record.role_name + '”吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(record.id)
            .then(res => {
              this.$notification['success']({
                message: res.message,
                duration: 4
              })
              this.handleOk()
            })
            .catch(err => this.failed(err))
        },
        onCancel() {}
      })
    },
    //分配菜单权限
    handleAssignMenu(record) {
      this.$refs.assignMenuPage.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh(true)
    },
    failed(errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      this.handleCancel()
    },
    resetSearchForm() {
      this.queryParam = {}
      this.handleOk()
    },
      onSwitchClick (checked, event) {
          let id = event.target.value
          if (!id) {
              id = event.target.offsetParent.value
          }
          this.onSwitchStatus(id)
      },
      onSwitchStatus (id) {
          swtichStatus(id).then((res) => {
              this.$notification['success']({
                  message: res.message,
                  duration: 4
              })
              this.onSelectChange([], [])
              this.handleOk()
          })
      },
  }
}
</script>










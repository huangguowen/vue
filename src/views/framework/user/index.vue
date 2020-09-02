<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="24">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="20">
              <a-col :md="4" :sm="24">
                <a-input allowClear v-model="queryParam.user_name" placeholder="请输入姓名"/>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-input allowClear v-model="queryParam.login_name" placeholder="请输入账户"/>
              </a-col>
              <a-col :md="4" :sm="24">
                <a-select allowClear v-model="queryParam.is_enabled" placeholder="请选择状态" default-value="0">
                  <a-select-option value="1">启用</a-select-option>
                  <a-select-option value="2">禁用</a-select-option>
                </a-select>
              </a-col>
              <a-col :md="4" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
                   <a-button type="primary" style="margin-left: 8px" icon="plus"  v-if="hiddenMenu(u_add)" @click="$refs.userModal.add()">新建</a-button>

          <!--<a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">-->
          <a-dropdown v-if="hiddenMenu(u_delete)">
            <a-menu slot="overlay">
              <a-menu-item  @click="multiDel()"><a-icon type="delete"/>删除</a-menu-item>
              <!-- lock | unlock -->
              <!--<a-menu-item @click="multiAble()"><a-icon type="lock"/>启用/禁用</a-menu-item>-->
            </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
          </a-dropdown>

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
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      showPagination="auto"
      :pageSize=5
      :show-total="total => `Total 1 items`"
      >
      <span slot="status" slot-scope="text,record">
        <template>
          <a-switch
            checkedChildren="启用"
            :value="record.id"
            unCheckedChildren="禁用"
            @change="onSwitchClick"
            v-if="text === 1"
            defaultChecked/>
          <a-switch checkedChildren="启用" v-else :value="record.id" unCheckedChildren="禁用" @change="onSwitchClick"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)" v-if="hiddenMenu(u_update)" >编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)" v-if="hiddenMenu(u_delete)">删除</a>
          <a-divider type="vertical" />
          <a @click="handleReset(record)" v-if="hiddenMenu(u_updatePassword)">重置密码</a>
        </template>
      </span>
    </s-table>
    </a-col>
    </a-row>
    <create-user ref="userModal" @ok="handleOk" />
    <reset-password ref="ResetPassword" @ok="handleOk" />
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import CreateUser from './create'
import ResetPassword from './resetPassword'
import { swtichStatus, del, getUserList } from '@/api/framework/user'
import { expandKeys } from '@/utils/util'
import { mixin } from '@/utils/mixin.js'

export default {
  name: 'Users',
  mixins: [mixin],
  components: {
    STable,
    STree,
    CreateUser,
    ResetPassword,
  },
  data () {
    return {
      // 权限
      u_add:"user@save",
      u_update:"user@edit",
      u_delete:"user@delete",
      u_updatePassword:"user@updatePassword",
      // 查询参数
      queryParam: {},
      expandedKeys: ["item_0"],
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'user_name'
        },
        {
          title: '账户',
          dataIndex: 'login_name'
        },
        {
          title: '状态',
          dataIndex: 'is_enabled',
          scopedSlots: { customRender: 'status' }
          // customRender: this.renderStatus
        },
        {
          title: '创建时间',
          dataIndex: 'created',
            sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      selectedRowKeys: [],
      delete_userId: [],
      orgTree: []
    }
  },
  methods: {
    handleEdit (record) {
      this.$refs.userModal.edit(record)
    },
    handleDel (record) {
      this.$confirm({
        title: '确定删除' + record.user_name + '吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          del(record.id).then((res) => {
            this.$notification['success']({
              message: res.message,
              duration: 4
            })
            this.handleOk()
          })
        },
        onCancel () {}
      })
    },
      handleReset (record) {
          this.$refs.ResetPassword.reset(record.id)
      },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    multiDel () {
      this.$confirm({
        title: '确定批量删除吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
            if (this.selectedRowKeys.length != 0) {
                del(this.selectedRowKeys.join(',')).then((res) => {
                    this.$notification['success']({
                        message: res.message,
                        duration: 4
                    })
                    this.selectedRowKeys = []
                    this.handleOk()
                })
            } else {
                alert('请选择数据再进行操作')
            }

        },
        onCancel () {}
      })
    },
    multiAble () {
      this.onSwitchStatus(this.selectedRowKeys.join(','))
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
    onSwitchClick (checked, event) {
      let id = event.target.value
      if (!id) {
        id = event.target.offsetParent.value
      }
      this.onSwitchStatus(id)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
        // selectedRows[selectedRowKeys]['user_id'] = this.delete_userId.split(',');
        this.selectedRowKeys = selectedRowKeys
    },
    resetSearchForm () {
      this.queryParam = {}
      this.handleOk()
    },
    handleClick (e) {
      this.$refs.table.refresh(true, this.queryParam)
    }
  }
}
</script>

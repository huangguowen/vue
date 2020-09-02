/* 
name:设置
user:
date:
*/

<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="4" :sm="24" style="width: 220px;">
            <a-input allowClear v-model="queryParam.unit_name" placeholder="名称/单位代码" />
          </a-col>
          <a-col :md="3" :sm="24" style="width: 100px;">
            <a-select
              allowClear
              v-model="queryParam.is_enabled"
              placeholder="状态"
              default-value="0"
              
            >
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="0">未开始</a-select-option>
              <a-select-option value="4">已结束</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="3" :sm="24" style="width: 120px;">
            <a-select placeholder="单位类型" allowClear v-model="queryParam.unit_type">
              <a-select-option v-for="i in this.type_options" :key="i.id">{{ i.text }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="5" :sm="24"  >
            <a-range-picker @change="onChange" :value='date'/>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" icon="plus" @click="$refs.createPage.add()">新建</a-button>
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
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDel(record)">删除</a>
          <!-- <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDel(record)">删除</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleAssignMenu(record)">权限</a>
              </a-menu-item>
            </a-menu>
            <a>
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown> -->
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
import { list, del } from '@/api/framework/unit'

export default {
  name: 'default',
  components: {
    STable,
    createPage,
    assignMenuPage
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      date:[],
      type_options: [
        { id: 0, text: '类型一' },
        { id: 1, text: '类型二' },
        { id: 2, text: '类型三' }
      ],
      // 表头
      columns: [
        {
          title: '单位代码',
          dataIndex: 'unit_code',
          width:'160px',
        },
        {
          title: '名称',
          dataIndex: 'unit_name',
        },
        {
          title: '状态',
          dataIndex: 'unit_status_text',
          width:'100px',
          align:'center'
        },
        {
          title: '创建时间',
          dataIndex: 'created',
          sorter: true,
          width:'160px',
          align:'center'
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
        title: '确定删除“' + record.unit_name + '”吗?',
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
    // //分配菜单权限
    // handleAssignMenu(record) {
    //   this.$refs.assignMenuPage.edit(record)
    // },
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
      this.date = [];
      this.handleOk()
    },
    onChange(date, dateString) {
      if(dateString[0]  &&  dateString[1]){
        this.queryParam.unit_time = dateString.join(' - ');
        this.date = date;
      }else{
        this.queryParam.unit_time = '';
        this.date = [];
      }
    }
  }
}
</script>










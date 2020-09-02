<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="4" :sm="24" style="width: 220px;">
            <a-input allowClear v-model="queryParam.keyword" placeholder="字典名称/所属分类" />
          </a-col>
          <a-col :md="5" :sm="24" style="width: 200px">
            <a-tree-select :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" placeholder="所属分类"
              @change='onChangeSelect' :value='value'>
              <span slot="title" slot-scope="{ key, value }" style="color: #08c">
                {{ value }}
              </span>
            </a-tree-select>
          </a-col>
          <a-col :md="3" :sm="24" style="width: 100px;">
            <a-select allowClear v-model="queryParam.is_enabled" placeholder="状态" default-value="0">
              <a-select-option value="0">禁用</a-select-option>
              <a-select-option value="1">正常</a-select-option>
            </a-select>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-range-picker @change="onChange" v-model="date" />
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" icon="plus" @click="$refs.createPage.add(treeData)">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" size="default" rowKey="dict_name_id" :bordered="true" :columns="columns" :data="loadData"
      :showPagination="true" :pageSize="8" :showQuickJumper="true">
      <span slot="sort_number" slot-scope="text, record">
        <template>
          <a-input placeholder="排序" type='number' v-model="record.sort_number" @blur="onBlur(text,record)" />
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1"> <a @click="handleEdit(record)">
                  <a-icon type="edit" /> 编辑</a> </a-menu-item>
              <a-menu-item key="2"> <a @click="handleDel(record)">
                  <a-icon type="delete" /> 删除</a></a-menu-item>
              <a-menu-item key="3"> <a @click="handleList(record)">
                  <a-icon type="table" /> 字典数据</a> </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>

        </template>
      </span>
      <span slot="status" slot-scope="text,record">
        <template>
          <a-switch checkedChildren="启用" :value="record.dict_name_id" unCheckedChildren="禁用" @change="onSwitchClick"
            v-if="text == 1" checked />
          <a-switch checkedChildren="启用" v-else :value="record.dict_name_id" unCheckedChildren="禁用" @change="onSwitchClick" />
        </template>
      </span>
    </s-table>
    <create-page ref="createPage" @ok="handleOk" />
    <list-page ref="listPage" @ok="handleOk" />
  </a-card>
</template>

<script>
  import {
    STable
  } from '@/components'
  import createPage from './add'
  import listPage from './dlist'
  import {
    list,
    del,
    swtichStatus,
    getCategory,
    listSort
  } from '@/api/framework/dictlist'

  export default {
    name: 'default',
    components: {
      STable,
      createPage,
      listPage
    },
    data() {
      return {
        // 查询参数
        queryParam: {},
        date: [],
        // 表头
        columns: [{
            title: '名称',
            dataIndex: 'dict_naming',
          },
          {
            title: '所属分类',
            dataIndex: 'category_name',
            width: '160px',
          },
          {
            title: '说明',
            dataIndex: 'dict_explain'
          },
          {
            title: '状态',
            dataIndex: 'is_enabled',
            scopedSlots: {
              customRender: 'status'
            },
            width: '100px',
            align: 'center',
          },

          {
            title: '创建时间',
            dataIndex: 'created',
            sorter: true,
            width: '160px',
            align: 'center',
          },
          {
            title: '最后修改时间',
            dataIndex: 'modified',
            sorter: true,
            width: '160px',
            align: 'center',
          },
          {
            title: '排序',
            dataIndex: 'sort_number',
            width: '100px',
            scopedSlots: {
              customRender: 'sort_number'
            },
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '100px',
            scopedSlots: {
              customRender: 'action'
            },
            align: 'center',
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return list(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },
        value: undefined,
        treeData: []
      }
    },
    mounted: function() {
      this.getCategory();
    },
    methods: {
      handleEdit(record) {
        this.$refs.createPage.edit(record, this.treeData)
      },
      handleList(record) {
        this.$refs.listPage.listPage(record);
      },
      edit(record, treeData) {
        this.row = {}
        this.spinning = true
        this.visible = true
        this.title = '编辑'
        this.treeData = treeData;
        const {
          form: {
            setFieldsValue
          }
        } = this
        this.id = record.dict_name_id
        //读取单条详细记录
        read(this.id).then(res => {
          if (res) {
            this.spinning = false;
          }
          this.row = res.data;
          this.value = res.data.dict_category_id;
        })
      },

      handleDel(record) {
        this.$confirm({
          title: '确定删除“' + record.dict_naming + '”吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            del(record.dict_name_id)
              .then(res => {
                this.$notification['success']({
                  message: res.message,
                  duration: 4
                })
                this.handleOk()
              })

          },
          onCancel() {}
        })
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
        this.value = undefined;
        this.date = [];
        this.handleOk()
      },
      //获取分类数据
      getCategory() {
        getCategory().then(res => {
          this.treeData = res.data;
        });
      },
      onChangeSelect(value, label, extra) {
        this.value = value;
        this.queryParam.cat_id = value;
      },
      onChange(date, dateString) {
        if (dateString[0] && dateString[1]) {
          this.queryParam.time = dateString.join(' - ');
          this.date = date;
        } else {
          this.queryParam.time = '';
          this.date = [];
        }
      },
      onSwitchStatus(id) {
        swtichStatus(id).then((res) => {
          this.$notification['success']({
            message: res.message,
            duration: 4
          })
          this.handleOk()
        })
      },
      onSwitchClick(checked, event) {
        let id = event.target.value
        if (!id) {
          id = event.target.offsetParent.value
        }
        this.onSwitchStatus(id)
      },
      onBlur(value, record) {
        listSort({
          id: record.dict_name_id,
          value: value
        }).then((res) => {
          this.handleOk()
        });
      }
    }
  }
</script>

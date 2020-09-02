<template>
  <a-modal :title="title" :width="1000" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel" footer="">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="4" :sm="24" style="width: 420px;"><a-input allowClear v-model="queryParam.keyword" placeholder="数据代码/数据文本/外部代码/外部名称/简短文本" /></a-col>
          <a-col :md="5" :sm="24" style="width: 220px;">
            <a-range-picker @change="onChangeDate" v-model="date" />
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <!-- <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button> -->
              <a-button icon="search" type="primary" @click="getTableData()">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
              <a-button type="primary" style="margin-left: 8px" icon="plus" @click="openAdd()">新建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table :columns="columns" ref="table" :loading="loading" :data-source="tableData" :pagination="pagination" rowKey="dict_data_id" @change="handleTableChange">
      <a slot="operation" slot-scope="text, record">
        <template>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="1">
                <a @click="handleEdit(record)">
                  <a-icon type="edit" />
                  编辑
                </a>
              </a-menu-item>
              <a-menu-item key="2" v-if="!record.is_protected">
                <a @click="handleDel(record)">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-menu-item>

              <a-menu-item key="3" v-if="!record.is_end && record.data_level < 3">
                <a @click="handleSub(record)">
                  <a-icon type="plus" />
                  添加下级
                </a>
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </template>
      </a>
      -->
    </a-table>
    <!-- <s-table :columns="columns" :data="loadData" ref='table' class="components-table-demo-nested" rowKey='dict_data_id' @expande='handldOnExpand'>
      <a slot="operation" slot-scope="text,record">
        <template>
          <a-dropdown>
            <a-menu slot="overlay">

              <a-menu-item key="1"> <a @click="handleEdit(record)">
                  <a-icon type="edit" /> 编辑</a> </a-menu-item>
              <a-menu-item key="2" v-if="!record.is_end"> <a @click="handleDel(record)">
                  <a-icon type="delete" /> 删除</a></a-menu-item>

              <a-menu-item key="3"> <a @click="handleSub(record)">
                  <a-icon type="edit" /> 添加下级</a> </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </template>
      </a> -->
    <!-- <a slot-scope="text,record">
        <a-table rowKey='dict_data_id' slot="expandedRowRender" slot-scope="text" :columns="columns" :data-source="record.children"
          :showPagination="false">
          <span slot="status" slot-scope="text">
            <a-badge status="success" />Finished </span>
          <span slot="operation" slot-scope="text" class="table-operation">
            <a>Pause</a>
            <a>Stop</a>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  Action 1
                </a-menu-item>
                <a-menu-item>
                  Action 2
                </a-menu-item>
              </a-menu>
              <a> More
                <a-icon type="down" /> </a>
            </a-dropdown>
          </span>
        </a-table>
      </a>
      -->
    <!-- </s-table> -->
    <!-- <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" @expand="handldOnExpand"
      :bordered='false'>
      <a slot="operation" slot-scope="text">Publish</a>
      <a-table slot="expandedRowRender" slot-scope="text" :columns="innerColumns" :data-source="innerData" :pagination="false">
        <span slot="status" slot-scope="text">
          <a-badge status="success" />Finished </span>
        <span slot="operation" slot-scope="text" class="table-operation">
          <a>Pause</a>
          <a>Stop</a>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item>
                Action 1
              </a-menu-item>
              <a-menu-item>
                Action 2
              </a-menu-item>
            </a-menu>
            <a> More
              <a-icon type="down" /> </a>
          </a-dropdown>
        </span>
      </a-table>
    </a-table> -->
    <create-page ref="createPage" @ok="handleOk" />
  </a-modal>
</template>

<script>
    import { STable } from '@/components';
    import createPage from './createData';
    import { axios } from '@/utils/request';
    import { dictDataIndex, dictDataRead, dictDataDel } from '@/api/framework/dictlist';
    const columns = [
        {
            title: '数据代码',
            dataIndex: 'data_code',
            key: 'data_code'
        },
        {
            title: '数据文本',
            dataIndex: 'data_text',
            key: 'data_text'
        },
        {
            title: '外部代码',
            dataIndex: 'outer_code',
            key: 'outer_code'
        },
        {
            title: '外部名称',
            dataIndex: 'outer_name',
            key: 'outer_name'
        },
        {
            title: '简短文本',
            dataIndex: 'short_text',
            key: 'short_text'
        },
        {
            title: '创建时间',
            dataIndex: 'created',
            key: 'created',
            align: 'center'
        },
        {
            title: '操作',
            key: 'operation',
            scopedSlots: {
                customRender: 'operation'
            }
        }
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i,
            name: 'Screem',
            platform: 'iOS',
            version: '10.3.4.5654',
            upgradeNum: 500,
            creator: 'Jack',
            createdAt: '2014-12-24 23:12:00'
        });
    }

    const innerColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Status',
            key: 'state',
            scopedSlots: {
                customRender: 'status'
            }
        },
        {
            title: 'Upgrade Status',
            dataIndex: 'upgradeNum',
            key: 'upgradeNum'
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            scopedSlots: {
                customRender: 'operation'
            }
        }
    ];

    const innerData = [];
    for (let i = 0; i < 3; ++i) {
        innerData.push({
            key: i,
            date: '2014-12-24 23:12:00',
            name: 'This is production name',
            upgradeNum: 'Upgraded: 56'
        });
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        }
    };
    export default {
        name: 'default',
        components: {
            STable,
            createPage
        },
        data() {
            return {
                queryParam: {},
                data: data,
                date: [],
                columns: columns,
                innerColumns: innerColumns,
                innerData: innerData,
                rowSelection: rowSelection,
                visible: false,
                confirmLoading: false,
                title: '',
                dict_name_id: '',
                tableData: [],
                loading: true,
                page: 1,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 8,//每页中显示10条数据
                    showSizeChanger: true,
                    pageSizeOptions: [ "8","20", "50", "100", "500", "1000", "2000"],//每页中显示的数据
                    showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                },

                loadData: parameter => {
                    return dictDataIndex(Object.assign(parameter, this.queryParam)).then(res => {
                        this.tableData = res.data;
                        return res;
                    });
                }
            };
        },

        methods: {
            getTableData() {
                this.loading = true;
                dictDataIndex(Object.assign({page:this.pagination.page,limit:this.pagination.pageSize},this.queryParam)).then(res => {
                    const pagination = { ...this.pagination };
                    pagination.total = res.count;
                    this.pagination = pagination;
                    this.tableData = res.data;
                    this.loading = false;
                });
            },
            handleTableChange(pagination) {
                this.pagination.current = pagination.current;
                this.pagination.pageSize = pagination.pageSize;
                this.pagination.page = pagination.current;
                this.getTableData();
            },
            listPage(data) {
                this.visible = true;
                this.title = '字典数据';
                this.queryParam.dict_name_id = data.dict_name_id;
                this.dict_name_id = data.dict_name_id;
                this.getTableData();
            },
            handleCancel() {
                this.visible = false;
                this.confirmLoading = false;
            },
            handleDel(record) {
                this.$confirm({
                    title: '您s确定删除吗?',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => {
                        dictDataDel(record.dict_data_id)
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
            handldOnExpand(expanded, record) {
                console.log(1111);
            },
            handleOk() {
                this.getTableData();
            },
            handleEdit(record) {
                this.$refs.createPage.edit(record,this);
            },
            openAdd(){
                this.$refs.createPage.add({ dict_name_id: this.dict_name_id },this)
            },
            handleSub(record) {
                this.$refs.createPage.add({ dict_name_id: record.dict_name_id, dict_data_parent_id: record.dict_data_id },this);
            },
            edit(record) {
                this.row = {};
                this.visible = true;
                this.title = '编辑';
                const {
                    form: { setFieldsValue }
                } = this;
                this.id = record.dict_name_id;
                //读取单条详细记录
                dictDataRead(this.id).then(res => {
                    this.row = res.data;
                });
            },
            resetSearchForm() {
                this.date = [];
                this.queryParam = {};
                this.handleOk();
            },
            onChangeDate(date, dateString) {
                if (dateString[0] && dateString[1]) {
                    this.queryParam.time = dateString.join(' - ');
                    this.date = date;
                } else {
                    this.queryParam.time = '';
                    this.date = [];
                }
            },
        }
    };
</script>

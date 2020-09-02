<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="4" :sm="24">
                        <a-select allowClear v-model="queryParam.category_identity" placeholder="请选择分类"
                                  default-value="0">
                            <a-select-option v-for="d in category" :key="d.system_log_category_id">
                                {{ d.category_name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="4" :sm="24">
                        <a-input v-model="queryParam.log_type" placeholder="请输入日志类型"></a-input>
                    </a-col>
                    <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <s-table
                ref="table"
                size="default"
                rowKey="system_log_data_id"
                :bordered="true"
                :columns="columns"
                :data="loadData"
                showPagination="auto"
        >

            <span slot="log_detail" slot-scope="text, record">
                <a-tooltip placement="top">
                    <template slot="title">
                        <span>{{ record.log_detail }}</span>
                    </template>
                    <a-button size="small" type="primary">查看</a-button>
                </a-tooltip>
            </span>
        </s-table>
    </a-card>
</template>

<script>
    import {STable} from '@/components'
    import {operateLogList, emptyOperateLog,getCategoryList} from '@/api/log'
    import {timestampToDate} from '@/utils/date'
    import ACol from "ant-design-vue/es/grid/Col";

    export default {
        name: 'Database',
        components: {
            ACol,
            STable
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '操作人',
                        dataIndex: 'user_name'
                    },
                    {
                        title: '日志分类',
                        dataIndex: 'category_identity'
                    },
                    {
                        title: '日志类型',
                        dataIndex: 'log_type'
                    },
                    {
                        title: '日志标题',
                        dataIndex: 'log_title'
                    },
                    {
                        title: '日志IP',
                        dataIndex: 'log_ip'
                    },
                    {
                        title: '参数',
                        dataIndex: 'log_detail',
                        scopedSlots: {customRender: 'log_detail'}
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'log_datetime',
                        scopedSlots: {customRender: 'created_at'},
                        sorter: true
                    },
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return operateLogList(Object.assign(parameter, this.queryParam))
                        .then(res => {
                            return res
                        })
                },
                selectTables: [],
                category: []
            }
        },
        created () {
            getCategoryList().then(res=>{
                this.category = res.data;
            })
        },
        methods: {
            handleOk() {
                this.$refs.table.refresh(true)
            },
            resetSearchForm () {
                this.queryParam = {}
                this.handleOk()
            },
        }
    }
</script>

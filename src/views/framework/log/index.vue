<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-row :gutter="8">
                <a-col span="24">
            <a-form layout="inline">
                    <a-col :md="3" :sm="24">
                        <a-select allowClear v-model="queryParam.category_identity" placeholder="请选择分类"
                                  default-value="0">
                            <a-select-option v-for="d in category" :key="d.category_name">
                                {{ d.category_name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="3" :sm="24">
                        <a-input placeholder="请输入操作人" v-model="queryParam.user_name"/>
                    </a-col>
                    <a-col :md="3" :sm="24">
                        <a-input placeholder="请输入标题" v-model="queryParam.log_title"/>
                    </a-col>
                    <a-col :md="3" :sm="24">
                        <a-select allowClear v-model="queryParam.log_type" placeholder="请选择类型"
                                  default-value="0">
                            <a-select-option v-for="type in log_type" :key="type.value">
                                {{ type.title }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                <a-col :md="4" :sm="24">
                    <a-date-picker placeholder="请选择开始日期" v-model="queryParam.start_time" style="width: 100%;"/>
                </a-col>
                <a-col :md="4" :sm="24">
                    <a-date-picker placeholder="请选择结束日期" v-model="queryParam.end_time" style="width: 100%;"/>
                </a-col>
                    <a-col :md="4" :sm="24">
                        <span class="table-page-search-submitButtons">
                          <a-button icon="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                          <a-button icon="sync" style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
                        </span>
                    </a-col>

            </a-form>
                </a-col>
            </a-row>
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
            <span slot="action" slot-scope="text, record">
                <a-tooltip placement="top">
                    <a-button  v-if="hiddenMenu(l_detail)" size="small" type="primary" @click="handleDetail(record)">查看详情</a-button>
                </a-tooltip>
            </span>
        </s-table>
        <detail ref="detailModal" @ok="handleOk"></detail>
    </a-card>
</template>

<script>
    import {STable} from '@/components'
    import {operateLogList, emptyOperateLog,getCategoryList} from '@/api/framework/log'
    import {timestampToDate} from '@/utils/date'
    import ACol from "ant-design-vue/es/grid/Col"
    import Detail from "./detail"
    import { mixin } from '@/utils/mixin.js'

    export default {
        name: 'Database',
        mixins: [mixin],
        components: {
            ACol,
            STable,
            Detail
        },
        data() {
            return {
                l_detail:'log@read',
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
                        title: '操作时间',
                        dataIndex: 'log_datetime',
                        scopedSlots: {customRender: 'created_at'},
                        sorter: true
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '80px',
                        scopedSlots: { customRender: 'action' }
                    }
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return operateLogList(Object.assign(parameter, this.queryParam))
                        .then(res => {
                            return res
                        })
                },
                selectTables: [],
                category: [],
                log_type:[{ title:'info',value:'info'}],

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
                console.log(this.queryParam)
                this.queryParam = {}
                this.handleOk()
            },
            handleDetail(record){
                this.$refs.detailModal.view(record)
            }

        }
    }
</script>

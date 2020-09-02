<template>
    <a-modal
            :title="title"
            :width="650"
            :visible="visible"
            :confirmLoading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form>

                <a-form-item
                        label="日志日期"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.log_datetime" read-only />
                </a-form-item>
                <a-form-item
                        label="	日志标题"
                        type="text"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.log_title" read-only/>
                </a-form-item>
                <a-form-item
                        label="日志详细"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-textarea v-model="data.log_detail" read-only ></a-textarea>
                </a-form-item>
                <a-form-item
                        label="操作用户"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.user_name" read-only />
                </a-form-item>
                <a-form-item
                        label="日志IP"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.log_ip" read-only />
                </a-form-item>

                <a-form-item
                        label="服务器节点"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.server_node" read-only />
                </a-form-item>
                <a-form-item
                        label="	终端名称"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.terminal_name" read-only />
                </a-form-item>
                <a-form-item
                        label="	模块名称"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.module_name" read-only/>
                </a-form-item>
                <a-form-item
                        label="业务名称"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                >
                    <a-input v-model="data.biz_name" read-only/>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import {read} from '@/api/framework/log'
    import {timestampToDate} from '@/utils/date'
    import ACol from "ant-design-vue/es/grid/Col";
    import ARow from "ant-design-vue/es/grid/Row";
    import ATextarea from "ant-design-vue/es/input/TextArea";

    export default {
        name: 'Database',
        components: {
            ATextarea,
            ARow,
            ACol

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
                data: {},
                visible: false,
                confirmLoading: false,
                title: '日志详情'

            }
        },
        created() {
        },
        methods: {
            view(record) {
                this.visible = true
                this.confirmLoading = true
                read(record.system_log_data_id).then(res => {
                    this.data = res.data[0]
                    this.confirmLoading = false

                })

            },
            handleCancel () {
                this.visible = false
                this.confirmLoading = false
            },
            handleOk () {
                this.visible = false
                this.confirmLoading = false
            },
        }
    }
</script>

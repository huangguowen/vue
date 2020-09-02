/*
name:添加修改单位页面
user:
date:
*/

<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item label="单位名称" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['unit_name', {initialValue:row.unit_name,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
          />
        </a-form-item>

        <a-form-item label="单位代码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['unit_code', {initialValue:row.unit_code,rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
          />
        </a-form-item>

        <a-form-item label="手机号码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile_number', {initialValue:row.mobile_number,rules: [{pattern:/^1(3|4|5|6|7|8|9)\d{9}$/,message:'请正确收入手机号！'}]}]"
          />
        </a-form-item>

        <a-form-item label="邮箱地址" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['email_address', {initialValue:row.email_address,rules: [{required: true, message: '请输入邮箱地址！'},{pattern:/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,message:'邮箱格式不正确！'}]}]"
          />
        </a-form-item>
        
        <a-form-item label="开始日期" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker value-format="YYYY MM DD"
            v-decorator="['begin_datetime', {initialValue:row.begin_datetime,rules: [{required: true, message: '请选择开始日期！'}]}]"
          />
        </a-form-item>

        <a-form-item label="结束日期" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            v-decorator="['end_datetime', {initialValue:row.end_datetime,rules: [{required: true, message: '请选择结束日期！'}]}]"
          />
        </a-form-item>

        <a-form-item
          label="单位类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select placeholder="请选择单位类型" checkStrictly v-decorator="['unit_type', {initialValue: row.unit_type,rules: [{required: true, message: '请选择类型！'}]}]">
            <a-select-option v-for="i in this.type_options" :key="i.id">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select placeholder="请选择状态" checkStrictly v-decorator="['unit_status', {initialValue: row.unit_status,rules: [{required: true, message: '请选择状态！'}]}]">
            <a-select-option v-for="i in this.status_options" :key="i.id">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { store, update, read } from '@/api/framework/unit'
import pick from 'lodash.pick'
import moment from 'moment';
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      spinning: false,
      visible: false,
      title: '新建单位',
      confirmLoading: false,
      id: null,
      form: this.$form.createForm(this),
      row: {
        unit_name: '',
        unit_code: '',
        unit_type: '',
        unit_status: 1,
        mobile_number: '',
        email_address: '',
        begin_datetime: '',
        end_datetime: ''
      },
      show: false,

      status_options: [
        { id: 1, text: '正常' },
        { id: 4, text: '已结束' },
        { id: 0, text: '未开始' }
      ],
      type_options: [
        { id: "0", text: '类型一' },
        { id: "1", text: '类型二' },
        { id: "2", text: '类型三' }
      ]
    }
  },
  methods: {
    add() {
      this.visible = true
      this.title = '新增单位'
      this.row = {}
    },
    edit(record) {
      this.row = {}
      this.spinning = true
      this.visible = true
      this.title = '编辑单位'
      const {
        form: { setFieldsValue }
      } = this
      this.id = record.id
   
      //读取单条详细记录
      read(this.id).then(res => {
        if (res) {
            this.spinning = false;
        }
        this.row.unit_name = res.data.unit_name,
        this.row.unit_code = res.data.unit_code,
        this.row.mobile_number = res.data.mobile_number,
        this.row.email_address = res.data.email_address,
        this.row.begin_datetime = moment(res.data.begin_datetime),
        this.row.end_datetime = moment(res.data.end_datetime),
        this.row.unit_type = res.data.unit_type,
        this.row.unit_status = res.data.unit_status
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      if (this.id) {
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            update(this.id, values)
              .then(res => {
                this.refresh(res.message)
              })
              .catch(err => {
                this.confirmLoading = false;
              })
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            store(values)
              .then(res => {
                this.refresh(res.message)
              })
              .catch(err => {
                this.confirmLoading = false;
              })
          }
        })
      }
    },
    failed(errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      this.confirmLoading = false
    },
    handleCancel() {
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.show = false
      this.form.resetFields()
    },
    refresh(message) {
      this.$notification['success']({
        message: message,
        duration: 4
      })
      this.handleCancel()
      this.$parent.$parent.handleOk()
    }
  }
}
</script>

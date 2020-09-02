/*
name:添加修改角色页面
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
        <a-form-item label="角色名称" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['role_name', {initialValue:row.role_name,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
          />
        </a-form-item>

        <a-form-item label="角色标识" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['role_identity', {initialValue:row.role_identity,rules: [{required: false, min: 1, message: '请输入至少1个字符！'}]}]"
          />
        </a-form-item>

        <a-form-item label="备注" type="textarea" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['remark_info',{initialValue:row.remark_info}]" />
        </a-form-item>

        <a-form-item
          label="是否启用"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          placeholder="请选择"
        >
          <a-select checkStrictly v-decorator="['is_enabled', {initialValue: row.is_enabled,rules: [{required: true, message: '请选择'}]}]">
            <a-select-option v-for="i in this.is_enabled_options" :key="i.id">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="是否受保护"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          placeholder="请选择"
        >
          <a-select checkStrictly v-decorator="['is_protected', {initialValue: row.is_protected,rules: [{required: true, message: '请选择'}]}]">
            <a-select-option v-for="i in this.is_protected_options" :key="i.id">{{ i.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { store, update, read } from '@/api/framework/role'
import pick from 'lodash.pick'
import { mixin } from '@/utils/mixin.js'


export default {
    mixins: [mixin],
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
      title: '新建角色',
      confirmLoading: false,
      id: null,
      form: this.$form.createForm(this),
      row: {
        role_name: '',
        role_identity: '',
        remark_info: '',
        is_enabled: 1,
        is_protected: 0
      },
      show: false,

      is_enabled_options: [
        { id: 1, text: '是' },
        { id: 0, text: '否' }
      ],

      is_protected_options: [
        { id: 1, text: '是' },
        { id: 0, text: '否' }
      ]
    }
  },
  methods: {
    add() {
      this.visible = true
      this.title = '新增角色'
      this.row = {}
    },
    edit(record) {
        this.spinning = true;
        this.visible = true
      this.title = '编辑角色'
      const {
        form: { setFieldsValue }
      } = this
      this.id = record.id
      //读取单条详细记录
      read(this.id).then(res => {
          if (res) {
              this.spinning = false;
          }
        this.row.role_name = res.data.role_name,
        this.row.role_identity = res.data.role_identity,
        this.row.remark_info = res.data.remark_info,
        this.row.is_enabled = res.data.is_enabled,
        this.row.is_protected = res.data.is_protected
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
              this.updateFunction(update, this.id, values)
          }
        })
      } else {
        validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
              this.saveFunction(store, values);
          }
        })
      }
    },
  }
}
</script>

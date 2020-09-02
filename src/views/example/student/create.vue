<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="姓名"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['student_name', {rules: [{required: true, min: 2, message: '请输入至少3个字符！'}]}]" />
        </a-form-item>

        <a-form-item
          label="学号"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input allowClear v-decorator="['student_xuehao']" />
        </a-form-item>

        <a-form-item
          label="手机"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :filterOption="filterOption"
        >
          <a-input allowClear v-decorator="['contact_mobile']" />
        </a-form-item>


        <a-form-item
          label="年级"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :filterOption="filterOption"
        >
          <a-input allowClear v-decorator="['in_grade']" />
        </a-form-item>


        <a-form-item
          label="班级"
          type="text"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :filterOption="filterOption"
        >
          <a-input allowClear v-decorator="['in_class']" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="状态"
        >
          <a-radio-group v-decorator="['attend_status',{initialValue: status},{rules: [{required: true}]}]">
            <a-radio :value="1">在读</a-radio>
            <a-radio :value="2">毕业</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { store, update } from '@/api/example/student'
import pick from 'lodash.pick'

export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      title: '新建学生',
      confirmLoading: false,
      id: null,
      parent_id: 0,
      status: 1,
      form: this.$form.createForm(this),
      sort: 1
    }
  },
  methods: {
    add () {
      this.visible = true
      this.title = '新增学生'
    },
    edit (record) {
      this.visible = true
      this.title = '编辑学生'
      const { form: { setFieldsValue } } = this
      this.id = record.id
      console.log(record)
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['student_name', 'student_xuehao', 'contact_mobile', 'in_grade', 'in_class', 'attend_status']))
      })
    },
   
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        //values['student_name'] = values['title']
        if (!errors) {
          this.confirmLoading = true
          if (this.id) {
            update(this.id, values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          } else {
            if (this.parent_id > 0) {
              values['parent_id'] = this.parent_id
            }
            store(values).then((res) => {
              this.refresh(res.message)
            }).catch(err => this.failed(err))
          }
        }
      })
    },
    failed (errors) {
      this.$notification['error']({
        message: errors.message,
        duration: 4
      })
      //this.handleCancel()
      this.confirmLoading = false
    },

    handleCancel () {
      this.visible = false
      this.id = null
      this.confirmLoading = false
      this.parent_id = 0
      this.status = 1
      this.sort = 1
      this.form.resetFields()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    refresh (message) {
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

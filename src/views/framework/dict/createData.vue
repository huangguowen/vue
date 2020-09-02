<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="addSubmit" @cancel="handleCancel">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item label="数据代码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['data_code', {initialValue:row.data_code,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="数据文本" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['data_text', {initialValue:row.data_text,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="外部代码" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['outer_code', {initialValue:row.outer_code,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="外部名称" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['outer_name', {initialValue:row.outer_name,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="简短语" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['short_text', {initialValue:row.short_text,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="备注信息" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['remark_info', {initialValue:row.remark_info,rules: [{required: false, min: 1, message: '请输入至少1个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" @change="onSwitchClick" v-if="row.is_enabled == 1"
            v-decorator="['is_enabled',{initialValue:row.is_enabled,rules: [{required: false}]}]" checked />
          <a-switch checkedChildren="启用" v-else :value="row.is_enabled" unCheckedChildren="禁用" @change="onSwitchClick" />
        </a-form-item>
        <a-form-item label="是否受保护" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="是" unCheckedChildren="否" @change="onSwitchPro" v-if="row.is_protected == 1"
            v-decorator="['is_protected',{initialValue:row.is_protected,rules: [{required: false}]}]" checked />
          <a-switch checkedChildren="是" v-else :value="row.is_protected" unCheckedChildren="否" @change="onSwitchPro" />
        </a-form-item>
        <a-form-item label="是否最终" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch checkedChildren="是" unCheckedChildren="否" @change="onSwitchIsEnd" v-if="row.is_end == 1"
            v-decorator="['is_end',{initialValue:row.is_end,rules: [{required: false}]}]" checked />
          <a-switch checkedChildren="是" v-else :value="row.is_end" unCheckedChildren="否" @change="onSwitchIsEnd" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {
    store,
    read,
    getCategory,
    updateDic,
    addDic,
    dictDataRead
  } from '@/api/framework/dictlist'
  import pick from 'lodash.pick'
  import moment from 'moment';
  export default {
    data() {
      return {
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        spinning: false,
        visible: false,
        confirmLoading: false,
        title: '',
        id: null,
        form: this.$form.createForm(this),
        row: {
          dict_name_id: '',
          dict_data_parent_id: '',
          data_code: '',
          data_text: '',
          outer_code: '',
          outer_name: "",
          short_text: "",
          remark_info: "",
          is_protected: 0,
          is_enabled: 0,
          is_end:0
        },
        show: false,
        value: undefined,
        treeData: [],
        dict_name_id:'',
        dict_data_parent_id:'',
        parentObj: {}
      }
    },
    methods: {
      add(data, parentObj) {
        console.log(parentObj)
        this.parentObj = parentObj
        this.row = {}
        this.visible = true
        this.title = '新增'
        this.dict_name_id = data.dict_name_id
        this.dict_data_parent_id = data.dict_data_parent_id
      },
      edit(record, parentObj) {
        this.parentObj = parentObj
        this.row = {}
        this.visible = true
        this.title = '编辑'
        const {
          form: {
            setFieldsValue
          }
        } = this
        this.id = record.dict_data_id
        //读取单条详细记录
        dictDataRead(this.id).then(res => {
          if (res) {
            this.spinning = false;
          }
          this.row = res.data;
          this.id = res.data.dict_name_id;
        })
      },
     
      onChange(value, label, extra) {
        this.value = value;
        this.row.dict_category_id = value;
      },

      onSwitchClick(checked, event) {
        if (checked) {
          this.row.is_enabled = 1;
        } else {
          this.row.is_enabled = 0;
        }
      },
      onSwitchPro(checked, event) {
        if (checked) {
          this.row.is_protected = 1;
        } else {
          this.row.is_protected = 0;
        }
      },
      onSwitchIsEnd(checked, event) {
        if (checked) {
          this.row.is_end = 1;
        } else {
          this.row.is_end = 0;
        }
      },
      addSubmit() {
        const {
          form: {
            validateFields
          }
        } = this
        if (this.id) {
          validateFields((errors, values) => {
            values.is_enabled = this.row.is_enabled;
            values.dict_name_id = this.row.dict_name_id;
            values.dict_data_parent_id = this.dict_data_parent_id;
            values.is_end = this.row.is_end;
            if (!errors) {
              this.confirmLoading = true
              updateDic(this.row.dict_data_id, values)
                .then(res => {
                  this.refresh(res.message);
                })
                .catch(err => {
                  this.confirmLoading = false;
                })
            }
          })
        } else {
          validateFields((errors, values) => {
            values.is_enabled = this.row.is_enabled;
            values.dict_name_id = this.dict_name_id;
            values.dict_data_parent_id = this.dict_data_parent_id;
            if (!errors) {
              this.confirmLoading = true
              addDic(values)
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
        console.log(this.parentObj)
        this.handleCancel()
        this.parentObj.getTableData()
      }
    }
  }
</script>

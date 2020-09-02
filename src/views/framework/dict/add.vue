<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item label="所属分类" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData"
            placeholder="请选择" @change='onChange' v-decorator="['dict_category_id',{initialValue:value,rules: [{required: true,message: '请选择所属分类！'}]}]">
            <span slot="title" slot-scope="{ key, value }" style="color: #08c">
              {{ value }}
            </span>
          </a-tree-select>
        </a-form-item>
        <a-form-item label="名称" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dict_naming', {initialValue:row.dict_naming,rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="说明" type="text" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['dict_explain', {initialValue:row.dict_explain,rules: [{required: false, min: 1, message: '请输入至少1个字符！'}]}]" />
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
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {
    store,
    update,
    read,
    getCategory
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
          dict_category_id: '',
          dict_naming: '',
          dict_explain: '',
          is_enabled: 1,
          is_protected: 0,
        },
        show: false,
        value: undefined,
        treeData: []
      }
    },
    // mounted: function() {
    //   this.getCategory();
    // },
    methods: {
      add(treeData) {
        this.visible = true
        this.title = '新增'
        this.row = {}
        this.treeData = treeData;
      },
      edit(record,treeData) {
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
      handleSubmit() {
        const {
          form: {
            validateFields
          }
        } = this
        if (this.id) {
          validateFields((errors, values) => {
            values.type = 2;
            values.is_enabled = this.row.is_enabled;
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
            values.type = 2;
            values.is_enabled = this.row.is_enabled;
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

<template>
  <el-form ref="form" :model="formData" label-width="100px" :class="action_type">
    <div style="text-align:left;margin-bottom:20px" v-if="action_type==='edit' || action_type==='new'">
      <el-button type="primary" @click="saveItem('form')">保存</el-button>
    </div>
    <component v-bind:is="formComponent" :formData="formData" v-if="formComponent"/>
    <div v-else>
    <el-form-item v-for="(field,index) in dataFields" :key="index" :label="field['title']" :prop="field['name']" :rules="field['rules']">
      <div class="form-item-value" style="text-align:left" v-if="(field.fieldEditMode==='view' || field.fieldEditMode==='display')">{{getFieldTranformed(field)}}</div>
      <div v-else>
        <el-select v-model="formData[field.name]" clearable v-if="field.editType=='select'">
          <el-option
            v-for="item in dataFieldsOptions[field.name]"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-checkbox-group v-model="formData[field.name]" v-else-if="field.editType=='checkbox'">
          <el-checkbox
            v-for="item in dataFieldsOptions[field.name]"
            :key="item"
            :label="item">
          </el-checkbox>
        </el-checkbox-group>
        <div v-else>
          <div v-if="field.multi">
            <div v-for="(item,index) in formData[field.name]" :key="index">
              <el-input type="text" v-model="formData[field.name][index]"> <el-button slot="append" @click="removeItem(field.name, index)" icon="el-icon-delete"/> </el-input>
            </div>
            <el-button type="text" @click="addItem(field.name)" icon="el-icon-plus" />
          </div>
          <el-input v-model="formData[field.name]" v-else></el-input>
        </div>
      </div>
    </el-form-item>
    </div>
  </el-form>
</template>

<script>
import {_} from 'underscore'
import moment from 'moment'

export default {
  props: ['data_id', 'data_action', 'data_type', 'data', 'action_type'],
  methods: {
    getFieldTranformed (field) {
      if (field.editType === 'datetime') {
        return this.getDisplayDateTime(this.formData[field.name])
      }
      return this.formData[field.name]
    },
    getDisplayDateTime (ts) {
      return ts ? moment(ts).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    addItem: function (fieldName) {
      this.formData[fieldName].push('')
    },
    removeItem: function (fieldName, index) {
      this.formData[fieldName].splice(index, 1)
    },
    fetchData: function () {
      let config = require('@/components/dataconfig/' + this.data_type + '.json')
      let configActions = config.actions
      this.formComponent = null
      for (let i = 0; i < configActions.length; i++) {
        if (configActions[i].name === this.data_action) {
          this.currentAction = configActions[i]
          if (configActions[i]['component']) {
            this.formComponent = () => import('@/components/DataItem/' + configActions[i]['component'])
          }
          break
        }
      }
      this.formData = this.data
      // this.$axios
      //   .get('/' + this.data_type + '/view/' + this.data_id)
      //   .then(response => {
      //     this.formData = response.data.data
      //   })
      this.dataFields = JSON.parse(JSON.stringify(config.fields)).filter(e => { return !e.hidden })
      if (this.currentAction.actionFields) {
        this.dataFields = []
        this.currentAction.actionFields.forEach(actionField => {
          let actionFieldArray = actionField.split('|')
          let fieldName = actionFieldArray[0]
          let fieldEditMode = 'display'
          if (actionFieldArray.length > 1) {
            fieldEditMode = actionFieldArray[1] === 'e' ? 'edit' : (actionFieldArray[1] === 'v') ? 'view' : 'display'
          }
          let dataField = JSON.parse(JSON.stringify(_.find(config.fields, {name: fieldName})))
          if (dataField) {
            dataField.fieldEditMode = fieldEditMode
            this.dataFields.push(dataField)
          }
        })
      }
      for (const fieldConfig of this.dataFields) {
        if (!fieldConfig.fieldEditMode) {
          fieldConfig.fieldEditMode = (this.currentAction.type === 'edit' || this.currentAction.type === 'new') ? 'edit' : 'display'
        }
        if (this.currentAction.type === 'new' && fieldConfig.default) {
          this.formData[fieldConfig.name] = fieldConfig.default
        }
        if (fieldConfig.multi === 1) {
          this.$set(this.formData, fieldConfig.name, !this.formData[fieldConfig.name] ? [] : JSON.parse(this.formData[fieldConfig.name]))
        }
        if (fieldConfig.editType === 'select' || fieldConfig.editType === 'checkbox') {
          if (fieldConfig.editType === 'checkbox') {
            this.$set(this.formData, fieldConfig.name, !this.formData[fieldConfig.name] ? [] : JSON.parse(this.formData[fieldConfig.name]))
          }
          this.$axios.post('/sys_dict/select_' + fieldConfig.option)
            .then(response => {
              this.$set(this.dataFieldsOptions, fieldConfig.name, response.data.data)
            })
            .catch(e => console.log(e))
        }
      }
    },
    saveItem: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let submitData = {}
          let stringifyKeys = []
          for (const fieldConfig of this.dataFields) {
            if (fieldConfig.multi) {
              stringifyKeys.push(fieldConfig.name)
            }
            submitData[fieldConfig.name] = this.formData[fieldConfig.name]
          }
          for (const key of stringifyKeys) {
            submitData[key] = JSON.stringify(submitData[key])
          }
          const submitId = this.data_id > 0 ? this.data_id : ''
          this.$axios
            .post('/' + this.data_type + '/edit?upsert=1&id=' + submitId, submitData)
            .then(response => {
              // this.formData = response.data.data;
              if (response.data.errno > 0) {
                this.$message({
                  message: '保存失败',
                  type: 'error'
                })
              } else {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.$emit('itemUpdated')
                if (!submitId) {
                  this.$emit('hideItem')
                }
              }
            })
            .catch(e => {
              this.$message({
                message: '保存失败',
                type: 'error'
              })
            })
        } else {
          console.log('验证失败')
        }
      })
    }
  },
  data: function () {
    return {
      formData: {},
      dataFields: [],
      dataFieldsOptions: {},
      formComponent: null,
      currentAction: {}
    }
  },
  mounted: function () {
    this.fetchData()
    this.$EventBus.$on('mapDoubleClicked', ({lng, lat}) => {
      if (this.currentAction.type === 'edit') {
        this.formData['LNG'] = lng
        this.formData['LAT'] = lat
      }
    })
  },
  watch: {
    'data_id': function () {
      this.fetchData()
    },
    'data_type': function () {
      this.fetchData()
    },
    'data_action': function () {
      this.fetchData()
    }
  }
}
</script>

<style>
#datadetail {
  text-align: center;
  color: #2c3e50;
}
.el-input-group__append, .el-input-group__prepend{
  background-color: gray
}
.dimming_plan .view .el-form-item__label{
  width: 200px !important;
}
.dimming_plan .view .el-form-item__content{
  margin-left: 200px !important;
}
.view .el-form-item, .view .el-form-item__label, .view .el-form-item__content, .form-item-value{
  height: 20px;
}
</style>

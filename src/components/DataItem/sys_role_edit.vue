<template>
  <el-form ref="form" :model="formData" label-width="80px">
    <div style="text-align:left;margin-bottom:20px">
      <el-button type="primary" @click="saveItem()">保存</el-button>
    </div>
    <el-form-item label="名称">
        <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="备注">
        <el-input v-model="formData.remark"></el-input>    
    </el-form-item>
         <div v-for="typeAction in formTypeActions" :key="typeAction.data_type">
        <div>{{typeAction.data_type}}</div>
        <el-checkbox-group v-model="formData.granted_actions">
          <el-checkbox v-for="action in typeAction.actions" :key="action.name" :label="typeAction.data_type+'/'+action.name">{{action.title}}</el-checkbox>
        </el-checkbox-group>
      </div>
  </el-form>
</template>

<script>
export default {
  props:['data_id', 'data_action', 'data_type', 'data'],
  methods: {
    fetchData: function(){
      this.formData = this.data
      this.$axios
      .get('/' + this.data_type + '/view/' + this.data_id)
      .then(response => {
        this.formTypeActions = response.data.data.type_actions
        this.formData = response.data.data
        // if (!) {
          this.$set(this.formData, 'granted_actions', !this.formData.granted_actions ? [] : JSON.parse(this.formData.granted_actions))
        // }
      })
    },
    saveItem: function(){
      let submitData = JSON.parse(JSON.stringify(this.formData))
      for (const key in this.formData) {
        if (Array.isArray(this.formData[key])) {
          submitData[key] = JSON.stringify(this.formData[key])
        }
      }
      this.$axios
        .post('/' + this.data_type + '/edit?upsert=1&id='+ this.data_id, submitData)
        .then(response => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$emit('itemUpdated')
        })
        .catch(e => {
          this.$message({
            message: '保存失败',
            type: 'error'
          });
        })
    }
  },
  data() {
    return {
      formTypeActions:[],
      formData: {},
      dataFields: [],
      dataFieldsOptions:{},
    }
  },
  mounted () {
    this.fetchData();
  }
}
</script>

<style>
</style>
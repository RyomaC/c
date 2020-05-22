<template>
  <div id="datalist" :class="datatype" style="height:100%; ">
    <div id="searchBar" style="text-align:left; ">
      <span class="searchBarFields" v-for="(field, index) in searchConfigFields" :key="index">
        {{field.title}}
        <el-select v-model="searchFields[field.name]" clearable v-if="field.editType=='select'">
          <el-option
            v-for="item in dataFieldsOptions[field.name]"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-input style="width:200px" v-model="searchFields[field.name]" v-else/>
      </span>
      <el-button type="primary" icon="el-icon-search" @click.native="searchData" class="actionButton"></el-button>
      <el-button type="primary" icon="el-icon-download" @click="downloadItem()" class="actionButton"></el-button>
    </div>
    <el-table
      :header-cell-style="{background:'#020288', color:'white'}"
      :row-style="{color:'#fff'}"
      :header-row-style="(r, i) => {return 'background-color:transparent; color:#fff;'}"
      :data="tableData.data"
      style="margin-bottom: 30px;"
      ref="etable"
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      >
      <el-table-column width="100px" fixed>
        <template slot-scope="scope" slot="header">
          <el-button type="primary" icon="el-icon-plus" @click="newItem()" v-if="getConfigAction('new').showInList && checkGranted(datatype + '/new')" class="actionButton"></el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="text" @click='viewItem(scope.row._id, tableData.data[scope.$index])'  icon="el-icon-document" />
          <el-button type="text" @click='deleteItem(scope.row._id )' v-if="checkGranted(datatype + '/delete')"  icon="el-icon-delete" />
        </template>
      </el-table-column>
      <el-table-column v-for="(field,index) in dataFields" :key="index" :label="field.title" :width="field.width" :fixed="index<(fixedColumns||1)">
        <template slot-scope="scope">
          {{field.editType=='datetime' ? getDisplayDateTime(scope.row[field.name]) : scope.row[field.name]}}
        </template>
      </el-table-column>
      <el-table-column min-width="1"/>
    </el-table>
    <el-pagination id="pagination"
                   @current-change="handlePageChange"
                   @size-change="handleSizeChange"
                   :current-page="page"
                   :page-size="size"
                   :pager-count="5"
                   hide-on-single-page
                   layout="total, sizes, prev, pager, next"
                   :total="tableData.count">
    </el-pagination>
    <el-drawer custom-class="drawer" :visible.sync="drawerVisible" :size="drawerSize">
      <div v-if="itemDetailContainerVisible" class="drawer">
        <DataItem ref="dataItem" :data_type="datatype" :data_id="selectedID" :data_action="action" :data="data" :visible="itemDetailContainerVisible" @hideItem="hideItem" @itemUpdated="fetchData"/>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import DataItem from '@/components/vehicle/DataItem'
import {_} from 'underscore'
import moment from 'moment'
import securityUtil from '@/utils/securityUtil.js'
import XLSX from 'xlsx'

export default {
  components: {DataItem},
  props: ['datatype', 'fixedColumns'],
  data: function () {
    return {
      tableData: {},
      dataFields: [],
      dataFieldsOptions: {},
      searchConfigFields: [],
      searchFields: {},
      configActions: [],      
      page: 1,
      size: null,
      where: {},
      itemDetailContainerVisible: false,
      selectedID: '',
      action: '',
      data: {}, 
      drawerVisible: false,
      drawerSize: '50',
      loading: true
    }
  },
  methods: {
    getDisplayDateTime (ts) {
      return ts ? moment(ts).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    checkGranted: function (action) {
      return securityUtil.checkGranted(action)
    },
    handlePageChange: function (val) {
      this.page = val
      this.fetchData()

    },
    handleSizeChange (val) {
      this.size = val
      this.fetchData(val)

    },
    searchData: function () {
      this.page = 1
      this.fetchData()
    },
    resetData: function () {
      this.tableData = {}
      this.dataFields = []
      this.searchConfigFields = []
      this.searchFields = {}
      this.page = 1
      this.where = {}
      this.error = null
      this.itemDetailContainerVisible = false
      this.selectedID = ''
      this.data = {}
    },
    deleteItem: function (id) {
      this.$confirm('确定要删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .get('/' + this.datatype + '/delete/' + id)
          .then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          })
          .catch(err => {
            this.$message({
              message: '删除失败',
              type: 'failure'
            })
          })
      }).catch(() => {
      })
    },
    newItem: function () {
      this.selectedID = ''
      this.data = {}
      this.action = 'new'
      this.drawerVisible = true
      this.itemDetailContainerVisible = true
    },
    viewItem: function (id, data) {
      this.selectedID = id
      this.data = JSON.parse(JSON.stringify(data))
      this.action = 'view'
      this.drawerVisible = true
      this.itemDetailContainerVisible = true
    },
    hideItem: function () {
      this.itemDetailContainerVisible = false
      this.drawerVisible = false
    },
    downloadItem: function() {
      let exportData = []
      let header = []
      const config = require('./dataconfig/' + this.datatype + '.json')
      this.dataFields = config.fields.filter(e => { return !e.hidden })
      for (const field of this.dataFields){
        header.push(field.title)
      }
      exportData.push(header)

      this.$axios
        .post('/' + this.datatype + '/list', {
          page: this.page,
          order: config.order,
          size: 10000,
          where: this.where
        })
        .then(response => {
          this.responsedata = response.data.data.data
          for (const row of this.responsedata) {
            let exportRow = []
            for (const field of this.dataFields) {
              if (field.dataType === 'timestamp') {
                row[field.name] = this.getDisplayDateTime(row[field.name])
              }
              exportRow.push(row[field.name] || '')
            }
            exportData.push(exportRow)
          }
          this.outputXlsxFile(exportData, this.datatype)
        })
    },
    fetchData: function () {
      this.loading = true
      const config = require('./dataconfig/' + this.datatype + '.json')
      this.dataFields = config.fields.filter(e => { return !e.hidden })
      this.configActions = config.actions      
      if (!this.size) {
        this.size = config.pageSize || 10
      }
      this.searchConfigFields = _.map(
        config.searchFields, (field) => {
          let fieldConfig = _.find(this.dataFields, {name: field})
          if (fieldConfig.editType === 'select' || fieldConfig.editType === 'checkbox') {
            this.$axios.post('/sys_dict/select_' + fieldConfig.option)
              .then(response => {
                this.dataFieldsOptions[field] = response.data.data
              })
              .catch(e => console.log(e))
          }
          return fieldConfig
        }
      )
      this.where = {}
      _.each(this.searchFields, (v, k) => {
        if (v !== '') {
          this.where[k] = {'$regex': '.*' + v + '.*'}
          //this.where[k] = ['like', '%' + v + '%']
        }
      })
      this.$axios
        .post('/' + this.datatype + '/list', {
          page: this.page,
          order: config.order,
          size: this.size,
          where: this.where
        })
        .then(response => {
          this.tableData = response.data.data
          this.loading = false
          this.$refs.etable.bodyWrapper.scrollTop = 0
        })
        .catch(e => {
          if (e.response.status === 403) {
            this.$router.replace('/error403')
          }
        })
    },
    outputXlsxFile: function (data, xlsxName) {
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, xlsxName)
      XLSX.writeFile(wb, xlsxName + '.xlsx')
    },
    getConfigAction (actionName) {
      return  _.find(this.configActions, configAction => {return configAction.name === actionName})
    }
  },
  mounted: function () {
    this.fetchData()
  },
  watch: {
    datatype: function () {
      this.resetData()
      this.fetchData()
    }
  }
}
</script>

<style>
#datalist {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#searchBar{
  float: left;
  color: white;
  margin-bottom: 10px;
}
.searchBarFields {
  display: inline-block;
  text-align: left;
  margin-right:20px;
  color: white
}
#actionBar {
  clear: both;
  margin-bottom: 10px;
}
@media screen and (max-width: 800px) {
  #searchBar {
    display: none;
  }
}
.actionButton{
  width: 32px;
  height: 32px;
  padding: 4px !important;
  /*margin-right: 3px !important;*/
}
#pagination{
  position: fixed;
  z-index: 999;
  height: 30px;
  width: 1000px;
  background-color: #1D2A41;
  bottom: 0px;
}
</style>

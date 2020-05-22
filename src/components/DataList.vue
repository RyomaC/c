<template>
  <div id="datalist" :class="$route.params.datatype" style="height:100%; ">
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
      <el-button type="primary" icon="el-icon-search" @click.native="searchData"></el-button>
    </div>
    <!-- <div id="actionBar" style="text-align:left;height:50px;" >
      <el-button type="primary" icon="el-icon-plus" @click="newItem()"></el-button>
    </div> -->
    <el-table
      :header-cell-style="{background:'#020288', color:'white'}"
      :row-style="{color:'#fff'}"
      :header-row-style="(r, i) => {return 'background-color:transparent; color:#fff;'}"
      :data="tableData.data"
      >
      <el-table-column width="80px" fixed>
        <template slot-scope="scope" slot="header">
          <el-button type="primary" icon="el-icon-plus" @click="newItem()" v-if="checkGranted($route.params.datatype + '/new')"></el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="text" @click='viewItem(scope.row._id, tableData.data[scope.$index])'  icon="el-icon-document" />
          <el-button type="text" @click='deleteItem(scope.row._id )' v-if="checkGranted($route.params.datatype + '/delete')"  icon="el-icon-delete" />
        </template>
      </el-table-column>
      <el-table-column v-for="(field,index) in dataFields" :key="index" :label="field.title" :width="field.width" :fixed="index<1">
        <template slot-scope="scope">
          {{field.editType=='datetime' ? getDisplayDateTime(scope.row[field.name]) : scope.row[field.name]}}
        </template>
      </el-table-column>
      <el-table-column/>
    </el-table>
    <div class="block">
      <el-pagination
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        :current-page="page"
        :page-size="size"
        :pager-count="5"
        hide-on-single-page
        layout="total, sizes, prev, pager, next"
        :total="tableData.count">
      </el-pagination>
    </div>
    <el-drawer custom-class="drawer" :visible.sync="drawerVisible" :size="drawerSize">
      <div v-show="itemDetailContainerVisible" class="drawer">
        <DataItem ref="dataItem" :data_type="$route.params.datatype" :data_id="selectedID" :data_action="action" :data="data" :visible="itemDetailContainerVisible" @hideItem="hideItem" @itemUpdated="fetchData"/>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import DataItem from '@/components/DataItem'
import {_} from 'underscore'
import moment from 'moment'
import securityUtil from '@/utils/securityUtil.js'

export default {
  components: { DataItem },
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
      this.size = 10
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
          .get('/' + this.$route.params.datatype + '/delete/' + id)
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
      this.selectedID = -Date.now()
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
    fetchData: function () {
      let config = require('./dataconfig/' + this.$route.params.datatype + '.json')
      this.dataFields = config.fields.filter(e => { return !e.hidden })
      if (!this.size) {
        this.size = config.pageSize || 10
      }
      this.searchConfigFields = _.map(
        config.searchFields, (field) => {
          let fieldConfig = _.find(this.dataFields, {name: field})
          if (fieldConfig.editType === 'select' || fieldConfig.editType === 'checkbox') {
            // this.$axios.post('/' + this.$route.params.datatype + '/select_' + fieldConfig.option)
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
          // this.where[k] = {"$regex": ".*" + v +".*"};
          this.where[k] = ['like', '%' + v + '%']
        }
      })
      this.$axios
        .post('/' + this.$route.params.datatype + '/list', {
          page: this.page,
          order: config.order,
          size: this.size,
          where: this.where
        })
        .then(response => {
          this.tableData = response.data.data
        })
        .catch(e => {
          if (e.response.status === 403) {
            this.$router.replace('/error403')
          }
        })
    }
  },
  data: function () {
    return {
      tableData: {},
      dataFields: [],
      dataFieldsOptions: {},
      searchConfigFields: [],
      searchFields: {},
      page: 1,
      size: null,
      where: {},
      itemDetailContainerVisible: false,
      selectedID: '',
      action: '',
      data: {},
      drawerVisible: false,
      drawerSize: '50'
    }
  },
  mounted: function () {
    this.fetchData()
  },
  watch: {
    '$route': function () {
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

</style>

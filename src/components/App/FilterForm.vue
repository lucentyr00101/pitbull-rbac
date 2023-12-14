<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline" :form="form" @submit="handleSubmit($event)">
      <a-row :gutter="48">
        <a-col
          v-for="(filter, i) in filters"
          :key="i"
          :md="8"
          :sm="24"
        >
          <a-form-item :label="filter.title">
            <template v-if="filter.valueType === 'select'">
              <a-select
                :show-search="!!filter.handleSearch || filter.showSearch"
                @search="(s) => filter.handleSearch && filter.handleSearch(s)"
                v-decorator="[
                  `${filter.dataIndex}`,
                  {
                    initialValue: filter.initialValue || null
                  }
                ]"
                :placeholder="$t('table.select.all')"
                :options="filter.api ? filter.valueEnums : convertDropdownEnums(filter.valueEnums)"
                @change="(e) => handleDropdownChange(filter, e)"
              />
            </template>
            <template v-else-if="filter.valueType === 'date'">
              <a-month-picker
                v-if="filter.dateType === 'month'"
                v-decorator="[`${filter.dataIndex}`]"
                :placeholder="filter.datePlaceholder"
              />
              <a-week-picker
                v-else-if="filter.dateType === 'week'"
                v-decorator="[`${filter.dataIndex}`]"
                :placeholder="filter.datePlaceholder"
              />
              <a-range-picker
                show-time
                v-else-if="filter.dateType === 'range'"
                v-decorator="[`${filter.dataIndex}`]"
                :placeholder="filter.datePlaceholder"
              />
              <a-date-picker
                v-else
                v-decorator="[`${filter.dataIndex}`]"
                :placeholder="filter.datePlaceholder"
              />
            </template>
            <template v-else-if="filter.valueType === 'numberRange'">
              <a-row type="flex">
                <a-space>
                  <a-input-number v-decorator="[`${filter.dataIndex[0]}`]"></a-input-number>
                  {{ $t('table.column.to') }}
                  <a-input-number v-decorator="[`${filter.dataIndex[1]}`]"></a-input-number>
                </a-space>
              </a-row>
            </template>
            <template v-else>
              <a-input-number
                v-if="filter.valueType === 'number'"
                v-decorator="[`${filter.dataIndex}`]"
              ></a-input-number>
              <a-input v-else v-decorator="[`${filter.dataIndex}`]"></a-input>
            </template>
          </a-form-item>
        </a-col>

        <a-col :md="!advanced && 8 || 24" :sm="24">
          <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
            <a-button v-if="permissions.includes(queryPermission)" type="primary" html-type="submit">{{ $t('table.action.query') }}</a-button>
            <a-button v-if="permissions.includes(resetPermission)" style="margin-left: 8px" @click="form.resetFields()">{{ $t('table.action.reset') }}</a-button>
            <a v-if="allFilters.length > 2" @click="advanced = !advanced" style="margin-left: 8px">
              {{ advanced ? $t('table.action.collapse') : $t('table.action.expand') }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <div class="table-operator">
      <slot name="operator"></slot>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    queryPermission: {
      type: String,
      default: ''
    },
    resetPermission: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      queryParam: {},
      advanced: false,
      form: this.$form.createForm(this, { name: 'advanced_search' })
    }
  },
  computed: {
    permissions () {
      return this.$store.getters.actionPermissions?.map(x => x.accessCode)
    },
    orderedColumns() {
      return this.columns.filter((col) => !!col.order).sort((a, b) => a.order - b.order)
    },
    unOrderedColumns() {
      return this.columns.filter((col) => !col.order)
    },
    count() {
      return this.advanced ? this.filters.length : 2
    },
    allFilters () {
      return [...this.orderedColumns, ...this.unOrderedColumns].filter(column => !column.hideInSearch)
    },
    filters() {
      if (this.advanced) {
        return this.allFilters
      } else if (this.allFilters.length >= 2) {
        return this.allFilters.slice(0, 2)
      } else {
        return this.allFilters.slice(0, 1)
      }
    }
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault()
      this.form.validateFields({ force: true }, (err, fieldsValue) => {
        if (!err) {
          const values = {}
          for (const [key, value] of Object.entries(fieldsValue)) {
            if (value instanceof moment) {
              values[key] = value.format('YYYY-MM-DD')
            } else if (Array.isArray(value) && value[0] instanceof moment && value[1] instanceof moment) {
              values.fromDate = value[0].format('YYYY-MM-DD HH:mm:ss')
              values.toDate = value[1].format('YYYY-MM-DD HH:mm:ss')
            } else if ((value && value !== 'All') || value === 0) {
              values[key] = value
            }
          }
          console.log(values)
          this.$emit('input', values)
          this.$emit('click')
        }
      })
    },
    handleDropdownChange(filter, value) {
      this.$emit('changeValue', { name: filter.dataIndex, value: value })
      filter.handleSearch && filter.handleSearch()
      if (filter.dependents) {
        this.form.resetFields([...filter.dependents])
      }
    },
    convertDropdownEnums(data) {
      if (data) {
        return Object.keys(data).map((key) => {
          return {
            value: key,
            label: data[key]
          }
        })
      }
    }
  }
}
</script>

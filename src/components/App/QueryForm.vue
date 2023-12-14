<template>
  <a-card style="margin-bottom: 20px" id="queryCard">
    <a-form :form="form" @submit="handleSubmit($event)">
      <a-row :gutter="[20, 0]" style="margin: 0" type="flex" justify="space-between" align="top">
        <a-col :span="24">
          <slot name="tab"></slot>
        </a-col>
        <a-col :span="20" class="parent-filter">
          <a-row :gutter="[20, 0]" style="margin: 0" type="flex" justify="space-between" align="top">
            <a-col
              :span="span"
              v-for="(filter, i) in filters"
              :key="filter.id"
              class="filter-container"
              :style="{
                display: i < count ? 'block' : 'none'
              }"
            >
              <a-row type="flex" :gutter="[10, 3]" style="justify-contents: center; align-items: center">
                <a-col class="name" :flex="handleLabelWidth(filter.labelWidth)" :span="12"> {{ filter.title }} :</a-col>
                <a-col class="input" flex="auto" :span="12">
                  <a-form-item>
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
                        :placeholder="i18nRender('table.select.all')"
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
                          {{ i18nRender('table.column.to') }}
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
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="4" style="text-align: right; padding: 0 !important; padding-top: 4px; white-space: nowrap">
          <a-space>
            <slot name="action-button"></slot>
            <a-button type="primary" html-type="submit">{{ i18nRender('table.action.query') }}</a-button>
            <a-button @click="handleReset">{{ i18nRender('table.action.reset') }}</a-button>
          </a-space>
          <a v-if="filters.length > 3" :style="{ marginLeft: '8px', fontSize: '12px' }" @click="expand = !expand">
            {{ expand ? $t('table.action.collapse') : $t('table.action.expand') }}
            <a-icon :type="expand ? 'up' : 'down'" />
          </a>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import { i18nRender } from '@/locales'

export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    span: { type: Number, default: 0 }
  },
  data() {
    return {
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' })
    }
  },
  computed: {
    orderedColumns() {
      return this.columns.filter((col) => !!col.order).sort((a, b) => a.order - b.order)
    },
    unOrderedColumns() {
      return this.columns.filter((col) => !col.order)
    },
    count() {
      return this.expand ? this.filters.length : 3
    },
    filters() {
      return [...this.orderedColumns, ...this.unOrderedColumns].reduce((filters, column) => {
        !column.hideInSearch && filters.push(column)
        return filters
      }, [])
    }
  },
  created() {},
  methods: {
    i18nRender,
    handleLabelWidth(width) {
      if (!width) return '80px'
      return width + 'px'
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
    },
    handleReset() {
      this.form.resetFields()
    },
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
          this.$emit('input', values)
          this.$emit('click')
        }
      })
    }
  }
}
</script>

<style lang="less">
#queryCard {
  .ant-card-body {
    padding: 15px 18px  !important;
    .ant-form-item {
      margin-bottom: 0 !important;
      width: 100% !important;
    }
  }
}
</style>

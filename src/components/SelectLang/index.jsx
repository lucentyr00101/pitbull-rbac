import './index.less'

import { Menu, Dropdown } from 'ant-design-vue'
import icon from '@/assets/language.svg'
import i18nMixin from '@/store/i18n-mixin'

const locales = ['zh-CN', 'en-US']
const languageLabels = {
  'zh-CN': '中文',
  'en-US': 'English'
}
// eslint-disable-next-line
const languageIcons = {
  'zh-CN': '🇨🇳',
  'en-US': '🇪🇳'
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  render() {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      window.dispatchEvent(new CustomEvent('language-changed'))
      this.setLang(key)
      window.location.reload()
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[this.currentLang]} onClick={changeLang}>
        {locales.map((locale) => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span class={prefixCls}>
          <img src={icon} alt="" />
        </span>
      </Dropdown>
    )
  }
}

export default SelectLang

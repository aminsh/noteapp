import { Menu, MenuProps } from 'antd'
import { translate } from '../../utils'
import { Link } from 'react-router-dom'

export const MainMenu = () => {
  const items: MenuProps['items'] = [
    {
      label: translate('notes'),
      key: 'notes',
      icon: '',
      children: [
        {
          label: <Link to='/notes'>
            {translate('my', 'notes')}
          </Link> ,
          key: 'myNotes',
        },
      ]
    },
    {
      label: <Link to='/files'>
        {translate('files')}
      </Link>,
      key: 'files',
      icon: '',
    },
  ]

  return <Menu
    theme='light'
    mode="horizontal"
    items={items}
  />
}
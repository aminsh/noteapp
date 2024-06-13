import { MenuProps } from 'antd'
import { Link } from 'react-router-dom'
import { translate } from '../utils'

type MenuItem = Required<MenuProps>['items'][number]

export const menuItems:MenuItem[]  = [
  {
    key: 'notes',
    label: <Link to='/notes'>{translate('notes')}</Link> ,
  },
  {
    key: 'files',
    label: <Link to='/files'>{translate('files')}</Link> ,
  },
]
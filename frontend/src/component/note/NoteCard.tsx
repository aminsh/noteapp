import { Avatar, Button, Card, Dropdown, MenuProps, Space, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  LinkOutlined,
  PaperClipOutlined,
  ProfileOutlined,
  ShareAltOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Note } from '../../type/entity'
import { translate } from '../../utils'

export type NoteCardProps = {
  note: Note
  edit: () => void
  share: () => void
  remove: () => void
  preview: () => void
  getPublicLink: () => void
}

export const NoteCard = ({note, edit, share, remove, preview, getPublicLink}: NoteCardProps) => {
  const menuClickMapper: Record<string, () => void> = {
    'share': share,
    'remove': remove,
    'preview': preview,
    'get_public_link': getPublicLink,
  }
  const onMenuClick = ({key}: { key: string }) => {
    menuClickMapper[key]()
  }
  const items: MenuProps['items'] = [
    {
      key: 'share',
      label: (
        <Space size="middle">
          <ShareAltOutlined/>
          {translate('share')}
        </Space>
      ),
    },
    {
      key: 'get_public_link',
      label: (
        <Space size="middle">
          <LinkOutlined/>
          {translate('get_public_link')}
        </Space>
      ),
    },
    {
      key: 'add_to_favorite',
      label: (
        <Space size="middle">
          <StarOutlined/>
          {translate('add_to_favorite')}
        </Space>
      ),
    },
    {
      key: 'preview',
      label: (
        <Space size="middle">
          <ProfileOutlined/>
          {translate('preview')}
        </Space>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'remove',
      label: (
        <Space size="middle">
          <DeleteOutlined/>
          {translate('remove')}
        </Space>
      ),
      danger: true,
    },
  ]
  return (
    <Card
      style={{width: 300}}
      actions={[
        <Button
          type="text"
          shape="circle"
          key="edit"
          icon={<EditOutlined/>}
          onClick={edit}
        />,
        <Dropdown
          menu={{items, onClick: onMenuClick}}
          placement="bottomLeft"
        >
          <Button
            type="text"
            shape="circle"
            key="more"
            icon={<EllipsisOutlined/>}
          />
        </Dropdown>,
      ]}
    >
      <Space direction="vertical">
        <Typography.Title
          ellipsis={{rows: 1, expandable: false, symbol: 'more'}}
          style={{width: 250, height: 40}}
          level={4}
        >
          {note.title}
        </Typography.Title>

        <div style={{height: 40}}>
          {
            note.shared?.length
              ? <Space>
                <Avatar.Group maxCount={3}>
                  {note.shared.map((it, index) =>
                    <Avatar
                      icon={<UserOutlined/>}
                      style={{background: color[index]}}
                    >
                      {it.user.name?.substring(0, 1)}
                    </Avatar>,
                  )}
                </Avatar.Group>
                <span className="text-muted">{translate('shared_with', note.shared?.length.toString(), 'people')}</span>
              </Space>
              : ''
          }
        </div>

        <div style={{height: 20}}>
          {
            note.attachments?.length
              ? <Space>
                <PaperClipOutlined style={{fontSize: 20}}/>
                <span className="text-muted">
                    {note.attachments?.length} {translate('files')}
                  </span>
              </Space>
              : ''
          }
        </div>
      </Space>
    </Card>
  )
}

const color = [
  'rgb(45, 183, 245)',
  'hsl(102, 53%, 61%)',
  'hwb(205 6% 9%)',
]
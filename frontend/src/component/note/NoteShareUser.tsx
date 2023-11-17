import { FormField } from '../../type/form'
import { User } from '../../type/entity'
import { useLazyQuery } from '@apollo/client'
import { GET_USERS_BY_IDS, GET_USERS_SEARCH } from '../../gql/user'
import React, { useEffect, useState } from 'react'
import { Select, Space } from 'antd'

export const NoteShareUser = ({ value, onChange }: FormField<string>) => {
  const [ users, setUsers ] = useState<UserOptionType[]>([])
  const [ searchUsers, { loading: searchUsersLoading } ] = useLazyQuery<{ UsersSearch: User[] }>(GET_USERS_SEARCH)
  const [ find, { loading: finding } ] = useLazyQuery<{ UsersFindById: User[] }, { ids: string[] }>(GET_USERS_BY_IDS)

  useEffect(() => {
    fetch()
  }, [ value ])

  const fetch = async () => {
    if (!value)
      return

    const { data } = await find({
      variables: {
        ids: [ value ]
      }
    })

    setUsers(
      mapUsers(data?.UsersFindById || [])
    )
  }

  const search = async (value: string) => {
    const result = await searchUsers({
      variables: {
        term: value,
        take: 10
      }
    })

    setUsers(
      mapUsers(result.data?.UsersSearch || [])
    )
  }

  const mapUsers = (users?: User[]): UserOptionType[] => {
    if (!users?.length)
      return []

    return users.map(e => ({
      label: <Space direction='horizontal'>
        <label>{ e.name }</label>
        <span>{ e.email }</span>
      </Space>,
      value: e.id || '',
      item: e
    }))
  }

  return (
    <Select
      allowClear
      showSearch
      onDropdownVisibleChange={ (open) => open && search('') }
      options={ users }
      value={ value }
      loading={ searchUsersLoading || finding }
      onSearch={ search }
      onChange={ value => onChange!(value) }
    />
  )
}

interface UserOptionType {
  label: React.ReactNode
  value: string,
  item: User
}

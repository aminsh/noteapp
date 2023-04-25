import { Alert, Button, Form, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom';
import { translate } from '../../utils'
import { useAuth } from '../../hook/auth.hook';

export const Login = () => {
  const { login } = useAuth()
  const { error, execute, loading } = login

  return (
    <Form
      name='login-form'
      onFinish={ execute }
    >
      {
        error &&
        <Alert
          message={ translate('login_fail_message') }
          type="error"
          showIcon
        />
      }

      <Form.Item
        className='mt-2'
        name='email'
        rules={ [ { required: true, message: translate('auth_required_error_message', 'email') } ] }
      >
        <Input
          size='large'
          prefix={ <UserOutlined className='site-form-item-icon'/> }
          placeholder={ translate('email') }
        />
      </Form.Item>

      <Form.Item
        name='password'
        rules={ [ { required: true, message: translate('auth_required_error_message', 'password') } ] }
      >
        <Input
          size='large'
          prefix={ <LockOutlined/> }
          type='password'
          placeholder={ translate('password') }
        />
      </Form.Item>

      <Form.Item className='mt-2'>
        <Button
          loading={ loading }
          size='large'
          block
          type='primary'
          htmlType='submit'
          className='login-form-button'>
          { translate('login') }
        </Button>

        <NavLink to='/register'>
          { translate('register', 'now', '!') }
        </NavLink>
      </Form.Item>
    </Form>
  )
}

import { Alert, Button, Form, Input } from 'antd';
import { translate } from '../../utils';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { EXECUTE_REGISTER } from '../../gql/user';
import { RegisterDTO } from '../../type/dto';

export const Register = () => {
  const navigate = useNavigate()
  const [ _execute, { loading, error } ] = useMutation(EXECUTE_REGISTER)

  const execute = async (dto: RegisterDTO) => {
    const result = await _execute({ variables: { userRegister: dto } })
    if (result.errors)
      return

    navigate('/login')
  }

  return (
    <Form
      name='register-form'
      onFinish={ execute }
    >
      {
        error &&
        <Alert
          message={ error.message }
          type="error"
          showIcon
        />
      }

      <Form.Item
        className='mt-2'
        name='name'
        rules={ [ { required: true, message: translate('auth_required_error_message', 'name') } ] }
      >
        <Input
          size='large'
          placeholder={ translate('name') }
        />
      </Form.Item>

      <Form.Item
        name='email'
        rules={ [
          { required: true, message: translate('auth_required_error_message', 'email') },
          { type: 'email', message: translate('email_is_invalid') }
        ] }
      >
        <Input
          size='large'
          placeholder={ translate('email') }
        />
      </Form.Item>

      <Form.Item
        name='password'
        rules={ [ { required: true, message: translate('auth_required_error_message', 'password') } ] }
      >
        <Input
          size='large'
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
          { translate('register') }
        </Button>

        <NavLink to='/login'>
          { translate('have_an_account') }
        </NavLink>
      </Form.Item>
    </Form>
  )
}

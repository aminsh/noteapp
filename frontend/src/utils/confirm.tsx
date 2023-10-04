import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { translate } from './translate';

const { confirm: antConfirm } = Modal;

export const confirm = (message: string): Promise<boolean> => {
  return new Promise<boolean>((resolve => {
    antConfirm({
      icon: <ExclamationCircleFilled/>,
      content: message,
      okText: translate('yes'),
      cancelText: translate('no'),
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      }
    })
  }))
}

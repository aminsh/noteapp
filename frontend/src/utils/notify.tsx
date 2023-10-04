import { notification } from "antd";

export class Notify {
  error(title: string, message: string): void {
    notification.error({
      message: title,
      description: message
    });
  }

  success(title: string, message: string): void {
    notification.success({
      message: title,
      description: message
    });
  }

  info(title: string, message: string): void {
    notification.info({
      message: title,
      description: message
    });
  }
}


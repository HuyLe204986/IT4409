import { message } from "antd";

const success = (mes = 'Success', duration = 1) => {
  message.success(mes, duration);
};
const error = (mes = 'Error', duration = 1) => {
    message.error(mes, duration);

};
const warning = (mes = 'Warning', duration = 1) => {
    message.warning(mes, duration);

}
export {
    success, error, warning
}

import { api } from 'src/boot/axios';
import { Response, SystemInfo, Admin, Setting } from 'src/types';

const prefix = '/admin';

export const getSystemInfo = async () => {
  const data: Response<SystemInfo> = await api.get(`${prefix}/system/info`);
  return data;
};

export const login = async (body: Admin) => {
  const data: Response<null> = await api.post(`${prefix}/login`, body);
  return data;
};

export const logout = async () => {
  const data: Response<null> = await api.post(`${prefix}/logout`);
  return data;
};

export const getSettings = async () => {
  const data: Response<Array<Setting>> = await api.get(`${prefix}/settings`);
  return data;
};

export const updateSetting = async (key: string, value: string | number) => {
  const data: Response<null> = await api.put(
    `${prefix}/settings/${key}`,
    value
  );
  return data;
};

export const deleteExpiredTextRecords = async () => {
  const data: Response<null> = await api.delete(
    `${prefix}/records/expired/text`
  );
  return data;
};

export const deleteExpiredFileRecords = async () => {
  const data: Response<null> = await api.delete(
    `${prefix}/records/expired/file`
  );
  return data;
};

export const deleteExpiredChunks = async () => {
  const data: Response<null> = await api.delete(`${prefix}/expired/chunks`);
  return data;
};

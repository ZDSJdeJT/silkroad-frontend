import { api } from 'src/boot/axios';
import { Response, PublicSettings, Text, File, Receive } from 'src/types';
import { saveAs } from 'file-saver';
import { AxiosProgressEvent } from 'axios';

const prefix = '/public';

export const getPublicSettings = async () => {
  const data: Response<PublicSettings> = await api.get(`${prefix}/settings`);
  return data;
};

export const uploadText = async (body: Text) => {
  const data: Response<string> = await api.post(`${prefix}/upload/texts`, body);
  return data;
};

export const uploadFile = async (uuid: string, formData: FormData) => {
  const data: Response<null> = await api.post(
    `${prefix}/upload/files/${uuid}`,
    formData
  );
  return data;
};

export const mergeFile = async (uuid: string, body: File) => {
  const data: Response<string> = await api.post(
    `${prefix}/upload/files/merge/${uuid}`,
    body
  );
  return data;
};

export const deleteRecord = async (id: string) => {
  const data: Response<null> = await api.delete(`${prefix}/records/${id}`);
  return data;
};

export const getRecordByCode = async (code: string) => {
  const data: Response<Receive> = await api.get(`${prefix}/records/${code}`);
  return data;
};

export const receiveText = async (code: string) => {
  const data: Response<string> = await api.get(
    `${prefix}/receive/texts/${code}`
  );
  return data;
};

export const receiveFile = async (
  code: string,
  filename: string,
  onDownloadProgress: (progressEvent: AxiosProgressEvent) => void
) => {
  const response: Blob = await api.get(`${prefix}/receive/files/${code}`, {
    responseType: 'blob',
    onDownloadProgress,
  });
  const blob = new Blob([response], { type: 'application/octet-stream' });
  saveAs(blob, filename);
};

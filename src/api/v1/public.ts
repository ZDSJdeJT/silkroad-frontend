import { api } from 'src/boot/axios';
import { Response, PublicSettings, Text, File, Receive } from 'src/types';
import { saveAs } from 'file-saver';

const prefix = '/public';

export const getPublicSettings = async () => {
  const data: Response<PublicSettings> = await api.get(`${prefix}/settings`);
  return data;
};

export const uploadText = async (body: Text) => {
  const data: Response<string> = await api.post(`${prefix}/upload/text`, body);
  return data;
};

export const uploadFile = async (uuid: string, formData: FormData) => {
  const data: Response<null> = await api.post(
    `${prefix}/upload/file/${uuid}`,
    formData
  );
  return data;
};

export const mergeFile = async (uuid: string, body: File) => {
  const data: Response<string> = await api.post(
    `${prefix}/upload/file/merge/${uuid}`,
    body
  );
  return data;
};

export const receive = async (
  code: string
): Promise<{ data: Response<Receive>; callback: () => string }> => {
  const data: ArrayBuffer = await api.get(`${prefix}/receive/${code}`, {
    responseType: 'arraybuffer',
  });
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(data);
  const firstLineEndIndex = text.indexOf('\n');
  const jsonStr = text.slice(0, firstLineEndIndex);
  const jsonData: Response<Receive> = JSON.parse(jsonStr);
  const encoder = new TextEncoder();
  const encodedString = encoder.encode(jsonStr);
  const newData = data.slice(encodedString.length + 1);
  return {
    data: jsonData,
    callback:
      jsonData.result.filename === ''
        ? () => {
            return decoder.decode(newData);
          }
        : () => {
            // 将新的 ArrayBuffer 存储到文件中
            saveAs(
              new Blob([newData], {
                type: 'application/octet-stream',
              }),
              jsonData.result.filename
            );
            return '';
          },
  };
};

export const deleteRecord = async (id: string) => {
  const data: Response<null> = await api.delete(`${prefix}/records/${id}`);
  return data;
};

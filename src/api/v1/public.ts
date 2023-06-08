import { api } from 'src/boot/axios';
import { Response, PublicSettings, Text, File, Receive } from 'src/types';

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

export const receive = async (code: string) => {
  const data: ArrayBuffer = await api.get(`${prefix}/receive/${code}`, {
    responseType: 'arraybuffer',
  });
  const lineBreak = '\n';
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(data);
  if (text.includes(lineBreak)) {
    // 是文件
    const firstLineEndIndex = text.indexOf(lineBreak);
    const jsonStr = text.slice(0, firstLineEndIndex);
    const jsonData: Response<Receive> = JSON.parse(jsonStr);
    return {
      data: jsonData,
      callback: () => {
        const encoder = new TextEncoder();
        const encodedString = encoder.encode(jsonStr);
        const newData = data.slice(encodedString.length + 1);
        // 将新的 ArrayBuffer 存储到文件中
        const blob = new Blob([newData], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = jsonData.result.content;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
    };
  }
  // 是文本
  return {
    data: JSON.parse(text) as Response<Receive>,
  };
};

export const deleteText = async (id: string) => {
  const data: Response<null> = await api.delete(`${prefix}/text/${id}`);
  return data;
};

export const deleteFile = async (id: string) => {
  const data: Response<null> = await api.delete(`${prefix}/file/${id}`);
  return data;
};

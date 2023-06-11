import { uploadFile } from 'src/api/v1';

export const getFileChunks = (file: File, chunkBytes: number) => {
  const total = Math.max(Math.ceil(file.size / chunkBytes), 1);
  const chunkList = [];
  for (let i = 0; i < total; i++) {
    const start = i * chunkBytes;
    const end = Math.min(start + chunkBytes, file.size);
    const chunk = file.slice(start, end);
    chunkList.push(chunk);
  }
  return chunkList;
};

export const uploadChunk = async (
  uuid: string,
  size: number,
  index: number,
  total: number,
  chunk: Blob
) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('size', String(size));
  formData.append('index', String(index));
  formData.append('total', String(total));
  await uploadFile(uuid, formData);
};

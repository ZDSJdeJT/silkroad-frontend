import { uploadFile } from 'src/api/v1';

const CHUNK_BYTES = /* 2 MB */ 2097152;

export const getFileChunks = (file: File) => {
  const chunks = Math.ceil(file.size / CHUNK_BYTES);
  const chunkList = [];
  for (let i = 0; i < chunks; i++) {
    const start = i * CHUNK_BYTES;
    const end = Math.min(start + CHUNK_BYTES, file.size);
    const chunk = file.slice(start, end);
    chunkList.push(chunk);
  }
  return chunkList;
};

export const uploadChunk = async (
  uuid: string,
  chunk: Blob,
  size: number,
  index: number,
  totalChunks: number
) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('size', String(size));
  formData.append('index', String(index));
  formData.append('totalChunks', String(totalChunks));
  await uploadFile(uuid, formData);
};

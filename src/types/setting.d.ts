export interface Setting {
  key: string;
  textValue: string;
  numberValue: number;
  isText: boolean;
  min: number;
  max: number;
  label: {
    'en-US': string;
    'zh-CN': string;
  };
}

export interface PublicSettings {
  downloadTimes: number;
  keepDays: number;
  uploadFileBytes: number;
  uploadTextLength: number;
  uploadChunkBytes: number;
}

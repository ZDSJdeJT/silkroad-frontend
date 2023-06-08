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
  maxDownloadTimes: number;
  maxKeepDays: number;
  maxUploadFileBytes: number;
  maxUploadTextLength: number;
}

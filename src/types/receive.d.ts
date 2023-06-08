export interface Receive {
  id: string;
  code: string;
  content: string;
  isFile: boolean;
  downloadTimes: number;
  expireAt: string;
}

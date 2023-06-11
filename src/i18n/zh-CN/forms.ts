export default {
  labels: {
    receiveCode: '接收码',
    keepDays: '保存天数',
    isDownloadTimesLimited: '是否限制下载次数',
    downloadTimes: '下载次数',
    file: '文件',
    text: '文本',
    username: '用户名',
    password: '密码',
  },
  rules: {
    notEmpty: '{label}不能为空',
    range: '{label}的取值范围必须在 {min} 到 {max} 之间',
    rangeLength: '{label}的长度必须在 {min} 到 {max} 之间',
    maxSize: '{label}大小不能大于 {max}',
  },
  hints: {
    richText: '注意：您输入的字符计数可能与最终结果不同。',
  },
  placeholders: {
    richText: '请输入文本',
  },
};

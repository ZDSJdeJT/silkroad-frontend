export default {
  labels: {
    receiveCode: 'Receive code',
    keepDays: 'Keep days',
    isDownloadTimesLimited: 'Is download times limited',
    downloadTimes: 'Download times',
    file: 'File',
    text: 'Text',
    username: 'Username',
    password: 'Password',
  },
  rules: {
    notEmpty: '{label} cannot be empty',
    range: '{label} must be between {min} and {max}',
    rangeLength: '{label} length must be between {min} and {max}',
    maxSize: '{label} size must be less than or equal to {max}',
  },
  hints: {
    richText:
      'Note: The character count you enter may differ from the final result.',
  },
  placeholders: {
    richText: 'Please enter text',
  },
};

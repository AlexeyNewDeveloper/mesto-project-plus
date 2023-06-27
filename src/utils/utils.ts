const getPureMessageFromError = (string: string = ''): string => {
  if (string.includes('$')) {
    return string.split('$')[1];
  }
  return '';
};

export default {
  getPureMessageFromError,
};

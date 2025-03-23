export const isValidURL = (string: string) => {
  const urlRegex =
    /^(https?:\/\/)([a-zA-Z\d-]{1,63}\.)+[a-zA-Z]{2,6}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;

  return urlRegex.test(string);
};

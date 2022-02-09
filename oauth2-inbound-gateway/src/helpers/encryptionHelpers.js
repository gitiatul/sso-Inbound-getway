var encryptionHelpers = {
  /**
   * Base64 encoding
   *
   * @param {string} str Input string to be encoded.
   * @param {string} inputEncoding Encoding of input string str. Default is 'UTF-8'
   * @param {string} outputEncoding Encoding of output string str. Default is 'base64'
   *
   * @returns Base64 encoded string
   */
  base64Encode: (str, inputEncoding = "UTF-8", outputEncoding = "base64") => {
    let buf = Buffer.from(str, inputEncoding);
    let base64EncodedData = buf.toString(outputEncoding);
    return base64EncodedData;
  },
  /**
   * Base64 encoding
   *
   * @param {string} str Input string to be encoded.
   * @param {string} inputEncoding Encoding of input string str. Default is 'base64'
   * @param {string} outputEncoding Encoding of output string str. Default is 'UTF-8'
   *
   * @returns Base64 encoded string
   */
  base64Decode: (str, inputEncoding = "base64", outputEncoding = "UTF-8") => {
    let buf = Buffer.from(str, inputEncoding);
    let base64EncodedData = buf.toString(outputEncoding);
    return base64EncodedData;
  },
};

module.exports = encryptionHelpers;

/* response generation library for api */
// const encLib = require('./encLib');

const generateEnc = (err, message, data) => {
  const response = {
    err: err,
    message: message,
    data: data ? encLib.encrypt(data).toString('base64') : data
  };
  return response;
};

const generate = (err, message, data) => {
  const response = {
    err: err,
    message: message,
    data: data
  };
  return response;
};

module.exports = {
  generate,
  generateEnc
};
// not complete yet, need to add more functions for different response types (e.g. success, error, etc.)

// This library provides two functions, generate and generateEnc, 
// to create standardized API responses. The generateEnc function 
// encrypts the data before including it in the response, while the generate 
// function returns the data as is. Both functions include an error flag and a 
// message to provide context about the response.

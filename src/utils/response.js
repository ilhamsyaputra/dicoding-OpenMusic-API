const successResponse = (h, { responseMessage, responseData, responseCode = 200 }) => {
  const response = { status: 'success' };

  if (responseData) {
    response.data = responseData;
  }

  if (responseMessage) {
    response.message = responseMessage;
  }

  return h.response(response).code(responseCode);
};

const failResponse = (h, error) => (
  h.response({
    status: 'fail',
    message: error.message,
  }).code(error.statusCode)
);

const errorResponse = (h) => (
  h.response({
    status: 'error',
    message: 'Maaf, terjadi kesalahan pada server',
  }).code(500)
);

module.exports = { successResponse, failResponse, errorResponse };

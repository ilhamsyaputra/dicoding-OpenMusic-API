/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const {
  successResponse,
  failResponse,
  serverErrorResponse,
} = require('../../utils/responseHandler');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const _userId = await this._service.addUser({ username, password, fullname });

      return successResponse(h, {
        message: 'User berhasil ditambahkan',
        data: {
          userId: _userId,
        },
        responseCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      return serverErrorResponse(h);
    }
  }
}

module.exports = UsersHandler;

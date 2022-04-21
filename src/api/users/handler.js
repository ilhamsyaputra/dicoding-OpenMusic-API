const { successResponse } = require('../../utils/responseHandler');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
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
  }
}

module.exports = UsersHandler;

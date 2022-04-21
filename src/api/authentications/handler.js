const { successResponse } = require('../../utils/responseHandler');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(username, password);

    const _accessToken = this._tokenManager.generateAccessToken({ id });
    const _refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(_refreshToken);

    return successResponse(h, {
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken: _accessToken,
        refreshToken: _refreshToken,
      },
      responseCode: 201,
    });
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const _accessToken = this._tokenManager.generateAccessToken({ id });
    return successResponse(h, {
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken: _accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return successResponse(h, {
      message: 'Refresh token berhasil dihapus',
    });
  }
}

module.exports = AuthenticationsHandler;

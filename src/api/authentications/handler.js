/* eslint-disable no-underscore-dangle */
const {
  successResponse,
  failResponse,
  serverErrorResponse,
} = require('../../utils/responseHandler');
const ClientError = require('../../exceptions/ClientError');

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
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      return serverErrorResponse(h);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server Error
      return serverErrorResponse(h);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return successResponse(h, {
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      return serverErrorResponse(h);
    }
  }
}

module.exports = AuthenticationsHandler;

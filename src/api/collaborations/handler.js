/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const {
  successResponse,
  failResponse,
  serverErrorResponse,
} = require('../../utils/responseHandler');
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationService, playlistsService, validator) {
    this._collaborationService = collaborationService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationService.verifyUser(userId);
      const _collaborationId = await this._collaborationService.addCollaboration(playlistId, userId);

      return successResponse(h, {
        data: {
          collaborationId: _collaborationId,
        },
        responseCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      console.error(error);
      return serverErrorResponse(h);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId, userId } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationService.deleteCollaboration(playlistId, userId);

      return successResponse(h, {
        message: 'Kolaborasi berhasil dihapus',
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

module.exports = CollaborationsHandler;

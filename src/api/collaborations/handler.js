const { successResponse } = require('../../utils/responseHandler');

class CollaborationsHandler {
  constructor(collaborationService, playlistsService, validator) {
    this._collaborationService = collaborationService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
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
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return successResponse(h, {
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;

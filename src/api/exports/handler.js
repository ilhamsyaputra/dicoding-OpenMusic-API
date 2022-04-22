const { successResponse } = require('../../utils/responseHandler');

class ExportsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    return successResponse(h, {
      message: 'Permintaan Anda sedang kami proses',
      responseCode: 201,
    });
  }
}

module.exports = ExportsHandler;

const { successResponse } = require('../../utils/responseHandler');

class PlaylistsActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    this.getPlaylistsActivitiesHandler = this.getPlaylistsActivitiesHandler.bind(this);
  }

  async getPlaylistsActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const _activities = await this._service.getPlaylistsActivities(id);

    return successResponse(h, {
      data: {
        playlistId: id,
        activities: _activities,
      },
    });
  }
}

module.exports = PlaylistsActivitiesHandler;

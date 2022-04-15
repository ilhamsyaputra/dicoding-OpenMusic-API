/* eslint-disable no-underscore-dangle */
const {
  successResponse,
  failResponse,
  serverErrorResponse,
} = require('../../utils/responseHandler');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    this.getPlaylistsActivitiesHandler = this.getPlaylistsActivitiesHandler.bind(this);
  }

  async getPlaylistsActivitiesHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      console.error(error);
      return serverErrorResponse(h);
    }
  }
}

module.exports = PlaylistsActivitiesHandler;

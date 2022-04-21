const { successResponse } = require('../../utils/responseHandler');

class PlaylistsHandler {
  constructor(service, songsService, playlistsActivitiesService, validator) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;
    this._playlistsActivitiesService = playlistsActivitiesService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongByPlaylistIdHandler = this.postSongByPlaylistIdHandler.bind(this);
    this.getSongsByPlaylistIdHandler = this.getSongsByPlaylistIdHandler.bind(this);
    this.deleteSongsByPlaylistIdHandler = this.deleteSongsByPlaylistIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayloadSchema(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const _playlistId = await this._service.addPlaylist({ name, credentialId });

    return successResponse(h, {
      data: {
        playlistId: _playlistId,
      },
      responseCode: 201,
    });
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const _playlists = await this._service.getPlaylists(credentialId);

    return successResponse(h, {
      data: {
        playlists: _playlists,
      },
    });
  }

  async deletePlaylistHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return successResponse(h, {
      message: 'Playlist berhasil dihapus',
    });
  }

  async postSongByPlaylistIdHandler(request, h) {
    this._validator.validatePostAddSongToPlaylistPayloadSchema(request.payload);

    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._songsService.getSongById(songId);
    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.addSongToPlaylist(id, songId);
    await this._playlistsActivitiesService.logActivities(id, songId, credentialId, 'add');

    return successResponse(h, {
      message: 'Lagu berhasil ditambahkan ke playlist',
      responseCode: 201,
    });
  }

  async getSongsByPlaylistIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlistInfo = await this._service.getPlaylistInfo(id);
    const songs = await this._service.getSongsByPlaylistId(id);
    return successResponse(h, {
      data: {
        playlist: {
          id: playlistInfo.id,
          name: playlistInfo.name,
          username: playlistInfo.username,
          songs,
        },
      },
    });
  }

  async deleteSongsByPlaylistIdHandler(request, h) {
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongFromPlaylistBySongId(songId, id);
    await this._playlistsActivitiesService.logActivities(id, songId, credentialId, 'delete');

    return successResponse(h, {
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }
}

module.exports = PlaylistsHandler;

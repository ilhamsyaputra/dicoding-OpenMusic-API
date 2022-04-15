/* eslint-disable no-underscore-dangle */
const {
  successResponse,
  failResponse,
  serverErrorResponse,
} = require('../../utils/responseHandler');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, songsService, validator) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongByPlaylistIdHandler = this.postSongByPlaylistIdHandler.bind(this);
    this.getSongsByPlaylistIdHandler = this.getSongsByPlaylistIdHandler.bind(this);
    this.deleteSongsByPlaylistIdHandler = this.deleteSongsByPlaylistIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      console.error(error);
      return serverErrorResponse(h);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const _playlists = await this._service.getPlaylists(credentialId);

      return successResponse(h, {
        data: {
          playlists: _playlists,
        },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      return serverErrorResponse(h);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return successResponse(h, {
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      return serverErrorResponse(h);
    }
  }

  async postSongByPlaylistIdHandler(request, h) {
    try {
      this._validator.validatePostAddSongToPlaylistPayloadSchema(request.payload);

      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._songsService.getSongById(songId);
      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.addSongToPlaylist(id, songId);

      return successResponse(h, {
        message: 'Lagu berhasil ditambahkan ke playlist',
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

  async getSongsByPlaylistIdHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // server error
      return serverErrorResponse(h);
    }
  }

  async deleteSongsByPlaylistIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(id, credentialId);
      await this._service.deleteSongFromPlaylistBySongId(songId, id);

      return successResponse(h, {
        message: 'Lagu berhasil dihapus dari playlist',
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

module.exports = PlaylistsHandler;

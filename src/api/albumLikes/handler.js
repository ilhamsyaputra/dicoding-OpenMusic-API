const { successResponse } = require('../../utils/responseHandler');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.validateAlbumId(albumId);
    const isLiked = await this._service.checkIsLiked(userId, albumId);

    if (!isLiked) {
      await this._service.addAlbumLike(userId, albumId);

      return successResponse(h, {
        message: 'Berhasil menambahkan like pada album',
        responseCode: 201,
      });
    }

    await this._service.deleteAlbumLike(userId, albumId);

    return successResponse(h, {
      message: 'Berhasil membatalkan like pada album',
      responseCode: 201,
    });
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const data = await this._service.getNumberOfLikes(albumId);

    return successResponse(h, {
      data: {
        likes: data.rowCount,
      },
    }).header('X-Data-Source', data.source);
  }
}

module.exports = AlbumLikesHandler;

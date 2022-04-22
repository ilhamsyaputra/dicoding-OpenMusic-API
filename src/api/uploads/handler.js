const { successResponse } = require('../../utils/responseHandler');

class UploadsHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._validator = validator;
    this._albumService = albumService;

    this.postUploadAlbumCoverHandler = this.postUploadAlbumCoverHandler.bind(this);
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover: data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumService.updateCoverUrl(id, fileLocation);

    return successResponse(h, {
      message: 'Sampul berhasil diunggah',
      responseCode: 201,
    });
  }
}

module.exports = UploadsHandler;

const {
  PostPlaylistPayloadSchema,
  PostAddSongToPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePostPlaylistPayloadSchema: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostAddSongToPlaylistPayloadSchema: (payload) => {
    const validationResult = PostAddSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteSongFromPlaylistPayloadSchema: (payload) => {
    const validationResult = DeleteSongFromPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;

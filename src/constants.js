'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.DATA_DIR = `data`;
module.exports.FILE_NAME = `mocks.json`;
module.exports.CATEGORIES_FILE = `categories.txt`;
module.exports.SENTENCES_FILE = `sentences.txt`;
module.exports.TITLES_FILE = `titles.txt`;
module.exports.COMMENTS_FILE = `comments.txt`;
module.exports.ID_LENGTH = 6;
module.exports.OfferValidation = {
  Title: {
    MIN: 10,
    MAX: 100,
  },
  Description: {
    MIN: 50,
    MAX: 1000,
  },
  Price: {
    MIN: 100,
  }
};
module.exports.DefaultPort = {
  SERVICE: 3000,
  EXPRESS: 8080,
};

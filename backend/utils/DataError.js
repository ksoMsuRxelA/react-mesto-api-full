class DataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'validationError';
    this.statusCode = 400;
  }
}

module.exports = DataError;

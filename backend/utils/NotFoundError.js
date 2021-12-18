class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notFound';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

class UnauthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauth';
    this.statusCode = 401;
  }
}

module.exports = UnauthError;

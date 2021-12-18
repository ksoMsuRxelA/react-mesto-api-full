const jwt = require('jsonwebtoken');
const UnauthError = require('../utils/UnauthError');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthError(`Неавторизованный запрос...auth: ${authorization} and startWith: ${authorization.startsWith('Bearer')}`);
    }

    const token = authorization.replace('Bearer ', '');

    let payload = undefined;
    const { NODE_ENV, JWT_SECRET } = process.env;
    const secCode = NODE_ENV === 'production' ? JWT_SECRET : 'some-very-secret-code';
    try {
      payload = jwt.verify(token, secCode);
    } catch (err) {
      throw new UnauthError('Невалидный токен доступа к ресурсу.');
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

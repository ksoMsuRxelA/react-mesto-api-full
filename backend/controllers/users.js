const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DataError = require('../utils/DataError');
const NotFoundError = require('../utils/NotFoundError');
const UnauthError = require('../utils/UnauthError');
const ConflictError = require('../utils/ConflictError');

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует.'));
    }
    if (err.name === 'ValidationError' || err.name === 'Error') {
      next(new DataError(err.message));
    }
    next(err);
  }
};

const getAllUsers = (req, res, next) => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userById = await User.findById(userId);
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${userId} не был найден в базе.`);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new DataError(`Пользователь с идентификатором ${req.params.userId} не был найден.`));
    }
    next(err);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userById = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${req.user._id} не был найден и как результат не был обновлен.`);
  } catch (err) {
    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userById = await User.findOneAndUpdate({_id: req.user._id}, { avatar }, { new: true, runValidators: true });
    if (userById) {
      return res.status(200).send({ data: userById });
    }
    throw new NotFoundError(`Пользователь с идентификатором ${req.user._id} не был найден и как результат не был обновлен.`);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new DataError('Невалидная ссылка. Попробуйте еще раз.'));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthError('Неправильные email/password. Попробуйте еще раз.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthError('Неправильные email/password. Попробуйте еще раз.');
    }

    const { NODE_ENV, JWT_SECRET } = process.env;

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-very-secret-code',
      { expiresIn: '7d' },
    );
    
    return res.status(200).send({ 
      token: token,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => { // here we should think that we have user._id prop in req object.
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) {
      throw new UnauthError('Cначала авторизуйтесь.');
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  login,
  getCurrentUser,
};

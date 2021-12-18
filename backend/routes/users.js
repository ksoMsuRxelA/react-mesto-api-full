const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const joiObjectUserUpdate = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};

const joiObjectAvatarUpdate = {
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
  }),
};

// для этих роутов валидация данных не нужна так как они не содержат тела с данными
router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

// Здесь сделал валидацию как Вы и просили
router.patch('/users/me', celebrate(joiObjectUserUpdate), updateUserData);

// Здесь делаю такую валидацию
router.patch('/users/me/avatar', celebrate(joiObjectAvatarUpdate), updateUserAvatar);

module.exports = router;

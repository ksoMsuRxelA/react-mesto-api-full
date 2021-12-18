const Card = require('../models/Card');
const DataError = require('../utils/DataError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError(`Переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

const getAllCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError(`Карточка с идентификатором ${cardId} не была найдена и не удалена.`);
    }
    if (card.owner._id.toString() !== req.user._id) {
      throw new ForbiddenError('У Вас недостаточно прав чтобы удалить эту карточку.');
    }
    const cardById = await Card.findByIdAndRemove(cardId);
    if (cardById) {
      return res.status(200).send({ data: cardById });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new DataError(`Карточка с идентификатором ${req.params.cardId} не была найден и не удалена.`));
    }
    next(err);
  }
};

const putLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const unupdatedCard = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } });
    if (unupdatedCard.likes.includes(req.user._id)) {
      throw new DataError('Данный пользователь уже ставил лайк этой карточке.');
    } else {
      const updatedCard = await Card.findById(cardId);
      return res.status(200).send({ data: updatedCard });
    }
  } catch (err) { // все случаи ошибок из описания здесь описаны
    next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const unupdatedCard = await Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } });
    if (!unupdatedCard.likes.includes(req.user._id)) {
      throw new DataError('Данный пользователь не ставил лайк этой карточке.');
    } else {
      const updatedCard = await Card.findById(cardId);
      return res.status(200).send({ data: updatedCard });
    }
  } catch (err) { // все случаи ошибок из описания здесь описаны
    next(err);
  }
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  removeLike,
};

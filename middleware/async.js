// Функция asyncWrapper принимает в качестве аргумента другую функцию (middleware или контроллер Express).
const asyncWrapper = (fn) => {
  // Возвращает новую асинхронную функцию, принимающую req, res и next - стандартные параметры Express middleware.
  return async (req, res, next) => {
    try {
      // Вызывает переданную функцию fn с аргументами req, res и next с помощью await, чтобы обработать ее асинхронную логику.
      await fn(req, res, next);
    } catch (error) {
      // Если во время выполнения fn происходит ошибка, она передается в следующий middleware, обрабатывающий ошибки.
      next(error);
    }
  };
};

// Экспорт asyncWrapper, чтобы он мог быть использован в других частях приложения.
module.exports = asyncWrapper;
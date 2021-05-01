const {
  addListBooksHandler,
  getAllBooksHandler,
  getListBookByIdHandler,
  edtBookByIdHandler,
  deleteListBookById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addListBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getListBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: edtBookByIdHandler,

  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteListBookById,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak ditemukan',
  },
];

module.exports = routes;

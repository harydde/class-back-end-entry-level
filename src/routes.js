const {
  addListBooksHandler,
  getAllBooksHandler,
  getListBookByIdHandler,
  edtBookByIdHandler,
  deleteListBookById,
} = require('./handler');

const routes = [
  // method untuk menyimpan data(buku)
  {
    method: 'POST',
    path: '/books',
    handler: addListBooksHandler,
  },

  // method untuk menampilkan all_data(semua buku)
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },

  // method untuk menampilkan data by id ( detail buku)
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getListBookByIdHandler,
  },

  // method untuk mengubah data ( edit data buku)
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: edtBookByIdHandler,

  },

  // method untuk menghapus data
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

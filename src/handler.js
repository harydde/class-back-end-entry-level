/* eslint-disable no-const-assign */
const { nanoid } = require('nanoid');
const books = require('./books');

const addListBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;

  // Client tidak melampirkan properti namepada request body
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
      .code(400);

    return response;
  }

  // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);

    return response;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBooks);

  const isSuccess = books.filter((b) => b.id === id).length > 0;

  // Respon bila buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }
  // Server gagal memasukkan buku karena alasan umum (generic error)
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

// ======================================================================

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  if (!name && !reading && !finished) {
    // Response jika tidak ada query
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
      .code(200);

    return response;
  }

  if (name) {
    const bookName = books.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );

    // Response jika ada query name
    const response = h.response({
      status: 'success',
      data: {
        books: bookName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
      .code(200);

    return response;
  }

  if (reading) {
    const listBookReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: listBookReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
      .code(200);

    return response;
  }
  if (!reading) {
    const listBookUnReading = books.filter(
      (book) => Number(book.reading) !== Number(reading),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: listBookUnReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
      .code(200);

    return response;
  }

  const status = request.query.finished;
  if (status === 1) {
    status = true;
  } else if (status === 0) {
    status = false;
  }

  const listBooksFinished = books.filter(
    (book) => book.finished.status === finished.status,
  );

  const response = h.response({
    status: 'success',
    data: listBooksFinished.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  })
    .code(200);

  return response;
};

// ======================================================================

const getListBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    // Bila buku dengan id yang dilampirkan ditemukan
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);

  return response;
};

// ======================================================================

const edtBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    // Client tidak melampirkan properti name pada request body
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
      .code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);

    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    // Response apabila buku berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
      .code(200);
    return response;
  }

  // Response jika 'id' yang dilampirkan oleh client tidak ditemukkan oleh server
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
    .code(404);
  return response;
};

// ======================================================================

const deleteListBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    // Response jika 'id' dimiliki oleh salah satu buku
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
      .code(200);

    return response;
  }

  // Response jika 'id' yang dilampirkan tidak dimiliki oleh buku manapun
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
    .code(404);

  return response;
};

module.exports = {
  addListBooksHandler,
  getAllBooksHandler,
  getListBookByIdHandler,
  edtBookByIdHandler,
  deleteListBookById,
};

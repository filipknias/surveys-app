module.exports = (allDocumentsCount, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  if (endIndex < allDocumentsCount) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  return {
    ...pagination,
    startIndex,
  };
};

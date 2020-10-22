import React from "react";
// Bootstrap
import Pagination from "react-bootstrap/Pagination";

export default function PaginationTabs({
  currentPage,
  setCurrentPage,
  previousPage,
  nextPage,
}) {
  return (
    <Pagination>
      {previousPage !== null && (
        <Pagination.Item onClick={() => setCurrentPage(previousPage.page)}>
          {previousPage.page}
        </Pagination.Item>
      )}
      <Pagination.Item active>{currentPage}</Pagination.Item>
      {nextPage !== null && (
        <Pagination.Item onClick={() => setCurrentPage(nextPage.page)}>
          {nextPage.page}
        </Pagination.Item>
      )}
    </Pagination>
  );
}

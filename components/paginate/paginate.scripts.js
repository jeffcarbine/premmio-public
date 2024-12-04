import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const setPaginateValues = (paginate) => {
  const page = parseInt(paginate.dataset.page),
    totalPages = parseInt(paginate.dataset.totalPages),
    displayNumbersCount = parseInt(paginate.dataset.displayNumbersCount);

  // we need to set the corresponding li to active, and the previous two and next two lis with "prev1", "prev2", "next1", and "next2"
  // we also need to see if we are far enough away from the beginning or end to enable the .ellipses lis
  const lis = paginate.querySelectorAll("li");

  lis.forEach((li) => {
    // remove active, prev1, prev2, next1, next2, and visible classes
    li.classList.remove("active", "visible");

    const pageNumber = parseInt(li.dataset.page);

    if (pageNumber === page) {
      li.classList.add("active");
    }

    if (li.classList.contains("previous")) {
      // give the button a data-page attribute of one less than the current page
      // and if it is less than 1, set it to 1 and disable the button
      li.querySelector("button").dataset.page = Math.max(1, page - 1);

      if (page === 1) {
        li.classList.add("disabled");
      } else {
        li.classList.remove("disabled");
      }
    }

    if (li.classList.contains("next")) {
      // give the button a data-page attribute of one more than the current page
      // and if it is greater than the total pages, set it to the total pages and disable the button
      li.querySelector("button").dataset.page = Math.min(page + 1, totalPages);

      if (page === totalPages) {
        li.classList.add("disabled");
      } else {
        li.classList.remove("disabled");
      }
    }

    function isEllipsesVisible(li, page, totalPages) {
      const halfPageNumbers = Math.floor(displayNumbersCount / 2);
      return (
        li.classList.contains("ellipses") &&
        ((page > halfPageNumbers + 2 && li.classList.contains("first")) ||
          (page < totalPages - halfPageNumbers - 1 &&
            li.classList.contains("last"))) &&
        totalPages > displayNumbersCount
      );
    }

    function isPageNumberVisible(pageNumber, page, totalPages) {
      const halfPageNumbers = Math.floor(displayNumbersCount / 2);
      const startPage = Math.max(1, page - halfPageNumbers);
      const endPage = Math.min(totalPages, page + halfPageNumbers);

      return (
        pageNumber === 1 ||
        pageNumber === totalPages ||
        (pageNumber >= startPage && pageNumber <= endPage) ||
        (page <= halfPageNumbers && pageNumber <= displayNumbersCount) ||
        (page > totalPages - halfPageNumbers &&
          pageNumber > totalPages - displayNumbersCount)
      );
    }

    if (
      isEllipsesVisible(li, page, totalPages) ||
      isPageNumberVisible(pageNumber, page, totalPages)
    ) {
      li.classList.add("visible");
    }
  });
};

// get all paginates on screen
const paginates = document.querySelectorAll("[data-component='paginate']");

paginates.forEach((paginate) => {
  setPaginateValues(paginate);
});

addEventDelegate(
  "attributes:data-page",
  "[data-component='paginate']",
  setPaginateValues
);

const incrementPage = (button) => {
  const paginate = button.closest("[data-component='paginate']"),
    page = parseInt(paginate.dataset.page),
    totalPages = parseInt(paginate.dataset.totalPages);

  if (page < totalPages) {
    paginate.dataset.page = page + 1;
  }
};

addEventDelegate(
  "click",
  "[data-component='paginate'] button[data-direction='next']",
  incrementPage
);

const decrementPage = (button) => {
  const paginate = button.closest("[data-component='paginate']"),
    page = parseInt(paginate.dataset.page);

  if (page > 1) {
    paginate.dataset.page = page - 1;
  }
};

addEventDelegate(
  "click",
  "[data-component='paginate'] button[data-direction='previous']",
  decrementPage
);

const setPage = (button) => {
  const paginate = button.closest("[data-component='paginate']"),
    page = parseInt(button.dataset.page);

  paginate.dataset.page = page;
};

addEventDelegate("click", "[data-component='paginate'] a[data-page]", setPage);

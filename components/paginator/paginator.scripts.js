import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";

const setPaginatorValues = (paginator) => {
  const page = parseInt(paginator.dataset.page),
    limit = parseInt(paginator.dataset.limit) || 10,
    action = paginator.dataset.action,
    binding = paginator.dataset.binding,
    fields = paginator.dataset.fields?.split(",");

  const body = { page, limit };

  if (fields) {
    fields.forEach((field) => {
      const value = document.querySelector(`[name="${field}"]`).value;

      body[field] = value;
    });
  }

  paginator.setAttribute("disabled", true);

  const success = (request) => {
    // set the data-bind data
    const response = JSON.parse(request.response),
      data = { _id: binding, ...response };

    App.update(data);

    paginator.removeAttribute("disabled");
  };

  xhr({ path: action, body, success });
};

// get all paginators on screen
const paginators = document.querySelectorAll("[data-component='paginator']");

paginators.forEach((paginator) => {
  setPaginatorValues(paginator);
});

addEventDelegate(
  "attributes:data-page",
  "[data-component='paginator']",
  setPaginatorValues
);

const incrementPage = (button) => {
  const paginator = button.closest("[data-component='paginator']"),
    page = parseInt(paginator.dataset.page),
    totalPages = parseInt(paginator.dataset.totalPages);

  if (page < totalPages) {
    paginator.dataset.page = page + 1;
  }
};

addEventDelegate(
  "click",
  "[data-component='paginator'] button[data-direction='next']",
  incrementPage
);

const decrementPage = (button) => {
  const paginator = button.closest("[data-component='paginator']"),
    page = parseInt(paginator.dataset.page);

  if (page > 1) {
    paginator.dataset.page = page - 1;
  }
};

addEventDelegate(
  "click",
  "[data-component='paginator'] button[data-direction='previous']",
  decrementPage
);

const setPage = (button) => {
  const paginator = button.closest("[data-component='paginator']"),
    page = parseInt(button.dataset.page);

  paginator.dataset.page = page;
};

addEventDelegate("click", "[data-component='paginator'] a[data-page]", setPage);

const resetPaginator = () => {
  const paginator = document.querySelector("[data-component='paginator']");

  paginator.dataset.page = 1;
};

addEventDelegate("change", "select[data-reset-paginator]", resetPaginator);

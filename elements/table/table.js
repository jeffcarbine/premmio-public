function wrapTables() {
  let tables = document.querySelectorAll("table:not(.wrapped)");

  loop(tables, function(table) {
    wrapTable(table);
  });
}

function wrapTable(table) {
  let tableWrapper = document.createElement("div");
  tableWrapper.classList.add("table-wrapper");
  let parent = table.parentNode;
  parent.insertBefore(tableWrapper, table);
  tableWrapper.appendChild(table);
  table.classList.add("wrapped");
}

addEventDelegate("load", window, wrapTables);
//addEventDelegate("childList", "table:not(.wrapped)", wrapTable);

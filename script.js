const csvFile = "Cotizador.csv";

const state = {
  products: [],
  range: null,
  filters: {
    brainrot: "",
    mutation: "",
  },
  code: "",
};

const elements = {
  form: document.querySelector("#searchForm"),
  codeInput: document.querySelector("#codeInput"),
  status: document.querySelector("#statusMessage"),
  brainrotFilter: document.querySelector("#brainrotFilter"),
  mutationFilter: document.querySelector("#mutationFilter"),
  clearButton: document.querySelector("#clearButton"),
  resultCount: document.querySelector("#resultCount"),
  activeCode: document.querySelector("#activeCode"),
  grid: document.querySelector("#resultsGrid"),
  template: document.querySelector("#productTemplate"),
};

init();

async function init() {
  try {
    const response = await fetch(csvFile, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar el CSV.");

    const csvText = await response.text();
    state.products = parseCsv(csvText).map(normalizeProduct).filter((item) => item.name && Number.isFinite(item.filterValue));

    updateFilters();
    setStatus(`${state.products.length} productos cargados. Ingresa un codigo para buscar.`);
    render();
  } catch (error) {
    setStatus("No se pudo leer Cotizador.csv. Revisa que este en la misma carpeta que index.html.", true);
    console.error(error);
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = elements.codeInput.value.trim().toUpperCase();
  const range = getRangeFromCode(code);

  if (!range) {
    state.range = null;
    state.code = "";
    setStatus("Codigo incorrecto. Comunicate con TunTunTrade en TikTok para recibir un codigo correcto.", true);
    render();
    return;
  }

  state.range = range;
  state.code = code;
  elements.codeInput.value = code;
  setStatus("Busqueda aplicada.");
  render();
});

elements.codeInput.addEventListener("input", () => {
  elements.codeInput.value = elements.codeInput.value.toUpperCase();
});

elements.brainrotFilter.addEventListener("change", () => {
  state.filters.brainrot = elements.brainrotFilter.value;
  render();
});

elements.mutationFilter.addEventListener("change", () => {
  state.filters.mutation = elements.mutationFilter.value;
  render();
});

elements.clearButton.addEventListener("click", () => {
  state.range = null;
  state.code = "";
  state.filters.brainrot = "";
  state.filters.mutation = "";
  elements.codeInput.value = "";
  elements.brainrotFilter.value = "";
  elements.mutationFilter.value = "";
  setStatus(`${state.products.length} productos cargados. Ingresa un codigo para buscar.`);
  render();
});

function getRangeFromCode(code) {
  if (code.length !== 6) return null;

  const secondDigit = Number(code[1]);
  const fourthDigit = Number(code[3]);
  if (!Number.isInteger(secondDigit) || !Number.isInteger(fourthDigit)) return null;

  return {
    min: Math.min(secondDigit, fourthDigit),
    max: Math.max(secondDigit, fourthDigit),
  };
}

function render() {
  updateFilters();
  const filtered = getFilteredProducts();
  elements.resultCount.textContent = filtered.length;
  elements.activeCode.textContent = state.code || "Sin codigo";
  elements.grid.textContent = "";

  if (!state.range) {
    renderEmpty("Ingresa un codigo para ver los productos que coinciden.");
    return;
  }

  if (filtered.length === 0) {
    renderEmpty("No hay productos para ese codigo y filtros.");
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach((product) => {
    const card = elements.template.content.cloneNode(true);
    const image = card.querySelector("img");
    const imageWrap = card.querySelector(".image-wrap");
    image.src = product.image;
    image.alt = `${product.name} ${product.mutation}`;
    image.addEventListener("error", () => {
      image.remove();
      imageWrap.classList.add("has-image-error");
    });
    card.querySelector(".availability").textContent = product.availability || "Sin estado";
    card.querySelector("h2").textContent = product.name;
    card.querySelector(".mutation").textContent = product.mutation || "Sin mutacion";
    card.querySelector(".income").textContent = product.income || "-";
    fragment.append(card);
  });

  elements.grid.append(fragment);
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    const inRange = state.range ? product.filterValue >= state.range.min && product.filterValue <= state.range.max : false;
    const matchesBrainrot = !state.filters.brainrot || product.name === state.filters.brainrot;
    const matchesMutation = !state.filters.mutation || product.mutation === state.filters.mutation;
    return inRange && matchesBrainrot && matchesMutation;
  });
}

function renderEmpty(message) {
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = message;
  elements.grid.append(empty);
}

function updateFilters() {
  const rangeProducts = getRangeProducts();
  const brainrotValues = uniqueValues(rangeProducts.map((product) => product.name));

  if (state.filters.brainrot && !brainrotValues.includes(state.filters.brainrot)) {
    state.filters.brainrot = "";
  }

  fillSelect(elements.brainrotFilter, brainrotValues, "Todos");
  elements.brainrotFilter.value = state.filters.brainrot;

  const mutationSource = rangeProducts.filter((product) => !state.filters.brainrot || product.name === state.filters.brainrot);
  const mutationValues = uniqueValues(mutationSource.map((product) => product.mutation));

  if (state.filters.mutation && !mutationValues.includes(state.filters.mutation)) {
    state.filters.mutation = "";
  }

  fillSelect(elements.mutationFilter, mutationValues, "Todas");
  elements.mutationFilter.value = state.filters.mutation;
}

function getRangeProducts() {
  if (!state.range) return state.products;

  return state.products.filter((product) => product.filterValue >= state.range.min && product.filterValue <= state.range.max);
}

function fillSelect(select, values, defaultLabel) {
  select.textContent = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultLabel;
  select.append(defaultOption);

  values.forEach((value) => {
    if (!value) return;
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function uniqueValues(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));
}

function normalizeProduct(row) {
  return {
    name: getValue(row, ["Nombre Brainrot", "Nombre_Brainrot", "Nombre"]),
    mutation: getValue(row, ["Mutacion", "Mutación"]),
    income: getValue(row, ["Dinero por segundo", "Dinero_por_segundo"]),
    filterValue: parseFilterValue(getValue(row, ["Filtro", "Valor", "Clave"]) || Object.values(row)[3]),
    availability: getValue(row, ["Disponibilidad"]),
    image: getValue(row, ["Fotografia", "Fotografía", "Imagen", "Foto"]),
  };
}

function getValue(row, names) {
  for (const name of names) {
    const key = Object.keys(row).find((current) => normalizeHeader(current) === normalizeHeader(name));
    if (key) return row[key].trim();
  }
  return "";
}

function normalizeHeader(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseFilterValue(value) {
  return Number(String(value).replace(",", ".").trim());
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2,
  }).format(value);
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("is-error", isError);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  const headers = rows.shift() || [];
  return rows.map((values) =>
    headers.reduce((record, header, index) => {
      record[header.trim()] = values[index] || "";
      return record;
    }, {})
  );
}

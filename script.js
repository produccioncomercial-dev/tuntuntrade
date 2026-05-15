const csvFile = "Cotizador.csv";
const codeDigitMap = {
  A: "0",
  B: "1",
  C: "2",
  D: "3",
  E: "4",
  F: "5",
  G: "6",
  H: "7",
  I: "8",
  J: "9",
  O: ".",
};

const state = {
  products: [],
  range: null,
  pendingRange: null,
  pendingCode: "",
  filters: {
    brainrot: "",
    mutation: "",
  },
  code: "",
  customerName: "Anonimo",
  pendingCustomerName: "Anonimo",
  loadingTimer: null,
};

const elements = {
  entryView: document.querySelector("#entryView"),
  loadingView: document.querySelector("#loadingView"),
  resultsView: document.querySelector("#resultsView"),
  form: document.querySelector("#searchForm"),
  codeInput: document.querySelector("#codeInput"),
  status: document.querySelector("#statusMessage"),
  brainrotFilter: document.querySelector("#brainrotFilter"),
  mutationFilter: document.querySelector("#mutationFilter"),
  clearButton: document.querySelector("#clearButton"),
  newCodeButton: document.querySelector("#newCodeButton"),
  resultCount: document.querySelector("#resultCount"),
  activeCode: document.querySelector("#activeCode"),
  welcomeTitle: document.querySelector("#welcomeTitle"),
  catalogCode: document.querySelector("#catalogCode"),
  welcomeMessage: document.querySelector("#welcomeMessage"),
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
    setStatus("Ingresa tu codigo para obtener ofertas.");
    render();

    const routeData = getRouteData();
    const routeRange = routeData.code ? getRangeFromCode(routeData.code) : null;

    if (routeData.code && routeRange) {
      state.pendingRange = routeRange;
      state.pendingCode = routeData.code;
      state.pendingCustomerName = routeData.customerName;
      elements.codeInput.value = routeData.code;
      setStatus("Codigo recibido.");
      showLoadingThenResults();
    } else if (routeData.code) {
      setStatus("Codigo incorrecto. Comunicate con TunTunTrade en TikTok para recibir un codigo correcto.", true);
    }
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
    showView("entry");
    return;
  }

  state.pendingRange = range;
  state.pendingCode = code;
  state.pendingCustomerName = "Anonimo";
  elements.codeInput.value = code;
  setStatus("Codigo recibido.");
  showLoadingThenResults();
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
  state.filters.brainrot = "";
  state.filters.mutation = "";
  elements.brainrotFilter.value = "";
  elements.mutationFilter.value = "";
  render();
});

elements.newCodeButton.addEventListener("click", () => {
  resetSearch();
});

function resetSearch() {
  state.range = null;
  state.pendingRange = null;
  state.code = "";
  state.pendingCode = "";
  state.customerName = "Anonimo";
  state.pendingCustomerName = "Anonimo";
  state.filters.brainrot = "";
  state.filters.mutation = "";
  elements.codeInput.value = "";
  elements.brainrotFilter.value = "";
  elements.mutationFilter.value = "";
  setStatus("Ingresa tu codigo para obtener ofertas.");
  render();
  showView("entry");
  clearCodeFromUrl();
  elements.codeInput.focus();
}

function showLoadingThenResults() {
  if (state.loadingTimer) window.clearTimeout(state.loadingTimer);

  showView("loading");
  state.loadingTimer = window.setTimeout(() => {
    state.range = state.pendingRange;
    state.code = state.pendingCode;
    state.customerName = state.pendingCustomerName || "Anonimo";
    state.pendingRange = null;
    state.pendingCode = "";
    state.pendingCustomerName = "Anonimo";
    state.filters.brainrot = "";
    state.filters.mutation = "";
    setStatus("Busqueda aplicada.");
    render();
    showView("results");
  }, 3000);
}

function showView(viewName) {
  elements.entryView.classList.toggle("is-active", viewName === "entry");
  elements.loadingView.classList.toggle("is-active", viewName === "loading");
  elements.resultsView.classList.toggle("is-active", viewName === "results");
}

function getRouteData() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) || "";

  if (lastSegment.includes(".") || lastSegment.toLowerCase() === "tuntuntrade") {
    return { code: "", customerName: "Anonimo" };
  }

  const decodedSegment = decodeURIComponent(lastSegment).trim();
  const code = decodedSegment.slice(0, 8).toUpperCase();
  const customerName = sanitizeCustomerName(decodedSegment.slice(8));

  return { code, customerName };
}

function clearCodeFromUrl() {
  if (!window.history || !window.history.replaceState) return;

  const homePath = window.location.hostname.endsWith("github.io") ? "/tuntuntrade/" : "/";
  window.history.replaceState({}, "", homePath);
}

function getRangeFromCode(code) {
  if (code.length !== 8) return null;

  const firstValue = decodeCodeNumber(code.slice(1, 4));
  const secondValue = decodeCodeNumber(code.slice(4, 7));
  if (!Number.isFinite(firstValue) || !Number.isFinite(secondValue)) return null;

  return {
    min: Math.min(firstValue, secondValue),
    max: Math.max(firstValue, secondValue),
  };
}

function decodeCodeNumber(chunk) {
  let decoded = "";

  for (const character of chunk) {
    if (!Object.prototype.hasOwnProperty.call(codeDigitMap, character)) return null;
    decoded += codeDigitMap[character];
  }

  if (!/^\d+(\.\d*)?$/.test(decoded)) return null;
  return Number(decoded);
}

function render() {
  updateFilters();
  const filtered = getFilteredProducts();
  elements.resultCount.textContent = filtered.length;
  elements.activeCode.textContent = state.code || "Sin codigo";
  updatePersonalHeader();
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
    const mutation = card.querySelector(".mutation");
    mutation.textContent = product.mutation || "Sin mutacion";
    mutation.classList.add(getMutationClass(product.mutation));
    card.querySelector(".income").textContent = product.income || "-";
    fragment.append(card);
  });

  elements.grid.append(fragment);
}

function updatePersonalHeader() {
  const customerName = state.customerName || "Anonimo";
  const code = state.code || "";
  elements.welcomeTitle.innerHTML = `Bienvenido, <span class="customer-name">${customerName}</span>`;
  elements.catalogCode.innerHTML = code ? `Cat&aacute;logo &uacute;nico ${code}` : "Cat&aacute;logo &uacute;nico";
  elements.welcomeMessage.innerHTML = "Elige el brainrot que m&aacute;s te gusta y env&iacute;ame tu usuario por TikTok para coordinar el trade por m&aacute;quina.";
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

function getMutationClass(mutation) {
  const normalizedMutation = normalizeHeader(mutation).replace(/\s+/g, "-");
  const supportedMutations = new Set([
    "cursed",
    "divine",
    "rainbow",
    "normal",
    "oro",
    "diamante",
    "yin-yang",
    "radioactive",
    "galaxy",
    "lava",
    "candy",
    "bloodrot",
  ]);

  return supportedMutations.has(normalizedMutation) ? `mutation-${normalizedMutation}` : "mutation-default";
}

function sanitizeCustomerName(name) {
  const cleanName = name
    .replace(/[-_]+/g, " ")
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanName) return "Anonimo";

  return cleanName
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

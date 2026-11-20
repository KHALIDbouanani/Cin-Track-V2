import { getContents, createContent, updateContent, deleteContent } from "./api.js";
import { showLoader, showError } from "./ui.js";
import { isRequired, isValidYear, isValidImageUrl, parseCommaList } from "./validation.js";

const tbody = document.getElementById("affichage_body");
const statusDiv = document.getElementById("admin-status");

const formModal = document.getElementById("form-modal");
const formTitle = document.getElementById("form-title");
const form = document.getElementById("content-form");
const formSubmitBtn = document.getElementById("form-submit");

const titleInput = document.getElementById("f-title");
const imageInput = document.getElementById("f-image");
const typeSelect = document.getElementById("f-type");
const yearInput = document.getElementById("f-releaseYear");
const durationInput = document.getElementById("f-duration");
const seasonsInput = document.getElementById("f-seasons");
const genresInput = document.getElementById("f-genres");
const directorsInput = document.getElementById("f-directors");
const countriesInput = document.getElementById("f-countries");
const descriptionInput = document.getElementById("f-description");

const durationField = document.getElementById("field-duration");
const seasonsField = document.getElementById("field-seasons");

let Movies = [];
let editingId = null;

async function loadMovies() {
    try {
        showLoader(statusDiv, "Chargement des titres...");
        Movies = await getContents();
        statusDiv.innerHTML = "";
        renderTable(Movies);
    } catch (err) {
        showError(statusDiv, "Erreur lors du chargement : " + err.message);
    }
}

function renderTable(items) {
    tbody.innerHTML = "";

    items.forEach(function (movie) {
        const tr = document.createElement("tr");

        const tdImage = document.createElement("td");
        tdImage.className = "border-2 border-black p-2";
        const img = document.createElement("img");
        img.className = "w-12 h-auto object-cover";
        img.src = movie.image;
        img.alt = "Poster of " + movie.title;
        tdImage.appendChild(img);
        tr.appendChild(tdImage);

        const tdTitle = document.createElement("td");
        tdTitle.className = "border-2 border-black p-4 font-bold";
        tdTitle.textContent = movie.title;
        tr.appendChild(tdTitle);

        const tdType = document.createElement("td");
        tdType.className = "border-2 border-black p-4";
        tdType.textContent = movie.type;
        tr.appendChild(tdType);

        const tdYear = document.createElement("td");
        tdYear.className = "border-2 border-black p-4";
        tdYear.textContent = movie.releaseYear;
        tr.appendChild(tdYear);

        const tdActions = document.createElement("td");
        tdActions.className = "border-2 border-black p-2 space-x-2 whitespace-nowrap";

        const btnModifier = document.createElement("button");
        btnModifier.textContent = "Modifier";
        btnModifier.className = "border p-2 rounded-xl bg-blue-400 hover:bg-blue-500 cursor-pointer";
        btnModifier.addEventListener("click", function () {
            openForm(movie);
        });

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.className = "border p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white cursor-pointer";
        btnSupprimer.addEventListener("click", function () {
            handleDelete(movie, btnSupprimer);
        });

        tdActions.appendChild(btnModifier);
        tdActions.appendChild(btnSupprimer);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function updateFieldsVisibility() {
    const type = typeSelect.value;

    if (type === "movie") {
        durationField.classList.remove("hidden");
        seasonsField.classList.add("hidden");
    } else if (type === "series") {
        durationField.classList.add("hidden");
        seasonsField.classList.remove("hidden");
    } else {
        durationField.classList.add("hidden");
        seasonsField.classList.add("hidden");
    }
}

typeSelect.addEventListener("change", updateFieldsVisibility);

function clearErrors() {
    document.querySelectorAll(".error").forEach(function (el) {
        el.textContent = "";
        el.classList.add("hidden");
    });
}

function showFieldError(field, message) {
    const el = document.getElementById("error-" + field);
    el.textContent = message;
    el.classList.remove("hidden");
}

function openForm(movie) {
    clearErrors();
    form.reset();

    if (movie) {
        editingId = movie.id;
        formTitle.textContent = "Modifier le titre";
        formSubmitBtn.textContent = "Enregistrer";
        formSubmitBtn.className = "px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer";

        titleInput.value = movie.title;
        imageInput.value = movie.image;
        typeSelect.value = movie.type;
        yearInput.value = movie.releaseYear;
        genresInput.value = movie.genres.join(", ");
        directorsInput.value = movie.directors.join(", ");
        countriesInput.value = movie.productionCountries.join(", ");
        descriptionInput.value = movie.description;

        if (movie.type === "movie") {
            durationInput.value = movie.duration;
        } else if (movie.type === "series") {
            seasonsInput.value = movie.seasons.length;
        }
    } else {
        editingId = null;
        formTitle.textContent = "Ajouter un titre";
        formSubmitBtn.textContent = "Ajouter";
        formSubmitBtn.className = "px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold cursor-pointer";
    }

    updateFieldsVisibility();
    formModal.classList.remove("hidden");
}

function closeForm() {
    formModal.classList.add("hidden");
    editingId = null;
}

document.getElementById("form-close").addEventListener("click", closeForm);
document.getElementById("form-cancel").addEventListener("click", closeForm);
document.getElementById("btn-add").addEventListener("click", function () {
    openForm(null);
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    const title = titleInput.value.trim();
    const image = imageInput.value.trim();
    const type = typeSelect.value;
    const year = yearInput.value.trim();
    const genres = parseCommaList(genresInput.value);
    const directors = parseCommaList(directorsInput.value);
    const countries = parseCommaList(countriesInput.value);
    const description = descriptionInput.value.trim();

    let hasError = false;

    if (!isRequired(title)) {
        showFieldError("title", "Le titre est obligatoire.");
        hasError = true;
    }
    if (!isRequired(image)) {
        showFieldError("image", "L'URL de l'image est obligatoire.");
        hasError = true;
    } else if (!isValidImageUrl(image)) {
        showFieldError("image", "URL invalide (doit commencer par http:// ou https://).");
        hasError = true;
    }
    if (type !== "movie" && type !== "series") {
        showFieldError("type", "Choisissez un type.");
        hasError = true;
    }
    if (!isValidYear(year)) {
        showFieldError("releaseYear", "Année entre 1900 et " + new Date().getFullYear() + ".");
        hasError = true;
    }
    if (genres.length === 0) {
        showFieldError("genres", "Au moins un genre.");
        hasError = true;
    }
    if (directors.length === 0) {
        showFieldError("directors", "Au moins un réalisateur.");
        hasError = true;
    }
    if (countries.length === 0) {
        showFieldError("productionCountries", "Au moins un pays.");
        hasError = true;
    }
    if (!isRequired(description)) {
        showFieldError("description", "La description est obligatoire.");
        hasError = true;
    }

    const data = {
        title: title,
        image: image,
        type: type,
        releaseYear: Number(year),
        genres: genres,
        directors: directors,
        productionCountries: countries,
        description: description
    };

    if (type === "movie") {
        const d = Number(durationInput.value);
        if (!d || d <= 0) {
            showFieldError("duration", "Durée en minutes (> 0).");
            hasError = true;
        } else {
            data.duration = d;
        }
    } else if (type === "series") {
        const n = Number(seasonsInput.value);
        if (!n || n < 1) {
            showFieldError("seasons", "Nombre de saisons (≥ 1).");
            hasError = true;
        } else {
            const seasons = [];
            for (let i = 0; i < n; i++) {
                seasons.push(i + 1);
            }
            data.seasons = seasons;
        }
    }

    if (hasError) return;

    const wasEditing = editingId !== null;
    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = "Envoi...";

    try {
        if (wasEditing) {
            const updated = await updateContent(editingId, data);
            Movies = Movies.map(function (m) {
                if (m.id == editingId) return updated;
                return m;
            });
            closeForm();
            renderTable(Movies);
            showSuccess("« " + title + " » a été modifié.");
        } else {
            const created = await createContent(data);
            Movies.push(created);
            closeForm();
            renderTable(Movies);
            showSuccess("« " + title + " » a été ajouté.");
        }
    } catch (err) {
        showError(statusDiv, "Erreur : " + err.message);
    }

    formSubmitBtn.disabled = false;
    if (wasEditing) {
        formSubmitBtn.textContent = "Enregistrer";
    } else {
        formSubmitBtn.textContent = "Ajouter";
    }
});

async function handleDelete(movie, button) {
    if (!confirm("Supprimer « " + movie.title + " » ?")) return;

    button.disabled = true;
    button.textContent = "Suppression...";

    try {
        await deleteContent(movie.id);
        Movies = Movies.filter(function (m) {
            return m.id != movie.id;
        });
        renderTable(Movies);
        showSuccess("« " + movie.title + " » a été supprimé.");
    } catch (err) {
        showError(statusDiv, "Erreur : " + err.message);
        button.disabled = false;
        button.textContent = "Supprimer";
    }
}

function showSuccess(message) {
    statusDiv.innerHTML = '<p class="text-green-600 font-semibold">' + message + '</p>';
    setTimeout(function () {
        statusDiv.innerHTML = "";
    }, 3000);
}

loadMovies();
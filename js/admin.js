import { getContents, deleteContent } from "./api.js";
import { showLoader, showError } from "./ui.js";

const tbody = document.getElementById("affichage_body");
const statusDiv = document.getElementById("admin-status");

let Movies = [];

async function loadMovies() {
    try {
        showLoader(statusDiv, "Chargement des titres...");
        Movies = await getContents();
        statusDiv.innerHTML = "";
        renderTable(Movies);
    } catch (err) {
        showError(statusDiv, `Erreur lors du chargement : ${err.message}`);
    }
}

function renderTable(Movies) {
    tbody.innerHTML = "";

    Movies.forEach((movie) => {
        const tr = document.createElement("tr");

        const Image = document.createElement("td");
        Image.className = "border-2 border-black p-2";
        const image = document.createElement("img");
        image.className = "w-12 h-auto object-cover";
        image.setAttribute("src", movie.image);
        image.setAttribute("alt", `Poster of ${movie.title}`);
        Image.append(image);
        tr.append(Image);

        const Title = document.createElement("td");
        Title.className = "border-2 border-black p-4 font-bold";
        Title.textContent = movie.title;
        tr.append(Title);

        const Type = document.createElement("td");
        Type.className = "border-2 border-black p-4";
        Type.textContent = movie.type;
        tr.append(Type);

        const Year = document.createElement("td");
        Year.className = "border-2 border-black p-4";
        Year.textContent = movie.releaseYear;
        tr.append(Year);

        const Actions = document.createElement("td");
        Actions.className = "border-2 border-black p-2 space-x-2";

        const btnModifier = document.createElement("button");
        btnModifier.textContent = "Modifier";
        btnModifier.className = "border p-2 rounded-xl bg-blue-400 hover:bg-blue-500";
        btnModifier.addEventListener("click", () => {
            console.log(`modifier l'id : ${movie.id}`);
        });

        const btnSupprimer = document.createElement("button");
        btnSupprimer.textContent = "Supprimer";
        btnSupprimer.className = "border p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white";
        btnSupprimer.addEventListener("click", () => {
            handleDelete(movie, btnSupprimer);
        });

        Actions.append(btnModifier, btnSupprimer);
        tr.append(Actions);

        tbody.append(tr);
    });
}

async function handleDelete(movie, button) {
    if (!confirm(`Supprimer « ${movie.title} » ?`)) return;

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Suppression...";
    button.classList.add("opacity-60", "cursor-not-allowed");

    try {
        await deleteContent(movie.id);

        Movies = Movies.filter((i) => i.id != movie.id);
        renderTable(Movies);

        statusDiv.innerHTML = `<p class="text-green-600 font-semibold">« ${movie.title} » a été supprimé.</p>`;
        setTimeout(() => {
            if (statusDiv.firstElementChild?.classList.contains("text-green-600")) {
                statusDiv.innerHTML = "";
            }
        }, 3000);
    } catch (err) {
        showError(statusDiv, `Erreur lors de la suppression : ${err.message}`);
        button.disabled = false;
        button.textContent = originalText;
        button.classList.remove("opacity-60", "cursor-not-allowed");
    }
}

loadMovies();
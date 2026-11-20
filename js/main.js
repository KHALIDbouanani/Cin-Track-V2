import {getContents} from './api.js';
import { initRendering, handleFilter } from './filtrage.js'; 
import { renderSidebarFavorites } from './favorites.js';
import { showLoader, showError } from "./ui.js";

const affichage = document.getElementById("affichage");
const pagination = document.getElementById("pagination");

async function loadCatalogue() {
    try {
        showLoader(affichage, "Chargement du catalogue...");
        pagination.innerHTML = "";

        const movies = await getContents();
        initRendering(movies);
        renderSidebarFavorites();

        handleFilter();
    } catch (err) {
        showError(affichage, `Impossible de charger le catalogue : ${err.message}`);
    }
}

loadCatalogue();

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", handleFilter);

const categoryButtons = document.querySelectorAll('#choix li');
categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        categoryButtons.forEach(btn => {
            btn.classList.remove('bg-red-600', 'active-filter');
            btn.classList.add('bg-gray-500');
        });

        e.target.classList.remove('bg-gray-500');
        e.target.classList.add('bg-red-600', 'active-filter');

        handleFilter();
    });
});

const menuBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-sidebar-btn');
const sidebar = document.getElementById('favorites-sidebar');

function openSidebar(){
    sidebar.classList.remove('translate-x-full');
    sidebar.classList.add('translate-x-0');
}

function closeSidebar(){
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('translate-x-full');
}

menuBtn.addEventListener('click',openSidebar)
closeBtn.addEventListener('click',closeSidebar)
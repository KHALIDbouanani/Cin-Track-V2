export function showLoader(container, message = "Chargement...") {
    if (!container) return;
    container.innerHTML = `<p class="col-span-full text-center text-lg text-gray-400 p-6 animate-pulse">${message}</p>`;
}

export function showError(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="col-span-full text-center text-lg border border-red-600 bg-red-100 text-red-600 rounded p-4 font-semibold">${message}</p>`;
}

export function clearContainer(container) {
    if (!container) return;
    container.innerHTML = '';
}
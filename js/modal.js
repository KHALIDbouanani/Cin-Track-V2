import { getComments, createComment } from './api.js';

const modal = document.getElementById('movie-modal');
const closeModalBtn = document.getElementById('close-modal');

const image = document.getElementById('modal-image');
const title = document.getElementById('modal-title');
const type = document.getElementById('modal-type');
const year = document.getElementById('modal-year');
const duration = document.getElementById('modal-duration');
const genres = document.getElementById('modal-genres');
const directors = document.getElementById('modal-directors');
const countries = document.getElementById('modal-countries');
const description = document.getElementById('modal-description');
const watchBtn = document.getElementById('modal-watch-btn');

const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const commentAuthor = document.getElementById('comment-author');
const commentText = document.getElementById('comment-text');
const commentError = document.getElementById('comment-error');

let currentItem = null;

export function openModal(id, items) {
    const item = items.find(i => i.id === id);
    
    currentItem = item;
    
    image.src = item.image;
    title.textContent = item.title;
    type.textContent = item.type;
    year.textContent = item.releaseYear;
    
    if (item.type === 'movie') {
        duration.textContent = `${item.duration} min`;
    } else if (item.type === 'series') {
        duration.textContent = `${item.seasons.length} Saison(s)`;
    }
    
    genres.textContent = item.genres.join(', ');
    directors.textContent = item.directors.join(', ');
    countries.textContent = item.productionCountries.join(', ');
    description.textContent = item.description;
    
    const index = items.findIndex(i => i.id === id);
    watchBtn.href = legal_links[index];
    
    commentAuthor.value = localStorage.getItem('cinetrack_pseudo') || '';
    commentText.value = '';
    commentError.classList.add('hidden');
    
    modal.classList.remove('hidden');
    loadComments(item);
}

export function closeModal() {
    modal.classList.add('hidden');
    currentItem = null;
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

async function loadComments(item) {
    commentsList.innerHTML = '<p class="text-gray-400">Chargement...</p>';
    try {
        const all = await getComments();
        const comments = all.filter(c => c.contentId == item.id);
        renderComments(comments);
    } catch (error) {
        commentsList.innerHTML = '<p class="text-red-400">Erreur de chargement.</p>';
    }
}

function renderComments(comments) {
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-400">Aucun commentaire.</p>';
        return;
    }
    commentsList.innerHTML = '';
    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'bg-gray-700 rounded p-2';
        
        const author = document.createElement('p');
        author.className = 'font-semibold text-red-400';
        author.textContent = c.author;
        
        const date = document.createElement('p');
        date.className = 'text-xs text-gray-400';
        date.textContent = new Date(c.createdAt).toLocaleDateString();
        
        const text = document.createElement('p');
        text.textContent = c.text;
        
        div.append(author, date, text);
        commentsList.append(div);
    });
}

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentItem) return;
    
    const author = commentAuthor.value.trim();
    const text = commentText.value.trim();
    
    if (author === '' || text === '') {
        commentError.textContent = 'Nom et texte sont obligatoires.';
        commentError.classList.remove('hidden');
        return;
    }
    commentError.classList.add('hidden');
    
    try {
        await createComment({
            contentId: String(currentItem.id),
            author: author,
            text: text,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('cinetrack_pseudo', author);
        commentText.value = '';
        loadComments(currentItem);
    } catch (error) {
        commentError.textContent = 'Erreur : ' + error.message;
        commentError.classList.remove('hidden');
    }
});

const legal_links = ['https://1hd.one/movie/inception-06388/',
'https://1hd.one/series/breaking-bad-18349/',
'https://1hd.one/movie/the-dark-knight-49515/',
'https://1hd.one/series/game-of-thrones-94361/',
'https://1hd.one/movie/interstellar-15767/',
'https://1hd.one/series/stranger-things-55226/',
'https://1hd.one/movie/the-shawshank-redemption-87960/',
'https://1hd.one/series/friends-69053/',
'https://1hd.one/series/the-crown-39131/',
'https://1hd.one/movie/fight-club-28480/',
'https://1hd.one/series/money-heist-76868/',
'https://1hd.one/movie/the-matrix-04998/',
'https://1hd.one/series/dark-65532/',
'https://1hd.one/movie/forrest-gump-61353/',
'https://1hd.one/series/chernobyl-33645/',
'https://1hd.one/movie/parasite-60719/',
'https://1hd.one/series/sherlock-13439/',
'https://1hd.one/movie/joker-25077/',
'https://1hd.one/series/the-witcher-13647/',
'https://1hd.one/movie/gladiator-70702/',
'https://1hd.one/series/squid-game-75710/',
'https://1hd.one/movie/titanic-07277/',
'https://1hd.one/series/peaky-blinders-07941/',
'https://1hd.one/movie/the-godfather-94668/',
'https://1hd.one/series/the-last-of-us-06251/',
'https://1hd.one/movie/spirited-away-89058/',
'https://1hd.one/series/wednesday-95392/',
'https://1hd.one/movie/oppenheimer-51311/',
'https://1hd.one/series/arcane-28622/']
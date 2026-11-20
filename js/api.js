export const BASE_URL = "https://6afaea62730c1d152f32bc04.mockapi.io/api/v1";

export async function request(path, options = {}) {
    const res = await fetch(BASE_URL + path, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json();
}

export const getContents = () => request("/contents");

export const createContent = (data) =>
    request("/contents", { method: "POST", body: JSON.stringify(data) });

export const updateContent = (id, data) =>
    request(`/contents/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteContent = (id) =>
    request(`/contents/${id}`, { method: "DELETE" });

export const getComments = () => request("/comments");

export const createComment =(data) =>
    request("/comments",{ method: "POST", body: JSON.stringify(data) });

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
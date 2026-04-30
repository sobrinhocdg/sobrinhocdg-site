// Dados do sobrinhocdg (baseado nas URLs oficiais)
const artistData = {
    name: "Sobrinho CDG",
    realName: "Harrison Sobrinho",
    nicknames: ["Pai do Evil Plugg", "Slimesito do Glicério"],
    genre: "PluggnB / Hyperpop",
    city: "São Paulo",
    story: "Um artista brasileiro proeminente na cena do pluggnB e do hyperpop. Sua música combina instrumentais atmosféricos, batidas suaves e letras introspectivas, muitas vezes influenciadas pela cultura digital e estética underground.",
    notableReleases: [
        { title: "Dr. Raul7, The Evil Plug!", year: 2023, type: "Single" },
        { title: "Melancolic (Pacify Her Remix)", year: 2017, type: "Single" },
        { title: "Fr 4ever Plug", year: 2023, type: "Album" },
        { title: "Real Stalkerplugg 33", year: 2024, type: "EP" },
        { title: "O Pai do Evil Plugg, Vol. 1", year: 2024, type: "Album" },
        { title: "Fr 4Ever Plug Ultimate Edition", year: 2025, type: "Album" }
    ],
    links: {
        spotify: "https://open.spotify.com/intl-pt/artist/0W7TU9JHKp1xmE89QuxNzI",
        youtube: "https://www.youtube.com/channel/UCpjbMzQCkbO2FQ18Vpva2aw"
    }
};

// Renderiza Lore
function renderLore() {
    return `
        <div class="card" style="border-left: 5px solid var(--accent1);">
            <h3>biografia oficial</h3>
            <p>${artistData.story}</p>
            <p><strong>Nomes:</strong> ${artistData.nicknames.join(' & ')}</p>
            <p><strong>Local:</strong> ${artistData.city}, Brasil</p>
        </div>
    `;
}

// Renderiza Músicas
function renderMusic() {
    return artistData.notableReleases.map(r => `
        <div class="card">
            <h3>${r.title}</h3>
            <p>${r.type} • ${r.year}</p>
            <a href="${artistData.links.spotify}?q=${encodeURIComponent(r.title)}" target="_blank">▶️ ESCUTAR NO SPOTIFY</a>
        </div>
    `).join('');
}

// Renderiza Vídeos YouTube
function renderVideo() {
    const channelId = 'UCpjbMzQCkbO2FQ18Vpva2aw';
    return `
        <div class="card">
            <h3>canal oficial</h3>
            <iframe width="100%" height="250" src="https://www.youtube.com/embed/videoseries?list=UU${channelId.substring(2)}" title="Canal Sobrinho CDG" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <a href="${artistData.links.youtube}" target="_blank">👉 ACESSAR CANAL NO YOUTUBE</a>
        </div>
    `;
}

// Renderiza Projetos
function renderProjects() {
    return `
        <div class="card">
            <h3>outros negócios</h3>
            <p>Comunidades underground, coletivos, produtores colaborativos</p>
            <p>✅ Em breve no site.</p>
        </div>
    `;
}

// Inicializar
(async () => {
    document.getElementById('lista-lore').innerHTML = renderLore();
    document.getElementById('lista-musicas').innerHTML = renderMusic();
    document.getElementById('lista-videos').innerHTML = renderVideo();
    document.getElementById('lista-projetos').innerHTML = renderProjects();

    console.log('✅ Site do Sobrinho CDG carregado!');
    console.log('🔗 Links oficiais:');
    console.log('Spotify:', artistData.links.spotify);
    console.log('YouTube:', artistData.links.youtube);
})();

const fs = require('fs');
const fetch = require('node-fetch'); // se der erro, vou usar fetch nativo

// URLs oficiais
const spotifyArtistId = '0W7TU9JHKp1xmE89QuxNzI';
const spotifyUrl = `https://open.spotify.com/intl-pt/artist/${spotifyArtistId}`;
const youtubeChannelId = 'UCpjbMzQCkbO2FQ18Vpva2aw';
const youtubeUrl = `https://www.youtube.com/channel/${youtubeChannelId}`;

async function scrapeSpotify() {
    console.log('🎵 Buscando Spotify...');
    try {
        // Usar o site do Spotify (página do artista tem dados triviais, mas não streams diretos)
        // Vamos usar o MusicMetricsVault para dados de streams
        const res = await fetch('https://www.musicmetricsvault.com/artists/sobrinhocdg/0W7TU9JHKp1xmE89QuxNzI', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });

        if (!res.ok) throw new Error(`Spotify/MusicMetricsVault HTTP ${res.status}`);

        const html = await res.text();
        console.log('✅ Spotify/MusicMetricsVault HTML recebido');

        // Extrair dados de streams (ex: "Total Plays: 1.2M" ou "Monthly Listeners: 45k")
        let totalPlays = '0';
        let monthlyListeners = '0';
        let topTracks = [];

        // Captura simples de números
        const playsMatch = html.match(/Total Plays[:\s]+([\d,.]+)\s*(milhões|mil|bilhões)?/i);
        if (playsMatch) totalPlays = playsMatch[0];

        const listenersMatch = html.match(/Monthly Listeners[:\s]+([\d,.]+)\s*(mil)?/i);
        if (listenersMatch) monthlyListeners = listenersMatch[0];

        // Top Tracks (ex: "<strong>Dr. Raul7</strong> - 250k plays")
        const trackMatches = html.matchAll(/<strong>([^<]+)<\/strong>[\s\S]*?([\d,.]+)\s*(k|M)?\s*plays?/gi);
        for (const match of trackMatches) {
            topTracks.push({ title: match[1], plays: match[0] });
        }

        return { totalPlays, monthlyListeners, topTracks };
    } catch (error) {
        console.log('⚠️ Spotify/MusicMetricsVault não deu: ', error.message);
        return null;
    }
}

async function scrapeYouTube() {
    console.log('📺 Buscando YouTube...');
    try {
        const res = await fetch(youtubeUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });

        if (!res.ok) throw new Error(`YouTube HTTP ${res.status}`);

        const html = await res.text();
        console.log('✅ YouTube HTML recebido');

        let subscribers = '0';
        let totalViews = '0';
        let videoCount = '0';
        let description = '';

        // Captura de inscritos (ex: "32.1K inscritos")
        const subsMatch = html.match(/([\d,.]+)\s*inscritos/i);
        if (subsMatch) subscribers = subsMatch[0];

        // Visualizações totais do canal
        const viewsMatch = html.match(/([\d,.]+)\s*visualizações/i);
        if (viewsMatch) totalViews = viewsMatch[0];

        // Contagem de vídeos
        const videosMatch = html.match(/([\d,.]+)\s*vídeos/i);
        if (videosMatch) videoCount = videosMatch[0];

        // Descrição do canal (meta),
        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        if (descMatch) description = descMatch[1];

        return { subscribers, totalViews, videoCount, description };
    } catch (error) {
        console.log('⚠️ YouTube não deu: ', error.message);
        return null;
    }
}

(async () => {
    console.log('🚀 Iniciando scrape completo de Sobrinho CDG...');

    const [spotifyData, youtubeData] = await Promise.all([
        scrapeSpotify(),
        scrapeYouTube()
    ]);

    // Construir o objeto final
    const finalData = {
        artist: "Sobrinho CDG",
        realName: "Harrison Sobrinho",
        nicknames: ["Pai do Evil Plugg", "Slimesito do Glicério"],
        genre: "PluggnB / Hyperpop / Brasil Alternative",
        city: "São Paulo",
        story: "Sobrinho CDG é uma figura proeminente na cena do pluggnB e do hyperpop brasileiro. Sua música combina instrumentais atmosféricos, batidas suaves e letras introspectivas, muitas vezes influenciadas pela cultura digital e estética underground.",
        spotify: {
            url: 'https://open.spotify.com/intl-pt/artist/0W7TU9JHKp1xmE89QuxNzI',
            ...spotifyData
        },
        youtube: {
            url: 'https://www.youtube.com/channel/UCpjbMzQCkbO2FQ18Vpva2aw',
            ...youtubeData
        },
        notableReleases: [
            { title: "Dr. Raul7, The Evil Plug!", year: 2023, type: "Single" },
            { title: "Melancolic (Pacify Her Remix)", year: 2017, type: "Single" },
            { title: "Fr 4ever Plug", year: 2023, type: "Album" },
            { title: "Real Stalkerplugg 33", year: 2024, type: "EP" },
            { title: "O Pai do Evil Plugg, Vol. 1", year: 2024, type: "Album" },
            { title: "Fr 4Ever Plug Ultimate Edition", year: 2025, type: "Album" }
        ],
        scrapedAt: new Date().toISOString()
    };

    console.log('✅ Dados coletados:');
    console.log(JSON.stringify(finalData, null, 2));

    // Salvar
    fs.writeFileSync('artist-data.json', JSON.stringify(finalData, null, 2));
    console.log('💾 Salvo em artist-data.json');

    // Gerar o site HTML com dados reais
    generateSite(finalData);
})();

// Gerar o index.html com dados reais
function generateSite(data) {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔴 Sobrinho CDG | Pai do Evil Plugg</title>
    <meta name="description" content="${data.story}">
    <style>
        body { background: #0d0d0d; color: #e0e0e0; font-family: 'Courier New', monospace; margin: 0; padding: 0; }
        .header { text-align: center; padding: 60px 20px; background: linear-gradient(45deg, #000, #1a0a1a); }
        .header h1 { font-size: 4rem; color: #ff0055; text-transform: uppercase; letter-spacing: 10px; margin: 0; }
        .nav { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }
        .nav a { color: #fff; text-decoration: none; padding: 10px 25px; background: #00eaff; border-radius: 50px; font-weight: bold; }
        .section { padding: 60px 20px; max-width: 1200px; margin: 0 auto; }
        h2 { text-align: center; font-size: 2.5rem; color: #00eaff; margin-bottom: 40px; text-transform: uppercase; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
        .card { background: #1a0b1a; border-radius: 15px; padding: 20px; border: 1px solid #ff0055; }
        .card h3 { color: #ff9900; margin-top: 0; }
        .card p { color: #ccc; }
        .card a { display: block; margin-top: 10px; color: #00eaff; text-decoration: none; font-weight: bold; }
        footer { text-align: center; padding: 40px; background: #000; border-top: 3px solid #00eaff; }
        footer span { color: #ff9900; font-size: 1.5rem; }
    </style>
</head>
<body>
    <header class="header">
        <h1>🔴 Sobrinho CDG</h1>
        <p>Pai do Evil Plugg & Slimesito do Glicério</p>
        <nav class="nav">
            <a href="#musica">Músicas</a>
            <a href="#videos">YouTube</a>
            <a href="#projetos">Projetos</a>
            <a href="#lore">Lore</a>
        </nav>
    </header>

    <section id="lore" class="section">
        <h2>a origem da lenda</h2>
        <div class="grid">
            <div class="card">
                <h3>biografia oficial</h3>
                <p>${data.story}</p>
                <p><strong>Nomes:</strong> ${data.nicknames.join(' & ')}</p>
                <p><strong>Local:</strong> São Paulo, Brasil</p>
            </div>
        </div>
    </section>

    <section id="musica" class="section">
        <h2>estoque atual</h2>
        <div class="grid">
            <div class="card">
                <h3>spotify</h3>
                <p>Artista oficial: ${data.spotify.url}</p>
                ${data.spotify.totalPlays ? `<p>>Total Plays: ${data.spotify.totalPlays}</p>` : ''}
                ${data.spotify.monthlyListeners ? `<p>>Listeners Mensais: ${data.spotify.monthlyListeners}</p>` : ''}
                ${data.spotify.topTracks && data.spotify.topTracks.length ? `<p>Top Tracks: ${data.spotify.topTracks.map(t => t.title).join(', ')}</p>` : ''}
            </div>
        </div>
    </section>

    <section id="videos" class="section">
        <h2>clipes oficiais</h2>
        <div class="grid">
            <div class="card">
                <h3>canal oficial</h3>
                <p>${data.youtube.url}</p>
                ${data.youtube.subscribers ? `<p>Inscritos: ${data.youtube.subscribers}</p>` : ''}
                ${data.youtube.totalViews ? `<p>Visualizações: ${data.youtube.totalViews}</p>` : ''}
                ${data.youtube.videoCount ? `<p>Vídeos: ${data.youtube.videoCount}</p>` : ''}
            </div>
        </div>
    </section>

    <section id="projetos" class="section">
        <h2>outros negócios</h2>
        <div class="grid">
            <div class="card">
                <h3>comunidades underground</h3>
                <p>Coletivos, produtores, estúdios colaborativos</p>
            </div>
        </div>
    </section>

    <footer>
        <p>🎯 streams totais: <span id="stream-total">Aguardando conexão com dados em tempo real...</span></p>
        <p>&copy; Sobrinho CDG - Tudo para o povo</p>
    </footer>
</body>
</html>`;

    fs.writeFileSync('index.html', html);
    console.log('✅ index.html gerado com dados reais!');
}

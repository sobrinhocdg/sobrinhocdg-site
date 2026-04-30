const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const artistName = 'SobrinhoCDG';
const url = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

async function scrapeLastFm() {
    try {
        console.log(`🔗 Acessando: ${url}`);
        
        // Requisição com headers de um navegador real (Chrome)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        });
        
        if (!response.ok) throw new Error(`Falha HTTP: ${response.status}`);
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // --- Extrair dados do DOM ---
        // Bio do artista
        const bioSection = doc.querySelector('.content-body');
        const bio = bioSection ? bioSection.innerText.trim().slice(0, 500) : '';

        // Listeners (é um número pequeno com ' listeners')
        const listenersSpan = doc.querySelector('.content-header .content-header__secondary');
        let listeners = '0';
        if (listenersSpan) {
            const matches = listenersSpan.innerText.match(/([\d.]+)\s*listeners/i);
            if (matches) listeners = matches[0].replace(/\s*listeners/i, '');
        }

        // Tags / Gêneros
        const tags = [];
        doc.querySelectorAll('.tags-list a').forEach(tag => tags.push(tag.innerText.trim()));

        // Top Tracks
        const tracks = [];
        doc.querySelectorAll('.chart-list .chart-list__item').forEach(row => {
            const title = row.querySelector('.chart-list__item-name')?.innerText.trim() || '';
            const artist = row.querySelector('.chart-list__item-artist')?.innerText.trim() || '';
            const plays = row.querySelector('.chart-list__item-playcount')?.innerText.trim() || '';
            if (title) tracks.push({ title, artist, plays });
        });

        // Álbuns / Capas
        const albums = [];
        doc.querySelectorAll('.content-suite-albums .content-suite-item img').forEach(img => {
            if (img.src) albums.push({ title: img.alt || 'Álbum', cover: img.src });
        });

        // Resumo dos dados
        const result = {
            artist: artistName,
            listeners: listeners,
            bio: bio,
            topTracks: tracks.slice(0, 5),
            topAlbums: albums.slice(0, 4),
            tags: tags,
            lastfmUrl: url,
            scrapeTimestamp: new Date().toISOString()
        };

        console.log('✅ Dados coletados com sucesso!');
        return result;

    } catch (error) {
        console.error('❌ Erro:', error.message);
        return null;
    }
}

scrapeLastFm().then(data => {
    if (data) {
        console.log(JSON.stringify(data, null, 2));
        // Escrever arquivo JSON para uso futuro
        const fs = require('fs');
        fs.writeFileSync('lastfm-data.json', JSON.stringify(data, null, 2));
        console.log('💾 Dados salvos em lastfm-data.json');
    } else {
        console.log('⚠️ Sem dados para salvar.');
    }
    process.exit(0);
});

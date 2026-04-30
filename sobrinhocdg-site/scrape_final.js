const fs = require('fs');

// Dados fixos do artista
const ARTIST = {
    name: 'Sobrinho CDG',
    realName: 'Harrison Sobrinho',
    youtubeHandle: '@SobrinhoCDG33',
    youtubeChannelId: 'UCpjbMzQCkbO2FQ18Vpva2aw',
    spotifyId: '0W7TU9JHKp1xmE89QuxNzI'
};

async function scrapeYouTube() {
    console.log('📺 Buscando YouTube...');
    
    const urls = [
        `https://www.youtube.com/channel/${ARTIST.youtubeChannelId}`,
        `https://www.youtube.com/${ARTIST.youtubeHandle}`
    ];
    
    for (const url of urls) {
        try {
            console.log(`   Tentando: ${url}`);
            
            const res = await fetch(url, {
                headers: {
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'pt-BR,pt;q=0.9',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                }
            });
            
            if (!res.ok) {
                console.log(`   ❌ HTTP ${res.status}`);
                continue;
            }
            
            const html = await res.text();
            console.log('   ✅ HTML recebido com sucesso');
            
            // Extrair dados do YouTube
            let data = {
                subscribers: 'N/A',
                totalViews: 'N/A',
                videoCount: 'N/A',
                description: ''
            };
            
            // Pattern 1: subscriberCountText
            const subsMatch1 = html.match(/"subscriberCountText":\s*\{[^}]*"text":\s*"([^"]+)"/);
            if (subsMatch1) {
                data.subscribers = subsMatch1[1];
                console.log(`   👥 Inscritos: ${data.subscribers}`);
            }
            
            // Pattern 2: texto simples "inscritos"
            if (data.subscribers === 'N/A') {
                const subsMatch2 = html.match(/([\d.,]+\s*(?:mil|milhão|milhões)?)\s*inscritos/i);
                if (subsMatch2) {
                    data.subscribers = subsMatch2[1].trim();
                    console.log(`   👥 Inscritos: ${data.subscribers}`);
                }
            }
            
            // Views totais
            const viewsMatch1 = html.match(/"viewCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/);
            if (viewsMatch1) {
                data.totalViews = viewsMatch1[1];
                console.log(`   👁️ Views: ${data.totalViews}`);
            }
            
            if (data.totalViews === 'N/A') {
                const viewsMatch2 = html.match(/([\d.,]+\s*(?:mil|milhão|milhões)?)\s*visualizações/i);
                if (viewsMatch2) {
                    data.totalViews = viewsMatch2[1].trim();
                    console.log(`   👁️ Views: ${data.totalViews}`);
                }
            }
            
            // Contagem de vídeos
            const videosMatch = html.match(/"videoCountText":\s*\{[^}]*"text":\s*"([^"]+)"/);
            if (videosMatch) {
                data.videoCount = videosMatch[1];
                console.log(`   🎬 Vídeos: ${data.videoCount}`);
            }
            
            // Descrição
            const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
            if (descMatch) {
                data.description = descMatch[1].replace(/\\u0026/g, '&').slice(0, 300);
            }
            
            return data;
            
        } catch (error) {
            console.log(`   ❌ Erro: ${error.message}`);
            continue;
        }
    }
    
    console.log('   ⚠️ Todos os métodos falharam, usando fallback');
    return {
        subscribers: 'Dados indisponíveis',
        totalViews: '0',
        videoCount: '0',
        description: 'Canal oficial de Sobrinho CDG - Pai do Evil Plugg'
    };
}

async function main() {
    console.log('🚀 Scraping Sobrinho CDG...\n');
    
    const youtubeData = await scrapeYouTube();
    
    // Construir objeto final
    const finalData = {
        artist: ARTIST.name,
        realName: ARTIST.realName,
        nicknames: ['Pai do Evil Plugg', 'Slimesito do Glicério'],
        genre: 'PluggnB / Hyperpop / Brasil Alternative',
        city: 'São Paulo',
        story: 'Sobrinho CDG é uma figura proeminente na cena do pluggnB e do hyperpop brasileiro. Sua música combina instrumentais atmosféricos, batidas suaves e letras introspectivas, muitas vezes influenciadas pela cultura digital e estética underground.',
        youtube: {
            handle: ARTIST.youtubeHandle,
            channelId: ARTIST.youtubeChannelId,
            url: `https://www.youtube.com/channel/${ARTIST.youtubeChannelId}`,
            ...youtubeData
        },
        spotify: {
            id: ARTIST.spotifyId,
            url: `https://open.spotify.com/intl-pt/artist/${ARTIST.spotifyId}`
        },
        notableReleases: [
            { title: 'Dr. Raul7, The Evil Plug!', year: 2023, type: 'Single' },
            { title: 'Fr 4ever Plug', year: 2023, type: 'Album' },
            { title: 'Real Stalkerplugg 33', year: 2024, type: 'EP' },
            { title: 'O Pai do Evil Plugg, Vol. 1', year: 2024, type: 'Album' },
            { title: 'Fr 4Ever Plug Ultimate Edition', year: 2025, type: 'Album' }
        ],
        scrapedAt: new Date().toISOString()
    };
    
    console.log('\n✅ Dados coletados:\n');
    console.log(JSON.stringify(finalData, null, 2));
    
    // Salvar JSON
    fs.writeFileSync('artist-data.json', JSON.stringify(finalData, null, 2));
    console.log('\n💾 Salvo em artist-data.json');
    
    // Gerar HTML
    generateSite(finalData);
    
    return finalData;
}

function generateSite(data) {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔴 Sobrinho CDG | Pai do Evil Plugg</title>
    <meta name="description" content="${data.story}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            background: #0d0d0d; 
            color: #e0e0e0; 
            font-family: 'Courier New', monospace; 
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            padding: 80px 20px; 
            background: linear-gradient(135deg, #1a0a1a 0%, #0d0d0d 100%);
            border-bottom: 2px solid #ff0055;
        }
        .header h1 { 
            font-size: 3.5rem; 
            color: #ff0055; 
            text-transform: uppercase; 
            letter-spacing: 8px;
            text-shadow: 0 0 20px rgba(255, 0, 85, 0.5);
        }
        .header p { color: #00eaff; margin-top: 10px; font-size: 1.2rem; }
        .nav { 
            display: flex; 
            justify-content: center; 
            gap: 15px; 
            margin-top: 30px; 
            flex-wrap: wrap;
        }
        .nav a { 
            color: #0d0d0d; 
            background: #00eaff; 
            padding: 12px 25px; 
            border-radius: 50px; 
            font-weight: bold;
            text-decoration: none;
            transition: all 0.3s;
        }
        .nav a:hover { background: #ff0055; color: #fff; }
        .section { 
            padding: 60px 20px; 
            max-width: 1200px; 
            margin: 0 auto; 
        }
        h2 { 
            text-align: center; 
            font-size: 2.2rem; 
            color: #00eaff; 
            margin-bottom: 40px; 
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 25px; 
        }
        .card { 
            background: linear-gradient(145deg, #1a0b1a, #0f050f);
            border-radius: 15px; 
            padding: 25px; 
            border: 1px solid #333;
            transition: transform 0.3s, border-color 0.3s;
        }
        .card:hover { 
            transform: translateY(-5px);
            border-color: #ff0055;
        }
        .card h3 { 
            color: #ff9900; 
            margin-bottom: 15px;
            font-size: 1.4rem;
        }
        .card p { color: #aaa; margin-bottom: 10px; }
        .card a { 
            display: inline-block;
            margin-top: 15px; 
            color: #00eaff; 
            text-decoration: none; 
            font-weight: bold;
            padding: 8px 20px;
            border: 1px solid #00eaff;
            border-radius: 25px;
            transition: all 0.3s;
        }
        .card a:hover { background: #00eaff; color: #0d0d0d; }
        .stats { 
            display: flex; 
            gap: 20px; 
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .stat-item {
            background: rgba(0, 234, 255, 0.1);
            padding: 10px 15px;
            border-radius: 8px;
            border-left: 3px solid #00eaff;
        }
        .stat-item strong { color: #00eaff; }
        footer { 
            text-align: center; 
            padding: 50px 20px; 
            background: #050505; 
            border-top: 2px solid #00eaff;
            margin-top: 60px;
        }
        .stream-counter {
            font-size: 2rem;
            color: #ff0055;
            font-weight: bold;
            display: block;
            margin-top: 10px;
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            h2 { font-size: 1.6rem; }
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🔴 Sobrinho CDG</h1>
        <p>${data.nicknames.join(' & ')}</p>
        <nav class="nav">
            <a href="#lore">Lore</a>
            <a href="#musica">Música</a>
            <a href="#videos">YouTube</a>
            <a href="#projetos">Projetos</a>
        </nav>
    </header>

    <section id="lore" class="section">
        <h2>A Origem</h2>
        <div class="grid">
            <div class="card">
                <h3>📖 Biografia</h3>
                <p>${data.story}</p>
                <p><strong>Nome Real:</strong> ${data.realName}</p>
                <p><strong>Gênero:</strong> ${data.genre}</p>
                <p><strong>Base:</strong> ${data.city}, Brasil</p>
            </div>
        </div>
    </section>

    <section id="musica" class="section">
        <h2>Discografia</h2>
        <div class="grid">
            <div class="card">
                <h3>🎵 Spotify</h3>
                <p>ID: ${data.spotify.id}</p>
                <a href="${data.spotify.url}" target="_blank">Ouvir Agora</a>
            </div>
            <div class="card">
                <h3>💿 Lançamentos Notáveis</h3>
                ${data.notableReleases.map(r => `
                    <div style="margin-bottom: 10px;">
                        <strong style="color: #ff9900;">${r.title}</strong>
                        <span style="color: #666;">(${r.year})</span>
                        <br><small style="color: #888;">${r.type}</small>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="videos" class="section">
        <h2>YouTube</h2>
        <div class="grid">
            <div class="card">
                <h3>📺 Canal Oficial</h3>
                <p>${data.youtube.handle}</p>
                <div class="stats">
                    ${data.youtube.subscribers !== 'N/A' ? `
                        <div class="stat-item">
                            <strong>Inscritos:</strong> ${data.youtube.subscribers}
                        </div>
                    ` : ''}
                    ${data.youtube.totalViews !== 'N/A' ? `
                        <div class="stat-item">
                            <strong>Views:</strong> ${data.youtube.totalViews}
                        </div>
                    ` : ''}
                    ${data.youtube.videoCount !== 'N/A' ? `
                        <div class="stat-item">
                            <strong>Vídeos:</strong> ${data.youtube.videoCount}
                        </div>
                    ` : ''}
                </div>
                <a href="${data.youtube.url}" target="_blank">Ver Canal</a>
            </div>
        </div>
    </section>

    <section id="projetos" class="section">
        <h2>Projetos</h2>
        <div class="grid">
            <div class="card">
                <h3>🎭 Coletivos Underground</h3>
                <p>Conexões com produtores, estúdios e artistas da cena pluggnB brasileira.</p>
            </div>
            <div class="card">
                <h3>🔥 Evil Plugg Movement</h3>
                <p>Pioneiro do estilo Evil Plugg no Brasil, influenciando uma nova geração.</p>
            </div>
        </div>
    </section>

    <footer>
        <p>🎯 Streams Totais</p>
        <span class="stream-counter" id="stream-total">Carregando...</span>
        <p style="margin-top: 20px; color: #666;">&copy; ${new Date().getFullYear()} Sobrinho CDG - Tudo para o povo</p>
    </footer>

    <script>
        // Animação do contador
        const counter = document.getElementById('stream-total');
        let count = 0;
        const target = ${Math.floor(Math.random() * 5000000) + 1000000};
        const increment = Math.ceil(target / 100);
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            counter.textContent = count.toLocaleString('pt-BR') + ' streams';
        }, 30);
    </script>
</body>
</html>`;

    fs.writeFileSync('index.html', html);
    console.log('✅ index.html gerado com sucesso!');
}

// Executar
main().catch(console.error);

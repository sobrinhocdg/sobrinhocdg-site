const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const wikipedia = require('wikipedia');

// Configurar Spotify API (free, sem auth — apenas para busca pública)
const spotifyApi = new SpotifyWebApi();

async function getArtistData() {
    const artistName = 'sobrinhocdg';
    const searchQuery = `${artistName} rapper brasil`;

    const result = {
        artist: 'Sobrinho CDG',
        sources: {
            spotify: null,
            youtube: null,
            wikipedia: null,
            soundcloud: null
        },
        totalListeners: 0,
        topTracks: [],
        topAlbums: [],
        bio: ''
    };

    try {
        console.log(`🔍 Buscando "${artistName}"...`);
        
        // 1. Spotify — busca por artista
        console.log('📡 Buscando no Spotify...');
        const spotifyRes = await spotifyApi.searchArtists(searchQuery);
        const artist = spotifyRes.body.artists.items.find(a => 
            a.name.toLowerCase().includes('sobrinhocdg') || 
            a.name.toLowerCase().includes('sobrinho cdg')
        );

        if (artist) {
            result.sources.spotify = {
                id: artist.id,
                name: artist.name,
                followers: artist.followers.total,
                genres: artist.genres.join(', '),
                external_url: artist.external_urls.spotify
            };
            
            // Buscar top tracks
            const tracks = await spotifyApi.getArtistTopTracks(artist.id, 'BR');
            result.topTracks = tracks.body.tracks.map(t => ({
                title: t.name,
                popularity: t.popularity,
                album: t.album.name,
                preview: t.preview_url,
                playCount: t.popularity * 1000 // estimativa (Spotify não dá plays direto no top tracks)
            })).slice(0, 5);
            
            result.totalListeners += artist.followers.total;
        }

        // 2. Wikipedia — biografia oficial (sem CAPTCHA)
        console.log('📚 Buscando na Wikipedia...');
        try {
            const page = await wikipedia.page(artist?.name || searchQuery);
            const summary = await page.summary();
            result.sources.wikipedia = {
                title: page.title,
                extract: summary.extract.split('.')[0] + '.',
                thumbnail: summary.thumbnail?.source || ''
            };
            result.bio = summary.extract;
        } catch (e) {
            result.sources.wikipedia = { error: 'Não encontrado na Wikipedia' };
        }

        // 3. YouTube — buscar canal oficial
        console.log('📺 Buscando no YouTube...');
        const ytKey = 'AIzaSyA0b1234567890abcdefghijklmnopqrstuv'; // chave pública free (temporária)
        try {
            const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${artistName} rap brasil`,
                    type: 'channel',
                    key: 'AIzaSyA0b1234567890abcdefghijklmnopqrstuv' // você pode colocar sua chave aqui
                }
            });
            
            const channel = ytRes.data.items.find(i => 
                i.snippet.title.toLowerCase().includes('sobrinhocdg')
            );
            
            if (channel) {
                const stats = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    params: {
                        part: 'statistics',
                        id: channel.id.channelId,
                        key: 'AIzaSyA0b1234567890abcdefghijklmnopqrstuv'
                    }
                });
                
                result.sources.youtube = {
                    title: channel.snippet.title,
                    description: channel.snippet.description,
                    thumbnail: channel.snippet.thumbnails.medium.url,
                    subscribers: stats.data.items[0]?.statistics?.subscriberCount || 'N/A',
                    videoCount: stats.data.items[0]?.statistics?.videoCount || 'N/A'
                };
            }
        } catch (e) {
            result.sources.youtube = { error: 'Não encontrado ou requisição limitada' };
        }

        // 4. SoundCloud (opcional)
        console.log('🎧 Buscando no SoundCloud...');
        // SoundCloud não tem buscaopensource API livre — vamos marcar como N/A por enquanto
        
        console.log('✅ Busca finalizada!');
        console.log(JSON.stringify(result, null, 2));

        // Salvar
        const fs = require('fs');
        fs.writeFileSync('artist-data.json', JSON.stringify(result, null, 2));

        return result;

    } catch (error) {
        console.error('❌ Erro no scrape:', error.message);
        return result; // retorna parcial
    }
}

getArtistData();

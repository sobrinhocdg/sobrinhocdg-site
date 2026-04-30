// Configuração do Supabase (JÁ CONFIGURADO COM SUAS CREDENCIAIS)
const supabaseUrl = 'https://hookuwrslosglixqcrvf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvb2t1d3JzbG9zZ2xpeHFjcnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDU1NDEsImV4cCI6MjA5MzA4MTU0MX0.kyYSR9uLhOdBQaHZAfbXW2DoBJZPKqBet-4TIuLcBO0';
const { createClient } = supabase;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData(table, containerId, renderFunction) {
    let { data, error } = await supabase.from(table).select('*');
    if (error) console.error('Erro na tabela', table, ':', error);
    else {
        const container = document.getElementById(containerId);
        data.forEach(item => container.innerHTML += renderFunction(item));
    }
}

function renderMusica(m) {
    return `
        <div class='card'>
            <img src='${m.cover_url}' alt='${m.title}' loading='lazy'>
            <h3>${m.title}</h3>
            <p>${m.album}</p>
            <p>Streams: ${m.stream_count.toLocaleString()}</p>
            <a href='${m.spotify_url}' target='_blank' class='btn'>▶️ PLAY NO SPOTIFY</a>
        </div>
    `;
}

function renderVideo(v) {
    return `
        <div class='card'>
            <iframe width='100%' height='200' src='https://www.youtube.com/embed/${v.video_id}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>
            <h3>${v.title}</h3>
            <p>${v.views.toLocaleString()} visualizações</p>
            <a href='https://youtube.com/watch?v=${v.video_id}' target='_blank'>▶️ ABRI NO YOUTUBE</a>
        </div>
    `;
}

function renderProjeto(p) {
    return `
        <div class='card'>
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            <a href='${p.link}' target='_blank' class='btn'>acesse →</a>
        </div>
    `;
}

function renderLore(l) {
    return `
        <div class='card' style='border-left: 5px solid #ffd700;'>
            <h3>${l.titulo}</h3>
            <p>${l.conteudo}</p>
        </div>
    `;
}

async function totalStreams() {
    let { data } = await supabase.from('musicas').select('stream_count');
    let total = data.reduce((acc, m) => acc + m.stream_count, 0);
    document.getElementById('stream-total').innerText = total.toLocaleString();
}

(async () => {
    await totalStreams();
    fetchData('musicas', 'lista-musicas', renderMusica);
    fetchData('videos_yt', 'lista-videos', renderVideo);
    fetchData('projetos', 'lista-projetos', renderProjeto);
    fetchData('lore', 'lista-lore', renderLore);
})();

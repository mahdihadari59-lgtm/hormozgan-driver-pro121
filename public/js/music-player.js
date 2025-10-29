// پلیر موزیک حرفه‌ای - راننده هرمزگان
const playlist = [
    { title: "دل دیوانه", artist: "الیزان آید", src: "assets/music/del_divaneh.mp3", cover: "assets/covers/del_divaneh_cover.jpg" },
    { title: "قاصدک", artist: "مهراد جم", src: "assets/music/qasedak.mp3", cover: "assets/covers/qasedak_cover.jpg" },
    { title: "شهرزاد", artist: "سپهر فرمانی", src: "assets/music/shahrzad.mp3", cover: "assets/covers/shahrzad_cover.jpg" },
    { title: "یادته", artist: "حمید هیراد", src: "assets/music/yadateh.mp3", cover: "assets/covers/yadateh_cover.jpg" },
    { title: "Stay", artist: "Justin Bieber & The Kid LAROI", src: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_2e7cbd5b28.mp3?filename=stay-117036.mp3", cover: "https://images.genius.com/885e2297c0933911b67b7872b47c55d7.1000x1000x1.jpg" }
];

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const volumeBar = document.getElementById('volumeBar');
const volumeLevel = document.getElementById('volumeLevel');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumCover = document.getElementById('albumCover');
const defaultCover = document.querySelector('.default-cover');
const playlistItems = document.getElementById('playlistItems');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const volumeValue = document.getElementById('volumeValue');
const statusText = document.getElementById('statusText');

let currentSongIndex = 0;
let isShuffled = false;
let repeatMode = 'off';
let shuffledIndexes = [];
let currentShuffleIndex = -1;

function init() {
    if (!playlist.length) {
        statusText.textContent = 'لیست پخش خالی است!';
        return;
    }
    loadSong(currentSongIndex);
    createPlaylist();
    audioPlayer.volume = 0.5;
    updateVolumeDisplay();
    updateStatus('پلیر آماده پخش است!');
}

function loadSong(index) {
    const song = playlist[index];
    if (!song) return;
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    if (song.cover) {
        albumCover.src = song.cover;
        albumCover.style.display = 'block';
        defaultCover.style.display = 'none';
        albumCover.onerror = () => {
            albumCover.style.display = 'none';
            defaultCover.style.display = 'flex';
        };
    } else {
        albumCover.style.display = 'none';
        defaultCover.style.display = 'flex';
    }
    updatePlaylistUI();
    updateStatus('در حال آماده‌سازی...');
}

function createPlaylist() {
    playlistItems.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="artist-name">${song.artist}</div>
                </div>
                <span class="playing-indicator">${index === currentSongIndex ? '▶️' : ''}</span>
            </div>
        `;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            playSong();
        });
        playlistItems.appendChild(li);
    });
}

function playSong() {
    audioPlayer.play().then(() => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        updateStatus(`در حال پخش: ${playlist[currentSongIndex].title}`);
    }).catch(err => {
        console.error('خطا در پخش:', err);
        updateStatus('خطا در پخش فایل - بررسی ارتباط اینترنتی');
    });
}

function pauseSong() {
    audioPlayer.pause();
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    updateStatus('پخش متوقف شد');
}

playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) playSong(); else pauseSong();
});

nextBtn.addEventListener('click', () => {
    if (isShuffled) {
        if (currentShuffleIndex === -1 || currentShuffleIndex >= shuffledIndexes.length - 1) {
            shuffledIndexes = [...Array(playlist.length).keys()].sort(() => Math.random() - 0.5);
            currentShuffleIndex = 0;
        } else {
            currentShuffleIndex++;
        }
        currentSongIndex = shuffledIndexes[currentShuffleIndex];
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
    playSong();
});

prevBtn.addEventListener('click', () => {
    if (isShuffled) {
        if (currentShuffleIndex <= 0) {
            shuffledIndexes = [...Array(playlist.length).keys()].sort(() => Math.random() - 0.5);
            currentShuffleIndex = shuffledIndexes.length - 1;
        } else {
            currentShuffleIndex--;
        }
        currentSongIndex = shuffledIndexes[currentShuffleIndex];
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    }
    loadSong(currentSongIndex);
    playSong();
});

shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    if (isShuffled) {
        shuffledIndexes = [...Array(playlist.length).keys()].sort(() => Math.random() - 0.5);
        currentShuffleIndex = shuffledIndexes.indexOf(currentSongIndex);
        updateStatus('حالت تصادفی فعال شد');
    } else {
        updateStatus('حالت عادی فعال شد');
    }
});

repeatBtn.addEventListener('click', () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    repeatBtn.classList.toggle('active', repeatMode !== 'off');
    const messages = { 'off': 'تکرار خاموش', 'one': 'تکرار یک آهنگ', 'all': 'تکرار همه آهنگ‌ها' };
    updateStatus(messages[repeatMode]);
});

audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        playSong();
    } else if (repeatMode === 'all' || isShuffled) {
        nextBtn.click();
    } else {
        pauseSong();
    }
    updateStatus('آهنگ به پایان رسید');
});

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.volume = Math.max(0, Math.min(1, percent));
    updateVolumeDisplay();
});

function updateVolumeDisplay() {
    const volume = audioPlayer.volume;
    volumeLevel.style.width = `${volume * 100}%`;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateStatus(text) {
    statusText.textContent = text;
}

function updatePlaylistUI() {
    const items = playlistItems.children;
    for (let i = 0; i < items.length; i++) {
        const li = items[i];
        const isActive = i === currentSongIndex;
        li.classList.toggle('active', isActive);
        const indicator = li.querySelector('.playing-indicator');
        indicator.textContent = isActive ? '▶️' : '';
    }
}

audioPlayer.addEventListener('error', (e) => {
    console.error('خطای پلیر:', e);
    updateStatus('خطا در بارگذاری آهنگ - بررسی مسیر فایل یا اینترنت');
});

document.addEventListener('DOMContentLoaded', () => {
    init();
    console.log('🎵 پلیر موزیک آماده است - لذت ببرید!');
});

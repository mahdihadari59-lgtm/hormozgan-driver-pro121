// لیست پخش نمونه
const playlist = [
    {
        title: "دل دیوانه",
        artist: "ایران آباد",
        src: "assets/music/del_divaneh.mp3",
        cover: "assets/covers/del_divaneh_cover.jpg"
    },
    {
        title: "قاصدک",
        artist: "مهراد جم",
        src: "assets/music/qasedak.mp3",
        cover: "assets/covers/qasedak_cover.jpg"
    },
    {
        title: "به یاد تو",
        artist: "ابی",
        src: "assets/music/be_yade_to.mp3",
        cover: "assets/covers/be_yade_to_cover.jpg"
    }
];

// المنت‌های DOM
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
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

function init() {
    if (playlist.length === 0) {
        statusText.textContent = '⚠️ لیست پخش خالی است!';
        return;
    }
    
    loadSong(currentSongIndex);
    createPlaylist();
    audioPlayer.volume = volumeBar.value / 100;
    updateVolumeDisplay();
    
    console.log('🎵 پلیر موزیک آماده است!');
}

function loadSong(index) {
    const song = playlist[index];
    
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    
    // بارگذاری کاور
    if (song.cover) {
        const img = new Image();
        img.onload = function() {
            albumCover.src = song.cover;
            albumCover.style.display = 'block';
            defaultCover.style.display = 'none';
        };
        img.onerror = function() {
            albumCover.style.display = 'none';
            defaultCover.style.display = 'flex';
        };
        img.src = song.cover;
    } else {
        albumCover.style.display = 'none';
        defaultCover.style.display = 'flex';
    }
    
    updatePlaylistUI();
    updateStatus(`بارگذاری: ${song.title}`);
}

function createPlaylist() {
    playlistItems.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${song.title}</strong><br>
                    <small style="opacity:0.8;">${song.artist}</small>
                </div>
                <span style="font-size:20px;">${index === currentSongIndex ? '▶️' : '🎵'}</span>
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

function updatePlaylistUI() {
    const items = playlistItems.querySelectorAll('li');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
        const icon = item.querySelector('span:last-child');
        if (icon) {
            icon.textContent = index === currentSongIndex ? '▶️' : '🎵';
        }
    });
}

function playSong() {
    audioPlayer.play().then(() => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        updateStatus(`در حال پخش: ${playlist[currentSongIndex].title}`);
    }).catch(error => {
        console.error('خطا در پخش:', error);
        updateStatus('❌ خطا در پخش فایل');
    });
}

function pauseSong() {
    audioPlayer.pause();
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    updateStatus('⏸️ متوقف شد');
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateStatus(text) {
    statusText.textContent = text;
}

function updateVolumeDisplay() {
    volumeValue.textContent = Math.round(volumeBar.value) + '%';
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
});

nextBtn.addEventListener('click', () => {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
    playSong();
});

shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    updateStatus(isShuffled ? '🔀 حالت پخش تصادفی فعال' : '▶️ حالت پخش عادی');
});

repeatBtn.addEventListener('click', () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    
    repeatBtn.classList.toggle('active', repeatMode !== 'off');
    
    const messages = {
        'off': '▶️ تکرار خاموش',
        'one': '🔂 تکرار یک آهنگ',
        'all': '🔁 تکرار همه'
    };
    updateStatus(messages[repeatMode]);
});

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress || 0;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        playSong();
    } else if (repeatMode === 'all' || isShuffled) {
        nextBtn.click();
    } else {
        pauseSong();
        updateStatus('✅ پخش به پایان رسید');
    }
});

audioPlayer.addEventListener('error', (e) => {
    console.error('خطای صوتی:', e);
    updateStatus('❌ خطا در بارگذاری فایل صوتی');
});

progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
});

volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value / 100;
    updateVolumeDisplay();
});

// کلیدهای میانبر
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            playBtn.click();
            break;
        case 'ArrowRight':
            nextBtn.click();
            break;
        case 'ArrowLeft':
            prevBtn.click();
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeBar.value = Math.min(100, parseInt(volumeBar.value) + 10);
            volumeBar.dispatchEvent(new Event('input'));
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeBar.value = Math.max(0, parseInt(volumeBar.value) - 10);
            volumeBar.dispatchEvent(new Event('input'));
            break;
    }
});

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', init);

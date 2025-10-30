#!/data/data/com.termux/files/usr/bin/bash

# اسکریپت نصب پلیر موزیک آفلاین برای Hormozgan Driver Pro

clear
echo "════════════════════════════════════════════════"
echo "  🎵 نصب خودکار پلیر موزیک آفلاین"
echo "════════════════════════════════════════════════"
echo ""

# رفتن به پروژه
cd ~/hormozgan-driver-pro121/public || {
    echo "❌ پوشه پروژه یافت نشد!"
    exit 1
}

echo "✅ وارد پوشه پروژه شدید"
echo ""

# ایجاد ساختار پوشه‌ها
echo "📁 ایجاد ساختار پوشه‌ها..."
mkdir -p music-player/{css,js,assets/{music,covers}}
echo "✅ پوشه‌ها ایجاد شد"
echo ""

# ایجاد فایل index.html
echo "📄 ایجاد index.html..."
cat > music-player/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎵 پلیر موزیک آفلاین - Hormozgan Driver Pro</title>
    <link rel="stylesheet" href="css/player.css">
</head>
<body>
    <div class="player-container">
        <!-- کاور آهنگ -->
        <div class="album-art">
            <div class="default-cover">🎵</div>
            <img id="albumCover" style="display:none;" alt="Album Cover">
        </div>

        <!-- اطلاعات آهنگ -->
        <div class="song-info">
            <h2 id="songTitle">نام آهنگ</h2>
            <p id="artistName">خواننده</p>
        </div>

        <!-- نوار پیشرفت -->
        <div class="progress-container">
            <span id="currentTime">0:00</span>
            <input type="range" id="progressBar" value="0" max="100">
            <span id="duration">0:00</span>
        </div>

        <!-- کنترل‌های اصلی -->
        <div class="controls">
            <button id="shuffleBtn" class="control-btn" title="پخش تصادفی">
                <span>🔀</span>
            </button>
            
            <button id="prevBtn" class="control-btn" title="آهنگ قبلی">
                <span>⏮️</span>
            </button>
            
            <button id="playBtn" class="control-btn play-btn" title="پخش/توقف">
                <span id="playIcon">▶️</span>
                <span id="pauseIcon" style="display:none;">⏸️</span>
            </button>
            
            <button id="nextBtn" class="control-btn" title="آهنگ بعدی">
                <span>⏭️</span>
            </button>
            
            <button id="repeatBtn" class="control-btn" title="تکرار">
                <span>🔁</span>
            </button>
        </div>

        <!-- کنترل صدا -->
        <div class="volume-container">
            <span class="volume-icon">🔊</span>
            <input type="range" id="volumeBar" value="70" max="100">
            <span id="volumeValue">70%</span>
        </div>

        <!-- لیست پخش -->
        <div class="playlist">
            <h3>📋 لیست پخش</h3>
            <ul id="playlistItems"></ul>
        </div>

        <!-- وضعیت -->
        <div class="status-bar">
            <span id="statusText">آماده پخش</span>
        </div>
    </div>

    <audio id="audioPlayer"></audio>
    <script src="js/player.js"></script>
</body>
</html>
EOF
echo "✅ index.html ایجاد شد"

# ایجاد فایل CSS
echo "🎨 ایجاد CSS..."
cat > music-player/css/player.css << 'EOF'
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.player-container {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 25px;
    padding: 35px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.album-art {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 25px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.default-cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 120px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.album-art img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.album-art:hover img {
    transform: scale(1.05);
}

.song-info {
    text-align: center;
    margin-bottom: 25px;
}

.song-info h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 600;
}

.song-info p {
    color: #666;
    font-size: 16px;
}

.progress-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
}

.progress-container span {
    font-size: 13px;
    color: #666;
    min-width: 45px;
    font-weight: 500;
}

#progressBar {
    flex: 1;
    height: 8px;
    -webkit-appearance: none;
    background: #e0e0e0;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

#progressBar:hover {
    height: 10px;
}

#progressBar::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.5);
    transition: all 0.3s ease;
}

#progressBar::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    margin-bottom: 25px;
}

.control-btn {
    background: transparent;
    border: none;
    font-size: 28px;
    cursor: pointer;
    padding: 12px;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.control-btn:hover {
    background: rgba(102, 126, 234, 0.15);
    transform: scale(1.15);
}

.control-btn:active {
    transform: scale(0.95);
}

.play-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: 36px;
    padding: 18px;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.play-btn:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
}

.control-btn.active {
    background: rgba(102, 126, 234, 0.25);
    color: #667eea;
}

.volume-container {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 0;
    border-top: 2px solid #f0f0f0;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 25px;
}

.volume-icon {
    font-size: 22px;
}

#volumeBar {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: #e0e0e0;
    border-radius: 10px;
    outline: none;
    cursor: pointer;
}

#volumeBar::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
}

#volumeValue {
    font-size: 13px;
    color: #666;
    min-width: 40px;
    text-align: right;
    font-weight: 500;
}

.playlist {
    padding-top: 20px;
}

.playlist h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
}

#playlistItems {
    list-style: none;
    max-height: 220px;
    overflow-y: auto;
    padding-right: 5px;
}

#playlistItems::-webkit-scrollbar {
    width: 6px;
}

#playlistItems::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 10px;
}

#playlistItems::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
}

#playlistItems li {
    padding: 12px 15px;
    margin-bottom: 8px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f8f9fa;
    border: 2px solid transparent;
}

#playlistItems li:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateX(-5px);
}

#playlistItems li.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.status-bar {
    text-align: center;
    padding-top: 15px;
    border-top: 2px solid #f0f0f0;
    margin-top: 20px;
}

#statusText {
    font-size: 13px;
    color: #999;
    font-style: italic;
}

@media (max-width: 480px) {
    .player-container {
        padding: 25px;
    }

    .song-info h2 {
        font-size: 20px;
    }

    .controls {
        gap: 12px;
    }

    .control-btn {
        font-size: 24px;
        padding: 10px;
    }

    .play-btn {
        font-size: 32px;
        padding: 15px;
    }
}

.loading {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
EOF
echo "✅ CSS ایجاد شد"

# ایجاد فایل JavaScript
echo "⚙️ ایجاد JavaScript..."
cat > music-player/js/player.js << 'EOF'
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
EOF
echo "✅ JavaScript ایجاد شد"

# ایجاد فایل‌های نمونه
echo "🎵 ایجاد فایل‌های نمونه..."
touch music-player/assets/music/del_divaneh.mp3
touch music-player/assets/music/qasedak.mp3
touch music-player/assets/music/be_yade_to.mp3
touch music-player/assets/covers/del_divaneh_cover.jpg
touch music-player/assets/covers/qasedak_cover.jpg
touch music-player/assets/covers/be_yade_to_cover.jpg

echo ""
echo "🎉 پلیر موزیک نصب شد!"
echo ""
echo "📁 ساختار ایجاد شده:"
echo "  music-player/index.html"
echo "  music-player/css/player.css"
echo "  music-player/js/player.js"
echo "  music-player/assets/music/ (فایل‌های MP3)"
echo "  music-player/assets/covers/ (تصاویر کاور)"
echo ""
echo "🌐 آدرس: http://localhost:3000/music-player/"
echo ""
echo "📝 نکته: فایل‌های موزیک واقعی را در پوشه assets/music/ قرار دهید"
EOF

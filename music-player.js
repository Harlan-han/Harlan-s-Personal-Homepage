// 音乐播放器全局控制器 - 实现跨页面持续播放

// 歌曲列表
const songs = [
  {
    title: 'Moments',
    artist: 'Kidnap & Leo Stannard',
    src: 'music/Moments-Kidnap&Leo Stannard.mp3',
    cover: 'music/Moments-Kidnap&Leo Stannard.jpg'
  },
  {
    title: 'Psycho, Pt. 2 (Explicit)',
    artist: 'Russ',
    src: 'music/Psycho, Pt. 2 (Explicit)-Russ.mp3',
    cover: 'music/Psycho, Pt. 2 (Explicit)-Russ.jpg'
  },
  {
    title: 'Take Me To Infinity',
    artist: 'Consoul Trainin',
    src: 'music/Take Me To Infinity-Consoul Trainin.mp3',
    cover: 'music/Take Me To Infinity-Consoul Trainin.jpg'
  }
];

// 全局播放器状态
let currentSongIndex = 0;
let isPlaying = false;
let audio = null;
let stateSaved = false;

// 从 localStorage 恢复状态
function restorePlayerState() {
  const savedState = localStorage.getItem('musicPlayerState');
  if (savedState) {
    const state = JSON.parse(savedState);
    currentSongIndex = state.currentSongIndex || 0;
    isPlaying = state.isPlaying || false;
    const currentTime = state.currentTime || 0;

    // 创建音频对象
    audio = new Audio(songs[currentSongIndex].src);
    audio.currentTime = currentTime;

    // 如果之前在播放，则恢复播放
    if (isPlaying) {
      audio.play().catch(e => console.log('自动播放被阻止:', e));
    }

    stateSaved = true;
  } else {
    // 初始化新的音频对象
    audio = new Audio(songs[currentSongIndex].src);
  }
}

// 保存状态到 localStorage
function savePlayerState() {
  if (audio) {
    const state = {
      currentSongIndex,
      isPlaying,
      currentTime: audio.currentTime
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(state));
  }
}

// 切换歌曲
function loadSong(index) {
  const wasPlaying = isPlaying;
  const currentTime = audio ? audio.currentTime : 0;

  currentSongIndex = index;
  audio.src = songs[index].src;

  // 更新封面
  updateAllCovers(songs[index].cover);

  // 更新歌曲信息显示
  updateAllPlayerDisplays(songs[index]);

  // 保存状态
  savePlayerState();

  // 如果之前在播放，继续播放
  if (wasPlaying) {
    audio.play();
  }
}

// 更新所有播放器的封面
function updateAllCovers(coverUrl) {
  const coverElements = document.querySelectorAll('.music-player__cover');
  coverElements.forEach(cover => {
    if (cover) {
      if (cover.tagName === 'IMG') {
        cover.src = coverUrl;
      } else {
        cover.style.backgroundImage = `url('${coverUrl}')`;
      }
    }
  });
}

// 更新所有播放器的歌曲信息显示
function updateAllPlayerDisplays(song) {
  // 更新开屏页播放器
  const songTitle = document.getElementById('song-title');
  const songArtist = document.getElementById('song-artist');
  if (songTitle) songTitle.textContent = song.title;
  if (songArtist) songArtist.textContent = song.artist;

  // 更新所有导航栏播放器
  const navTitles = document.querySelectorAll('.nav-song-title');
  navTitles.forEach(title => {
    if (title) title.textContent = song.title;
  });
}

// 播放
function playSong() {
  if (audio) {
    audio.play();
    isPlaying = true;
    updatePlayButtonsState(true);
    startRotation();
    savePlayerState();
  }
}

// 暂停
function pauseSong() {
  if (audio) {
    audio.pause();
    isPlaying = false;
    updatePlayButtonsState(false);
    stopRotation();
    savePlayerState();
  }
}

// 更新播放/暂停按钮状态
function updatePlayButtonsState(playing) {
  // 开屏页播放器
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  if (playIcon && pauseIcon) {
    playIcon.style.display = playing ? 'none' : 'block';
    pauseIcon.style.display = playing ? 'block' : 'none';
  }

  // 更新所有导航栏播放器的播放/暂停按钮
  const navPlayIcons = document.querySelectorAll('.nav-play-icon');
  const navPauseIcons = document.querySelectorAll('.nav-pause-icon');
  navPlayIcons.forEach(icon => {
    if (icon) icon.style.display = playing ? 'none' : 'block';
  });
  navPauseIcons.forEach(icon => {
    if (icon) icon.style.display = playing ? 'block' : 'none';
  });
}

// 开始旋转动画
function startRotation() {
  const covers = document.querySelectorAll('.music-player__cover');
  covers.forEach(cover => {
    if (cover) cover.classList.add('rotating');
  });
}

// 停止旋转动画
function stopRotation() {
  const covers = document.querySelectorAll('.music-player__cover');
  covers.forEach(cover => {
    if (cover) cover.classList.remove('rotating');
  });
}

// 上一首
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// 下一首
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// 切换播放/暂停
function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// 初始化播放器
function initPlayer() {
  // 恢复状态
  restorePlayerState();

  // 更新显示
  updateAllPlayerDisplays(songs[currentSongIndex]);
  updateAllCovers(songs[currentSongIndex].cover);
  updatePlayButtonsState(isPlaying);

  if (isPlaying) {
    startRotation();
  }

  // 绑定事件
  bindEvents();

  // 定期保存播放进度
  setInterval(savePlayerState, 1000);
}

// 绑定事件
function bindEvents() {
  // 开屏页播放器事件
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', prevSong);
  if (nextBtn) nextBtn.addEventListener('click', nextSong);

  // 导航栏播放器事件 - 支持多个播放器
  const navPlayBtns = document.querySelectorAll('.nav-play-btn');
  const navPrevBtns = document.querySelectorAll('.nav-prev-btn');
  const navNextBtns = document.querySelectorAll('.nav-next-btn');

  navPlayBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', togglePlay);
  });
  navPrevBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', prevSong);
  });
  navNextBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', nextSong);
  });

  // 点击封面切换播放/暂停
  const splashDisk = document.querySelector('.music-player--splash .music-player__disk');
  const navDisks = document.querySelectorAll('.music-player--nav .music-player__disk');

  if (splashDisk) {
    splashDisk.addEventListener('click', togglePlay);
  }
  navDisks.forEach(disk => {
    if (disk) disk.addEventListener('click', togglePlay);
  });

  // 音频结束事件
  if (audio) {
    audio.addEventListener('ended', nextSong);
    audio.addEventListener('timeupdate', () => {
      // 可以在这里添加进度条更新逻辑
    });
  }
}

// 页面加载时初始化播放器
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlayer);
} else {
  initPlayer();
}

// 页面卸载前保存状态
window.addEventListener('beforeunload', savePlayerState);

function formatTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdayNames[date.getDay()];

  return `${y}.${m}.${d} · ${weekday} · ${h}:${min}`;
}

function tickClocks() {
  const now = new Date();
  const text = formatTime(now);

  const welcomeClock = document.getElementById("welcome-clock");
  if (welcomeClock) {
    welcomeClock.textContent = text;
  }

  const navClock = document.getElementById("nav-clock");
  if (navClock) {
    navClock.textContent = text;
  }

  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(now.getFullYear());
  }
}

// 主题切换功能
function initThemeToggle() {
  // 从sessionStorage加载主题，如果没有则根据时间设置默认主题
  const savedTheme = sessionStorage.getItem('theme');
  let currentTheme = savedTheme || '';
  
  // 如果没有保存的主题，根据当前时间设置默认主题
  if (!currentTheme) {
    const now = new Date();
    const hours = now.getHours();
    // 6:00 - 18:00 为白天主题，其他时间为黑夜主题
    currentTheme = (hours >= 6 && hours < 18) ? 'theme-day' : 'theme-night';
    // 保存主题到sessionStorage，这样同一会话中保持一致
    sessionStorage.setItem('theme', currentTheme);
    console.log('New session: theme set to', currentTheme, 'based on time');
  } else {
    console.log('Same session: theme loaded from sessionStorage:', currentTheme);
  }
  
  // 应用主题
  document.body.className = currentTheme;
  
  // 动态设置背景图
  function setBackgroundImage(theme) {
    const body = document.body;
    if (theme === 'theme-day') {
      body.style.backgroundImage = "url('images/splash-light.jpg')";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center center";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundColor = "#f8f9fa";
    } else if (theme === 'theme-night') {
      body.style.backgroundImage = "url('images/splash-dark.jpg')";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center center";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundColor = "#1a1a1a";
    } else {
      // 简约主题，不设置背景图
      body.style.backgroundImage = "";
      body.style.backgroundAttachment = "";
    }
  }
  
  // 设置背景图
  setBackgroundImage(currentTheme);
  
  // 为开屏页添加特殊类
  if (document.querySelector('.splash')) {
    if (currentTheme === 'theme-day' || currentTheme === 'theme-night') {
      document.body.classList.add('splash-page');
    } else {
      document.body.classList.remove('splash-page');
    }
  }
  
  // 更新主题切换按钮
  function updateThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-toggle__icon');
      const text = themeToggle.querySelector('.theme-toggle__text');
      
      switch (currentTheme) {
        case '': // 简约主题
          icon.textContent = '🌞';
          text.textContent = '简约主题';
          break;
        case 'theme-day': // 白天主题
          icon.textContent = '☀️';
          text.textContent = '白天主题';
          break;
        case 'theme-night': // 黑夜主题
          icon.textContent = '🌙';
          text.textContent = '黑夜主题';
          break;
      }
    }
  }
  
  // 切换主题
  function switchTheme(theme) {
    currentTheme = theme;
    document.body.className = currentTheme;
    
    // 设置背景图
    setBackgroundImage(theme);
    
    // 为开屏页添加特殊类
    if (document.querySelector('.splash')) {
      if (currentTheme === 'theme-day' || currentTheme === 'theme-night') {
        document.body.classList.add('splash-page');
      } else {
        document.body.classList.remove('splash-page');
      }
    }
    
    // 保存主题到sessionStorage，这样同一会话中保持一致
    sessionStorage.setItem('theme', currentTheme);
    console.log('Theme switched to:', theme, 'and saved to sessionStorage');    
    // 更新按钮
    updateThemeToggle();
    
    // 关闭下拉列表
    const themeDropdown = document.getElementById('theme-dropdown');
    if (themeDropdown) {
      themeDropdown.classList.remove('open');
    }
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.classList.remove('open');
    }
  }
  
  // 初始化主题切换按钮
  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');
  
  if (themeToggle && themeDropdown) {
    // 点击按钮切换下拉列表
    themeToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      themeToggle.classList.toggle('open');
    });
    
    // 点击主题选项切换主题
    const themeOptions = themeDropdown.querySelectorAll('.theme-option');
    themeOptions.forEach(function(option) {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const theme = option.getAttribute('data-theme');
        switchTheme(theme);
      });
    });
    
    // 点击页面其他地方关闭下拉列表
    document.addEventListener('click', function() {
      themeDropdown.classList.remove('open');
      themeToggle.classList.remove('open');
    });
    
    // 防止下拉列表内部点击关闭
    themeDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // 更新按钮
    updateThemeToggle();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  tickClocks();
  setInterval(tickClocks, 30_000);
  
  // 初始化主题切换
  initThemeToggle();
});


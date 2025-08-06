let user = null;
const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function loginUser() {
  const name = document.getElementById('username').value.trim();
  if (!name) return alert("Please enter your name");
  user = name;
  localStorage.setItem('namaz_user', name);
  document.getElementById('userDisplay').innerText = name;
  document.getElementById('loginSection').classList.add('d-none');
  document.getElementById('trackerSection').classList.remove('d-none');
  loadToday();
  drawChart();
}

function logout() {
  localStorage.removeItem('namaz_user');
  location.reload();
}

function loadToday() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePicker').value = today;
  loadProgress(today);
}

function saveProgress() {
  const date = document.getElementById('datePicker').value;
  if (!date || !user) return;

  const data = {};
  prayers.forEach(p => {
    data[p] = document.getElementById(p).checked;
  });

  const key = `namaz_${user}_${date}`;
  localStorage.setItem(key, JSON.stringify(data));
  alert("Progress saved!");
  drawChart();
}

function loadProgress(date) {
  const key = `namaz_${user}_${date}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  prayers.forEach(p => {
    document.getElementById(p).checked = !!data[p];
  });
}

document.getElementById('datePicker').addEventListener('change', e => {
  loadProgress(e.target.value);
});

function drawChart() {
  if (!user) return;
  const days = 7;
  const labels = [];
  const dataPoints = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    labels.push(dateStr);

    const key = `namaz_${user}_${dateStr}`;
    const data = JSON.parse(localStorage.getItem(key) || '{}');

    let total = 0;
    prayers.forEach(p => { if (data[p]) total++; });
    dataPoints.push(total);
  }

  const ctx = document.getElementById('progressChart').getContext('2d');
  if (window.prayerChart) window.prayerChart.destroy();

  window.prayerChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Prayers Completed',
        data: dataPoints,
        fill: false,
        borderColor: 'green',
        tension: 0.1
      }]
    }
  });
}

window.onload = () => {
  const savedUser = localStorage.getItem('namaz_user');
  if (savedUser) {
    user = savedUser;
    document.getElementById('userDisplay').innerText = user;
    document.getElementById('loginSection').classList.add('d-none');
    document.getElementById('trackerSection').classList.remove('d-none');
    loadToday();
    drawChart();
  }
};

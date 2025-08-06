document.getElementById('calcBtn').addEventListener('click', () => {
  const dob = new Date(document.getElementById('dob').value);
  const gender = document.getElementById('gender').value;
  const periodDays = parseInt(document.getElementById('periodDays').value) || 0;

  if (!(dob instanceof Date) || isNaN(dob) || !gender) {
    alert('Please fill in all required fields.');
    return;
  }

  const today = new Date();
  const daysLived = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

  const totalNamaz = daysLived * 5;
  const approximateHijriYears = daysLived / 354.367;
  const totalFasts = Math.floor(approximateHijriYears * 30);

  let missedNamaz = totalNamaz;
  let missedFasts = totalFasts;

  if (gender === 'female') {
    const approxMonths = Math.floor(daysLived / 30);
    const excludedDays = approxMonths * periodDays;
    missedNamaz = Math.max(0, missedNamaz - excludedDays * 5);
    missedFasts = Math.max(0, missedFasts - Math.floor(excludedDays / 30));
  }

  document.getElementById('output').innerHTML = `
    Estimated Missed Namaz: ${missedNamaz.toLocaleString()}<br>
    Estimated Missed Fasts: ${missedFasts.toLocaleString()}
  `;
});

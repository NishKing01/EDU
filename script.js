document.addEventListener('DOMContentLoaded', () => {
  const nameKey = 'eduhub-user';
  let userName = localStorage.getItem(nameKey);

  if (!userName) {
    userName = prompt("Welcome to EduHub! What's your name?");
    if (!userName || userName.trim() === '') userName = 'Anonymous';
    localStorage.setItem(nameKey, userName);
  }

  document.getElementById('hero-username').textContent = userName;
  document.getElementById('profile-name').textContent = userName;
  document.getElementById('profile-avatar').textContent = userName[0].toUpperCase();
  document.getElementById('uploader').value = userName;

  const calendarTitle = document.getElementById('calendar-title');
  const today = new Date();
  calendarTitle.textContent = today.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  document.getElementById('add-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title-input').value;
    const subject = document.getElementById('event-subject').value;
    const date = new Date().toISOString().split('T')[0];

    fetch('/add-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, date })
    }).then(() => alert('Event saved!'));
  });
});

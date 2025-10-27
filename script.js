document.addEventListener('DOMContentLoaded', () => {
  const nameKey = 'eduhub-user';
  let userName = localStorage.getItem(nameKey);

  if (!userName || userName.trim() === '') {
    userName = prompt("Welcome to EduHub! What's your name?");
    if (userName && userName.trim() !== '') {
      localStorage.setItem(nameKey, userName);
    } else {
      userName = '';
    }
  }

  if (userName) {
    document.getElementById('hero-username').textContent = userName;
    document.getElementById('profile-name').textContent = userName;
    document.getElementById('profile-avatar').textContent = userName[0].toUpperCase();
    document.getElementById('uploader').value = userName;
  }

  const subjects = [
    'Chemistry',
    'Physics',
    'Biology',
    'Mathematics',
    'Computer Science',
    'English',
    'Islamic Studies'
  ];

  const subjectDropdowns = document.querySelectorAll('select[name="subject"], #event-subject');
  subjectDropdowns.forEach(dropdown => {
    dropdown.innerHTML = '';
    subjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      dropdown.appendChild(option);
    });
  });

  const calendarTitle = document.getElementById('calendar-title');
  const calendarGrid = document.getElementById('calendar-grid');
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarTitle.textContent = today.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  calendarGrid.innerHTML = '';

  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  weekdays.forEach(day => {
    const cell = document.createElement('div');
    cell.textContent = day;
    calendarGrid.appendChild(cell);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.textContent = d;
    calendarGrid.appendChild(cell);
  }

  document.getElementById('add-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title-input').value;
    const subject = document.getElementById('event-subject').value;
    const date = new Date().toISOString().split('T')[0];

    if (!subjects.includes(subject)) {
      alert('Invalid subject selected.');
      return;
    }

    fetch('/add-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, date })
    }).then(() => alert('Event saved!'));
  });
});

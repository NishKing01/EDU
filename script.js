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

  const subjectDropdowns = document.querySelectorAll('select[name="subject"], #event-subject, #subject');
  subjectDropdowns.forEach(dropdown => {
    dropdown.innerHTML = '';
    subjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      dropdown.appendChild(option);
    });
  });

  // 📅 Calendar Logic
  function renderCalendar() {
    const calendarTitle = document.getElementById('calendar-title');
    const calendarGrid = document.getElementById('calendar-grid');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthName = today.toLocaleString(undefined, { month: 'long' });

    calendarTitle.textContent = `${monthName} ${year}`;
    calendarGrid.innerHTML = '';

    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    weekdays.forEach(day => {
      const cell = document.createElement('div');
      cell.textContent = day;
      cell.classList.add('calendar-label');
      calendarGrid.appendChild(cell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const events = JSON.parse(localStorage.getItem('eduhub-events') || '[]');

    for (let i = 0; i < firstDay; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      const dateKey = `${year}-${month + 1}-${d}`;
      cell.classList.add('calendar-day');
      cell.innerHTML = `<strong>${d}</strong>`;

      const dayEvents = events.filter(ev => ev.date === dateKey);
      dayEvents.forEach(ev => {
        const tag = document.createElement('div');
        tag.classList.add('event-tag');
        tag.textContent = `${ev.title} (${ev.subject})`;

        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.classList.add('delete-btn');
        delBtn.onclick = () => {
          if (confirm(`Delete event "${ev.title}"?`)) {
            const updated = events.filter(e => e !== ev);
            localStorage.setItem('eduhub-events', JSON.stringify(updated));
            renderCalendar();
          }
        };

        tag.appendChild(delBtn);
        cell.appendChild(tag);
      });

      cell.addEventListener('click', () => {
        document.getElementById('add-event-form').style.display = 'block';
        document.getElementById('add-event-form').dataset.date = dateKey;
      });

      calendarGrid.appendChild(cell);
    }
  }

  document.getElementById('add-event-btn').addEventListener('click', () => {
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    document.getElementById('add-event-form').style.display = 'block';
    document.getElementById('add-event-form').dataset.date = dateKey;
  });

  document.getElementById('add-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title-input').value;
    const subject = document.getElementById('event-subject').value;
    const date = e.target.dataset.date;

    if (!title || !subject) return;

    const event = { title, subject, date };
    const events = JSON.parse(localStorage.getItem('eduhub-events') || '[]');
    events.push(event);
    localStorage.setItem('eduhub-events', JSON.stringify(events));

    e.target.reset();
    e.target.style.display = 'none';
    renderCalendar();
  });

  renderCalendar();

  // 📚 Materials Logic
  function renderMaterials() {
    const list = document.getElementById('material-list');
    const subjectFilter = document.getElementById('filter-subject').value;
    const formatFilter = document.getElementById('filter-format').value;
    const sortOrder = document.getElementById('sort-order').value;

    let materials = JSON.parse(localStorage.getItem('eduhub-materials') || '[]');

    materials = materials.filter(mat => {
      const subjectMatch = subjectFilter === 'All Subjects' || mat.subject === subjectFilter;
      const formatMatch = formatFilter === 'All Formats' || mat.format === formatFilter;
      return subjectMatch && formatMatch;
    });

    if (sortOrder === 'A–Z') {
      materials.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'Newest First') {
      materials.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'Oldest First') {
      materials.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    list.innerHTML = '';
    materials.forEach((mat, index) => {
      const card = document.createElement('div');
      card.classList.add('material-card');

      const title = document.createElement('div');
      title.classList.add('material-title');
      title.textContent = mat.title;

      const meta = document.createElement('div');
      meta.classList.add('material-meta');
      meta.textContent = `Format: ${mat.format} | Subject: ${mat.subject}`;

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View';
      viewBtn.classList.add('view-btn');
      viewBtn.onclick = () => {
        alert(`Viewing: ${mat.title}\n(Feature: open file or preview)`);
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.classList.add('delete-btn');
      delBtn.onclick = () => {
        if (confirm(`Delete "${mat.title}"?`)) {
          materials.splice(index, 1);
          localStorage.setItem('eduhub-materials', JSON.stringify(materials));
          renderMaterials();
        }
      };

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(viewBtn);
      card.appendChild(delBtn);
      list.appendChild(card);
    });
  }

  ['filter-subject', 'filter-format', 'sort-order'].forEach(id => {
    document.getElementById(id).addEventListener('change', renderMaterials);
  });

  document.getElementById('uploadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('uploadFile').files[0]?.name;
    const subject = document.getElementById('subject').value;
    const format = title.split('.').pop().toUpperCase();
    const date = new Date().toISOString();

    const materials = JSON.parse(localStorage.getItem('eduhub-materials') || '[]');
    materials.push({ title, subject, format, date });
    localStorage.setItem('eduhub-materials', JSON.stringify(materials));

    alert('Upload saved!');
    e.target.reset();
    renderMaterials();
  });

  renderMaterials();
});

// Subjects list
const subjects = [
  "Chemistry", "Physics", "Biology", "Mathematics",
  "Computer Science", "English", "Islamic Studies"
];

// Populate subject dropdowns
function populateSubjects() {
  const subjectSelects = [
    document.getElementById("subject"),
    document.getElementById("event-subject"),
    document.getElementById("filter-subject")
  ];

  subjectSelects.forEach(select => {
    select.innerHTML = "";

    if (select.id === "filter-subject") {
      const allOption = document.createElement("option");
      allOption.value = "All Subjects";
      allOption.textContent = "All Subjects";
      select.appendChild(allOption);
    }

    subjects.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub;
      option.textContent = sub;
      select.appendChild(option);
    });
  });
}

// Upload logic
document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const uploader = document.getElementById("uploader").value.trim();
  const subject = document.getElementById("subject").value;
  const fileInput = document.getElementById("uploadFile");
  const file = fileInput.files[0];
  if (!file || !uploader || !subject) return;

  const materials = JSON.parse(localStorage.getItem("eduhub-materials") || "[]");
  materials.push({
    name: file.name,
    subject,
    format: file.name.split(".").pop().toUpperCase(),
    uploader,
    date: new Date().toISOString()
  });
  localStorage.setItem("eduhub-materials", JSON.stringify(materials));
  fileInput.value = "";
  renderMaterials();
});

// Render materials with filtering
function renderMaterials() {
  const list = document.getElementById("material-list");
  const filterSubject = document.getElementById("filter-subject").value;
  const filterFormat = document.getElementById("filter-format").value;
  const sortOrder = document.getElementById("sort-order").value;

  let materials = JSON.parse(localStorage.getItem("eduhub-materials") || "[]");

  if (filterSubject !== "All Subjects") {
    materials = materials.filter(m => m.subject === filterSubject);
  }

  if (filterFormat !== "All Formats") {
    materials = materials.filter(m => m.format === filterFormat);
  }

  if (sortOrder === "Newest First") {
    materials.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortOrder === "Oldest First") {
    materials.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOrder === "A–Z") {
    materials.sort((a, b) => a.name.localeCompare(b.name));
  }

  list.innerHTML = "";
  materials.forEach(m => {
    const card = document.createElement("div");
    card.className = "material-card";
    card.innerHTML = `
      <div class="material-title">${m.name}</div>
      <div class="material-meta">${m.subject} • ${m.format} • ${m.uploader}</div>
      <button class="view-btn" onclick="alert('Viewing ${m.name}')">View</button>
      <button class="delete-btn" onclick="deleteMaterial('${m.name}')">Delete</button>
    `;
    list.appendChild(card);
  });
}

// Delete material
function deleteMaterial(name) {
  let materials = JSON.parse(localStorage.getItem("eduhub-materials") || "[]");
  materials = materials.filter(m => m.name !== name);
  localStorage.setItem("eduhub-materials", JSON.stringify(materials));
  renderMaterials();
}

// Calendar logic
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
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar-day');
    calendarGrid.appendChild(emptyCell);
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
        const updated = events.filter(e => e !== ev);
        localStorage.setItem('eduhub-events', JSON.stringify(updated));
        renderCalendar();
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

// Add event
document.getElementById("add-event-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("event-title-input").value.trim();
  const subject = document.getElementById("event-subject").value;
  const date = e.target.dataset.date;
  if (!title || !subject || !date) return;

  const events = JSON.parse(localStorage.getItem("eduhub-events") || "[]");
  events.push({ title, subject, date });
  localStorage.setItem("eduhub-events", JSON.stringify(events));
  e.target.reset();
  e.target.style.display = "none";
  renderCalendar();
});

// Initial setup
populateSubjects();
renderMaterials();
renderCalendar();

// Re-render on filter change
document.getElementById("filter-subject").addEventListener("change", renderMaterials);
document.getElementById("filter-format").addEventListener("change", renderMaterials);
document.getElementById("sort-order").addEventListener("change", renderMaterials);

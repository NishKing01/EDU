body {
  font-family: sans-serif;
  margin: 0;
  background: #f4f4f4;
}
.app {
  display: flex;
}
.sidebar {
  width: 200px;
  background: #0077cc;
  color: white;
  padding: 1rem;
}
.sidebar a {
  color: white;
  text-decoration: none;
  display: block;
  margin: 0.5rem 0;
}
.profile {
  margin-top: 2rem;
}
.avatar {
  background: white;
  color: #0077cc;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
}
.main {
  flex: 1;
  padding: 1rem;
}
.card {
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
.grid {
  display: flex;
  gap: 1rem;
}
.class-card {
  background: #e0e0e0;
  padding: 1rem;
  border-radius: 6px;
  flex: 1;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}
.calendar-grid div {
  background: #e0e0e0;
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
}
.footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
}


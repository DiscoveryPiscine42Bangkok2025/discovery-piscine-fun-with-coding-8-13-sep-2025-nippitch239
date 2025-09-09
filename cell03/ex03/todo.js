
const FT_COOKIE = 'ft_todos';

let todos = [];

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}

function saveTodos() {
  try {
    setCookie(FT_COOKIE, JSON.stringify(todos), 365);
  } catch (e) {
    console.error(e);
  }
}

function loadTodos() {
  const raw = getCookie(FT_COOKIE);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) todos = parsed;
      else todos = [];
    } catch (e) {
      todos = [];
    }
  } else {
    todos = [];
  }
  render();
}

function createTodoElement(item) {
  const el = document.createElement('div');
  el.className = 'todo';
  el.dataset.id = item.id;
  el.textContent = item.text;
  el.title = 'คลิกเพื่อลบ';

  el.addEventListener('click', function () {
    const ok = confirm(`\n\n${item.text}\n\nยืนยันการลบ`);
    if (!ok) return;
    const idx = todos.findIndex(t => t.id === item.id);
    if (idx !== -1) {
      todos.splice(idx, 1);
      if (el.parentNode) el.parentNode.removeChild(el);
      saveTodos();
    }
  });

  return el;
}

function render() {
  const container = document.getElementById('ft_list');
  container.innerHTML = '';
  for (const item of todos) {
    container.appendChild(createTodoElement(item));
  }
}

document.getElementById('newBtn').addEventListener('click', function () {
  let text = prompt('กรอก TO DO ใหม่:');
  if (text === null) return;
  text = text.trim();
  if (text.length === 0) {
    alert('error');
    return;
  }
  const newItem = { id: String(Date.now()) + '-' + Math.floor(Math.random() * 10000), text };
  todos.unshift(newItem);

  const container = document.getElementById('ft_list');
  const el = createTodoElement(newItem);
  if (container.firstChild) container.insertBefore(el, container.firstChild);
  else container.appendChild(el);

  saveTodos();
});

window.addEventListener('load', loadTodos);
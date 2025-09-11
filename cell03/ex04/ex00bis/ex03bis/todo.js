
const FT_COOKIE = 'ft_todos';
let todos = [];

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
  }
  return null;
}

function saveTodos() {
  try { setCookie(FT_COOKIE, JSON.stringify(todos), 365); }
  catch (e) { console.error(e); }
}

function loadTodos() {

  if (getCookie(FT_COOKIE)) {
    try {
      const parsed = JSON.parse(getCookie(FT_COOKIE));
      todos = Array.isArray(parsed) ? parsed : [];
    } catch (e) { todos = []; }
  } else { todos = []; }
  render();
}

function createTodoElement(item) {
  const $el = $('<div>')
    .addClass('todo')
    .attr('data-id', item.id)
    .text(item.text)
    .attr('title', 'คลิกเพื่อลบ')
    .click(function () {
      if (!confirm(`\n\n${item.text}\n\nยืนยันการลบ`)) return;
      todos = todos.filter(t => t.id !== item.id);
      $el.remove();
      saveTodos();
    });
  return $el;
}

function render() {
  const $container = $('#ft_list').empty();
  for (const item of todos) {
    $container.append(createTodoElement(item));
  }
}

$('#newBtn').click(function () {
  let text = prompt();
  if (text === null) return;
  text = text.trim();
  if (text.length === 0) { alert('error'); return; }
  const newItem = { id: String(Date.now()) + '-' + Math.floor(Math.random() * 10000), text };
  todos.unshift(newItem);

  const $el = createTodoElement(newItem);
  const $container = $('#ft_list');
  if ($container.children().length) $container.prepend($el);
  else $container.append($el);

  saveTodos();
});

$(window).on('load', loadTodos);
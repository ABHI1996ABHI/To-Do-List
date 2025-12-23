(function () {
  const STORAGE_KEY = "todo-items";
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const count = document.getElementById("task-count");
  const emptyState = document.getElementById("empty-state");

  let items = loadItems();
  render();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    items = [createItem(title), ...items];
    input.value = "";
    persist();
    render();
  });

  list.addEventListener("click", (event) => {
    const target = event.target;
    const li = target.closest("li[data-id]");
    if (!li) return;
    const id = li.dataset.id;

    if (target.matches("input[type='checkbox']")) {
      items = items.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
      persist();
      render();
    }

    if (target.matches("button.delete-btn")) {
      items = items.filter((item) => item.id !== id);
      persist();
      render();
    }
  });

  function render() {
    list.innerHTML = "";
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.dataset.id = item.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.done;
      checkbox.setAttribute("aria-label", "Toggle completion");

      const title = document.createElement("p");
      title.className = "todo-title" + (item.done ? " done" : "");
      title.textContent = item.title;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.type = "button";
      deleteBtn.textContent = "Delete";

      li.append(checkbox, title, deleteBtn);
      fragment.appendChild(li);
    });

    list.appendChild(fragment);
    count.textContent = `${items.length} ${items.length === 1 ? "task" : "tasks"}`;
    emptyState.style.display = items.length ? "none" : "block";
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Could not save tasks", error);
    }
  }

  function loadItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn("Could not read saved tasks", error);
      return [];
    }
  }

  function createItem(title) {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    return { id, title, done: false };
  }
})();

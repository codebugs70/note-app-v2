const addNote = document.querySelector(".add-note");
const settings = document.querySelector(".settings");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".modal-close");
const addNewNote = document.querySelector(".add-new-note");
const noteTitle = document.querySelector("#title");
const noteDescription = document.querySelector("#description");
const wrapper = document.querySelector(".wrapper");

let notes = JSON.parse(localStorage.getItem("NOTES") || "[]");
let isEdit = false,
  editId;

// Add new note
addNewNote.addEventListener("click", handleAdd);
function handleAdd() {
  const title = noteTitle.value;
  const description = noteDescription.value;
  const date = new Date();

  if (isEdit) {
    isEdit = false;
    notes = notes.map((item) =>
      item.id === editId
        ? { ...item, title: title, description: description }
        : item
    );
    localStorage.setItem("NOTES", JSON.stringify(notes));
  } else {
    const noteInfo = {
      id: Date.now(),
      title: title,
      description: description,
      date: date.toLocaleDateString("en-US"),
    };
    notes.push(noteInfo);
    localStorage.setItem("NOTES", JSON.stringify(notes));
  }

  renderNotes();
  modal.style.display = "none";
  // clear input
  noteTitle.value = "";
  noteDescription.value = "";
}

// Render note
function renderNotes() {
  const noteItems = document.querySelectorAll(".note");
  noteItems.forEach((note) => note.remove());
  notes.forEach((item, index) => {
    const template = `<div class="note">
    <h1>${item.title}</h1>
    <p>
    ${item.description}
    </p>
    <div class="bottom">
      <span>${item.date}</span>
      <div onClick="handleToggle(this)" class="settings">
        <i class="fa-solid fa-ellipsis"></i>
        <div class="toggle">
          <span onClick="handleEdit(${index})" class="group">
            <i class="fa fa-edit icon-edit"></i>
            <span >Edit</span>
          </span>
          <span onClick="handleDelete(${item.id})" class="group">
            <i class="fa fa-trash icon-delete"></i>
            <span >Delete</span>
          </span>
        </div>
      </div>
    </div>
  </div>`;
    wrapper.insertAdjacentHTML("beforeend", template);
  });
}
renderNotes();

// Edit note
function handleEdit(noteIndex) {
  modal.style.display = "flex";
  const noteItem = notes[noteIndex];
  isEdit = true;
  editId = noteItem.id;
  noteTitle.value = noteItem.title;
  noteDescription.value = noteItem.description;
  addNewNote.textContent = "update note";
}

// Delete note
function handleDelete(noteId) {
  notes = notes.filter((item) => item.id !== noteId);
  localStorage.setItem("NOTES", JSON.stringify(notes));
  renderNotes();
}

// Toggle open settings
function handleToggle(element) {
  element.classList.add("show");
  document.addEventListener("click", function (e) {
    if (!element.contains(e.target) && !e.target.matches(".settings")) {
      element.classList.remove("show");
    }
  });
}

// Open modal
addNote.addEventListener("click", function () {
  modal.style.display = "flex";
});

// Close modal
document.addEventListener("click", function (e) {
  if (e.target.matches(".modal-close") || e.target.matches(".overlay")) {
    modal.style.display = "none";
  }
});

const addBtn = document.querySelector(".add-btn");
const closeBtn = document.querySelector(".modal-close");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal-overlay");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const addNewBtn = document.querySelector(".add-new-note");
const wrapper = document.querySelector(".wrapper");

let notes = JSON.parse(localStorage.getItem("NOTES") || "[]");
let isEdit = false,
  editId;

// Add new note when user hit enter on keyboard
// document.addEventListener("keyup", function (event) {
//   if (event.key === "Enter") {
//     addNewNote();
//   }
// });

/* Add new note */
addNewBtn.addEventListener("click", addNewNote);
function addNewNote() {
  const noteTitle = title.value;
  const noteDescription = description.value;

  const date = new Date().toLocaleDateString("vi-VN");

  if (!noteTitle && !noteDescription) return;
  // Check if user is editing --> update note
  if (isEdit) {
    notes = notes.map((item) =>
      item.id === editId
        ? { ...item, title: noteTitle, description: noteDescription }
        : item
    );
    isEdit = false;
  } else {
    notes.push({
      id: Date.now(),
      title: noteTitle,
      description: noteDescription,
      date: date,
    });
  }
  console.log(notes);
  localStorage.setItem("NOTES", JSON.stringify(notes));
  modal.classList.remove("show");
  renderNote();

  // Clear input value
  title.value = "";
  description.value = "";
}

// Handle edit note
function handleEditNote(noteIndex) {
  const noteItem = notes[noteIndex];

  isEdit = true;
  editId = noteItem.id;
  title.value = noteItem.title;
  description.value = noteItem.description;
  addNewBtn.textContent = "Update note";
  modal.classList.add("show");
  console.log(noteItem);
}

// Handle delete note
function handleDeleteNote(noteId) {
  console.log(noteId);
  notes = notes.filter((item) => item.id !== noteId);
  localStorage.setItem("NOTES", JSON.stringify(notes));
  renderNote();
}

// Toggle setting icon
function handleToggle(element) {
  element.classList.add("active");
  document.addEventListener("click", function (e) {
    if (!element.contains(e.target) && !e.target.matches(".settings")) {
      element.classList.remove("active");
    }
  });
}

/* Render note  */
function renderNote() {
  const note = document.querySelectorAll(".note");
  note.forEach((item) => item.remove());
  notes.forEach((note, index) => {
    const formattedDescription = note.description.replace(/\n/g, "<br>");
    const template = `<div class="note">
    <h1 class="note-title">${note.title}</h1>
    <p class="note-desc">${formattedDescription}</p>
    <div class="note-bottom">
      <p class="note-date">${note.date}</p>
      <div onClick="handleToggle(this)" class="note-toggle-icon">
        <i class="fa-solid fa-ellipsis"></i>
        <div class="settings">
          <span onClick="handleEditNote(${index})"><i class="fa fa-edit icon-edit"></i>Edit</span>
          <span onClick="handleDeleteNote(${note.id})"><i class="fa fa-trash icon-delete"></i>Delete</span>
        </div>
      </div>
    </div>
  </div>`;
    wrapper.insertAdjacentHTML("beforeend", template);
  });
}
renderNote();

/* Toggle modal */
addBtn.addEventListener("click", function () {
  modal.classList.add("show");
});
document.addEventListener("click", function (e) {
  if (e.target.matches(".modal-close") || e.target.matches(".modal-overlay")) {
    modal.classList.remove("show");
  }
});

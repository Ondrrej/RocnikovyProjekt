let id_user;
function auth() {
const login = prompt("Zadejte své uživatelské jméno:");
const password = prompt("Zadejte své heslo:");

// Přihlášení
fetch('singup.php', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        alert('Nesprávné přihlašovací údaje.');
    } else {
        let id_user = data.id_user;

function showNotes() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `notes.php?action=get_all&id_user=${id_user}`); // Přidání ID 
  xhr.send();
  xhr.onload = function () {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      notes.innerHTML = "";
      for (let note of response) {
        // Vytvoření elementů
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";
        const noteTitle = document.createElement("h3");
        noteTitle.textContent = note.title;
        const noteContent = document.createElement("p");
        noteContent.textContent = note.content;
        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.textContent = "Upravit";

        editLink.addEventListener("click", function () {
          noteId.value = note.id;
          noteTitle.value = note.title;
          noteContent.value = note.content;
          saveButton.textContent = "Aktualizovat poznámku";
        });
        const deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.textContent = "Smazat";

        deleteLink.addEventListener("click", function () {
          if (confirm("Opravdu chceš smazat tuto poznámku?")) {
            // Vytvoření AJAX požadavku
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "notes.php?action=delete&id=" + note.id);
            xhr.send();
            xhr.onload = function () {
              if (xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.success) {
                  alert("Poznámka byla úspěšně smazána");
                  showNotes();
                } else {
                  alert("Došlo k chybě: " + response.error);
                }
              } else {
                alert("Došlo k chybě: " + xhr.statusText);
              }
            };
          }
        });
        // Přidání elementů do div elementu poznámky
        noteDiv.appendChild(noteTitle);
        noteDiv.appendChild(noteContent);
        noteDiv.appendChild(editLink);
        noteDiv.appendChild(document.createTextNode(" | "));
        noteDiv.appendChild(deleteLink);
        notes.appendChild(noteDiv);
      }
    } else {
      alert("Došlo k chybě: " + xhr.statusText);
    }
  };
}

showNotes();
        

saveButton.addEventListener("click", function() {
  const id = noteId.value;
  const iduser = parseInt(id_user); 
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();

  if (title && content) {
    const params = `id=${id}&iduser=${iduser}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;

    const xhr = new XMLHttpRequest();
    // Tady je chyba - OPRAVENO
    if (noteId.value == 0){
      xhr.open("POST", "notes.php?action=create", true);
    } 
    if (noteId.value > 0){
      xhr.open("POST", "notes.php?action=update", true);
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.success) {
          alert("Poznámka byla úspěšně uložena");
          noteId.value = 0;
          noteTitle.value = "";
          noteContent.value = "";
          saveButton.textContent = "Uložit poznámku";
          showNotes();
        } else {
          alert("Došlo k chybě: " + noteId.value + response.error);
        }
      } else {
        alert("Došlo k chybě: " + xhr.statusText);
      }
    };

    xhr.send(params);
  } else {
    alert("Musíš vyplnit titulek a obsah poznámky");
  }
});





    }
})
.catch(error => {
    alert('Chyba při odesílání přihlašovacích údajů:', error);
})
}
auth();


 
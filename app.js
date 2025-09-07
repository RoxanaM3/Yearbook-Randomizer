import { db, doc, getDoc, setDoc, onSnapshot } from './firebase.js';

export function initializePage(group) {
  const nameInput = document.getElementById('nameInput');
  const addBtn = document.getElementById('addBtn');
  const pickBtn = document.getElementById('pickBtn');
  const pickedNameDiv = document.getElementById('pickedName');
  const nameList = document.getElementById('nameList');
  const docRef = doc(db, 'students', group);

// 🔑 Unlock admin via password
  if (unlockBtn) {
    unlockBtn.onclick = () => {
      const entered = prompt("Enter admin password:");
      if (entered === "Purple60pear") {
        isAdmin = true;
        alert("Admin unlocked");
        if (nameInput) nameInput.style.display = "inline-block";
        if (addBtn) addBtn.style.display = "inline-block";
        if (massInput) massInput.style.display = "block";
        if (massAddBtn) massAddBtn.style.display = "inline-block";
        renderNamesCache();
      } else {
        alert("Wrong password");
      }
    };
  }
  
   // Real-time sync
  let currentNames = [];
  onSnapshot(docRef, (snapshot) => {
    const data = snapshot.data() || { names: [] };
    currentNames = data.names;
    renderNames(currentNames);
  });

  // Add single name
  if (addBtn) {
    addBtn.onclick = async () => {
      if (!isAdmin) return alert("Only admin can add names");
      const newName = nameInput.value.trim();
      if (!newName) return;
      const updated = [...currentNames, { name: newName, active: true }];
      await setDoc(docRef, { names: updated });
      nameInput.value = '';
    };
  }

  // Add multiple names
  if (massAddBtn) {
    massAddBtn.onclick = async () => {
      if (!isAdmin) return alert("Only admin can add names");
      const newNames = massInput.value.split("\n").map(n => n.trim()).filter(n => n);
      if (newNames.length === 0) return;
      const updated = [...currentNames];
      newNames.forEach(name => updated.push({ name, active: true }));
      await setDoc(docRef, { names: updated });
      massInput.value = '';
    };
  }

  // Pick random
  pickBtn.onclick = async () => {
    if (currentNames.length === 0) {
      pickedNameDiv.textContent = "No names available!";
      return;
    }
    const active = currentNames.filter(n => n.active);
    if (active.length === 0) {
      pickedNameDiv.textContent = "No active names left!";
      return;
    }
    const chosen = active[Math.floor(Math.random() * active.length)];
    pickedNameDiv.textContent = chosen.name;
    const updated = currentNames.map(n =>
      n.name === chosen.name ? { ...n, active: false } : n
    );
    await setDoc(docRef, { names: updated });
  };

  // Render
  function renderNames(names) {
    nameList.innerHTML = '';
    names.forEach((person, index) => {
      const li = document.createElement('li');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = person.active;
      box.onchange = () => toggleActive(index, box.checked);

      li.textContent = person.name + ' ';
      li.prepend(box);

      if (isAdmin) {
        const del = document.createElement('button');
        del.textContent = '❌';
        del.onclick = () => deleteName(index);
        li.appendChild(del);
      }

      nameList.appendChild(li);
    });
  }

  function renderNamesCache() {
    renderNames(currentNames);
  }

  async function toggleActive(index, value) {
    const updated = [...currentNames];
    updated[index].active = value;
    await setDoc(docRef, { names: updated });
  }

  async function deleteName(index) {
    if (!isAdmin) return alert("Only admin can delete names");
    const updated = [...currentNames];
    updated.splice(index, 1);
    await setDoc(docRef, { names: updated });
  }
}

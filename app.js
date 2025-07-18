import { db, doc, getDoc, setDoc, onSnapshot } from './firebase.js';

export function initializePage(group) {
  const nameInput = document.getElementById('nameInput');
  const addBtn = document.getElementById('addBtn');
  const pickBtn = document.getElementById('pickBtn');
  const pickedNameDiv = document.getElementById('pickedName');
  const nameList = document.getElementById('nameList');
  const docRef = doc(db, 'students', group);

  // Load real-time data
  onSnapshot(docRef, (snapshot) => {
    const data = snapshot.data() || { names: [] };
    renderNames(data.names);
  });

  // Add name
  addBtn.onclick = async () => {
    const newName = nameInput.value.trim();
    if (!newName) return;
    const snapshot = await getDoc(docRef);
    const data = snapshot.data() || { names: [] };
    data.names.push({ name: newName, active: true });
    await setDoc(docRef, { names: data.names });
    nameInput.value = '';
  };

  // Pick random name
  pickBtn.onclick = async () => {
    const snapshot = await getDoc(docRef);
    const data = snapshot.data() || { names: [] };
    const active = data.names.filter(n => n.active);
    if (active.length === 0) {
      pickedNameDiv.textContent = 'No active names left!';
      return;
    }
    const chosen = active[Math.floor(Math.random() * active.length)];
    pickedNameDiv.textContent = chosen.name;
    const updated = data.names.map(n =>
      n.name === chosen.name ? { ...n, active: false } : n
    );
    await setDoc(docRef, { names: updated });
  };

  // Show names
  function renderNames(names) {
    nameList.innerHTML = '';
    names.forEach((person, index) => {
      const li = document.createElement('li');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = person.active;
      box.onchange = () => toggleActive(index, box.checked);

      const del = document.createElement('button');
      del.textContent = '❌';
      del.onclick = () => deleteName(index);

      li.textContent = person.name + ' ';
      li.prepend(box);
      li.appendChild(del);
      nameList.appendChild(li);
    });
  }

  async function toggleActive(index, value) {
    const snapshot = await getDoc(docRef);
    const names = snapshot.data().names;
    names[index].active = value;
    await setDoc(docRef, { names });
  }

  async function deleteName(index) {
    const snapshot = await getDoc(docRef);
    const names = snapshot.data().names;
    names.splice(index, 1);
    await setDoc(docRef, { names });
  }
}

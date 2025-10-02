const socket = io();
let selectedSlotId = null;
const TOTAL_SLOTS = 8; 

function loadSlots() {
  const date = document.getElementById('date').value;
  let hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value;
  const ampm = document.getElementById('ampm').value;

  if (ampm === 'PM' && hour !== '12') hour = (parseInt(hour)+12).toString().padStart(2,'0');
  if (ampm === 'AM' && hour === '12') hour = '00';
  const time = `${hour}:${minute}`;

  const hours = document.getElementById('hours').value;

  if (!date || !time || !hours) {
    alert('Please fill all fields');
    return;
  }

  fetch(`/slots?date=${date}&time=${time}&hours=${hours}`)
    .then(res => res.json())
    .then(data => {
      const parkingMap = document.getElementById('parkingMap');
      parkingMap.innerHTML = '';
      selectedSlotId = null;

      for (let i = 1; i <= TOTAL_SLOTS; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.textContent = `Slot ${i}`;
        slotDiv.classList.add('slot');

        const found = data.find(s => s.slot_number == i);
        if (found) {
          slotDiv.classList.add('available');
          slotDiv.onclick = () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slotDiv.classList.add('selected');
            selectedSlotId = found.id;
          };
        } else {
          slotDiv.classList.add('booked');
        }

        parkingMap.appendChild(slotDiv);
      }

      document.getElementById('mapContainer').style.display = 'block';
    });
}

function bookSlot() {
  if (!selectedSlotId) {
    alert('Please select a slot');
    return;
  }
  const date = document.getElementById('date').value;
  let hour = document.getElementById('hour').value;
  const minute = document.getElementById('minute').value;
  const ampm = document.getElementById('ampm').value;

  if (ampm === 'PM' && hour !== '12') hour = (parseInt(hour)+12).toString().padStart(2,'0');
  if (ampm === 'AM' && hour === '12') hour = '00';
  const time = `${hour}:${minute}`;
  const hours = parseInt(document.getElementById('hours').value);

  const payload = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    license_plate: document.getElementById('license').value,
    date,
    time,
    hours,
    slot_id: selectedSlotId
  };

  fetch('/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.message && data.message.includes('already booked')) {
      alert(data.message);
    } else {
      localStorage.setItem('booking', JSON.stringify(data));
      window.location.href = 'pay.html';
    }
  })
  .catch(err => console.error(err));
}


socket.on('slotUpdate', data => {

});

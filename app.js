document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  const eventsView = document.getElementById('view-events');
  const clubsView = document.getElementById('view-clubs');
  let eventsData = [];
  let clubsData = [];
  // fetch data
fetch('events.json')
  .then(res => res.json())
  .then(data => { eventsData = data; renderEvents(); })
  .catch(err => console.error(err));
fetch('clubs.json')
  .then(res => res.json())
  .then(data => { clubsData = data; renderClubs(); })
  .catch(err => console.error(err));
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'events') {
        eventsView.classList.remove('hidden');
        clubsView.classList.add('hidden');
      } else {
        clubsView.classList.remove('hidden');
        eventsView.classList.add('hidden');
      }
      updateViews();
    });
  });

  const searchInput = document.getElementById('search');
  const stateSelect = document.getElementById('state');
  searchInput.addEventListener('input', updateViews);
  stateSelect.addEventListener('change', updateViews);

  function updateViews() {
    if (!eventsView.classList.contains('hidden')) {
      renderEvents();
    } else {
      renderClubs();
    }
  }

  function renderEvents() {
    const list = document.getElementById('eventsList');
    list.innerHTML = '';
    const query = searchInput.value.trim().toLowerCase();
    const stateVal = stateSelect.value;
    eventsData.filter(ev => {
      if (stateVal && ev.state !== stateVal) return false;
      if (!query) return true;
      const fields = [ev.title, ev.description, ev.city, ev.state];
      return fields.some(f => f && f.toLowerCase().includes(query));
    }).forEach(ev => {
      const item = document.createElement('div');
      item.className = 'item';
      const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'short' }) : '';
      let html = '<h3>' + ev.title + '</h3>';
      html += '<div class="meta">' + dateStr + ' • ' + ev.city + '/' + ev.state + '</div>';
      html += '<p>' + (ev.description || '') + '</p>';
      if (ev.map) {
        html += '<div class="actions"><a href="' + ev.map + '" target="_blank" class="btn">Mapa</a></div>';
      }
      item.innerHTML = html;
      list.appendChild(item);
    });
  }

  function renderClubs() {
    const list = document.getElementById('clubsList');
    list.innerHTML = '';
    const query = searchInput.value.trim().toLowerCase();
    const stateVal = stateSelect.value;
    clubsData.filter(cl => {
      if (stateVal && cl.state !== stateVal) return false;
      if (!query) return true;
      const fields = [cl.name, cl.bio, cl.city, cl.state];
      return fields.some(f => f && f.toLowerCase().includes(query));
    }).forEach(cl => {
      const item = document.createElement('div');
      item.className = 'item';
      let actions = '';
      if (cl.whatsapp) {
        actions += '<a href="https://wa.me/' + cl.whatsapp + '" class="btn" target="_blank">WhatsApp</a>';
      }
      if (cl.instagram) {
        const handle = cl.instagram.replace('@','');
        actions += '<a href="https://instagram.com/' + handle + '" class="btn" target="_blank">Instagram</a>';
      }
      let html = '<h3>' + cl.name + '</h3>';
      html += '<div class="meta">' + cl.city + '/' + cl.state + '</div>';
      html += '<p>' + (cl.bio || '') + '</p>';
      if (actions) {
        html += '<div class="actions">' + actions + '</div>';
      }
      item.innerHTML = html;
      list.appendChild(item);
    });
  }
});

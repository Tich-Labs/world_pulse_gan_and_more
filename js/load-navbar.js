async function loadSharedNavbar(){
  try{
    const placeholder = document.getElementById('shared-navbar');
    const res = await fetch('shared-navbar.html');
    if(!res.ok) throw new Error('Navbar not found');
    const html = await res.text();
    if(placeholder){
      placeholder.innerHTML = html;
      // After injecting, highlight the active link
      try {
        const curr = (window.location.pathname.split('/').pop() || 'index.html');
        const currHash = window.location.hash.replace('#','');
        const anchors = placeholder.querySelectorAll('.styles_wrapper__ADBk2 a');
        anchors.forEach(a => {
          const href = a.getAttribute('href') || '';
          let linkPath = '';
          let linkHash = '';
          try {
            const url = new URL(href, window.location.href);
            linkPath = (url.pathname.split('/').pop() || 'index.html');
            linkHash = url.hash.replace('#','');
          } catch (e) {
            const parts = href.split('#');
            linkPath = (parts[0].split('/').pop() || 'index.html');
            linkHash = parts[1] || '';
          }

          if (linkPath === curr || (curr === '' && linkPath === 'index.html') || (linkHash && linkHash === currHash)) {
            a.classList.add('styles_active__selected');
          }
        });
      } catch (err) { console.warn('Navbar highlight failed', err); }
    } else {
      document.body.insertAdjacentHTML('afterbegin', html);
    }
  } catch(err){
    console.warn('Could not load shared navbar:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSharedNavbar);
} else {
  loadSharedNavbar();
}

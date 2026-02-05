async function loadSharedFooter(){
  try{
    const placeholder = document.getElementById('shared-footer');
    const res = await fetch('shared-footer.html');
    if(!res.ok) throw new Error('Footer not found');
    const html = await res.text();
    if(placeholder){
      placeholder.innerHTML = html;
    } else {
      // If no placeholder, append footer to body
      document.body.insertAdjacentHTML('beforeend', html);
    }
  } catch(err){
    console.warn('Could not load shared footer:', err);
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSharedFooter);
} else {
  loadSharedFooter();
}

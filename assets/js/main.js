document.addEventListener('DOMContentLoaded', function(){
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(a=>{
    try{ if(a.href === window.location.href) a.classList.add('active'); }catch(e){}
  });
  if(document.getElementById('wikiViewer')){
    const defaultDoc = 'wiki/README.md';
    const md = window.marked || null;
    const viewer = document.getElementById('wikiViewer');
    const fileSelect = document.getElementById('wikiFiles');
    async function loadMd(url){
      try{
        const res = await fetch(url);
        if(!res.ok) throw new Error('Not found');
        const text = await res.text();
        const clean = DOMPurify.sanitize(md(text));
        viewer.innerHTML = clean;
      }catch(e){
        viewer.innerHTML = '<p style="color:#f66">Document not found: '+url+'</p>';
      }
    }
    async function populate(){
      try{
        const res = await fetch('wiki/manifest.json');
        if(res.ok){
          const list = await res.json();
          fileSelect.innerHTML = '';
          list.forEach(f=>{
            const opt = document.createElement('button');
            opt.textContent = f.title;
            opt.className='card';
            opt.style.cursor='pointer';
            opt.addEventListener('click', ()=> loadMd('wiki/'+f.file));
            fileSelect.appendChild(opt);
          });
        } else {
          fileSelect.innerHTML = '<p class="card">No manifest found. Drop markdown files into wiki/ and add a manifest.json listing.</p>';
        }
      }catch(e){
        fileSelect.innerHTML = '<p class="card">No manifest found.</p>';
      }
    }
    loadMd(defaultDoc);
    populate();
  }
  const ytInputs = document.querySelectorAll('[data-yt]');
  ytInputs.forEach(node=>{
    node.addEventListener('click', ()=>{
      const id = node.dataset.yt;
      const holder = document.getElementById('mediaPlayer');
      holder.innerHTML = `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    })
  });
});
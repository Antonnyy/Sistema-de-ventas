    // Intersection Observer para revelar secciones con transición sutil
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in-view') })
    },{threshold:.2});
    document.querySelectorAll('.reveal, .promo-header').forEach(el=>io.observe(el));

    // Carrusel minimal con auto-play y controles
    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const prev = document.querySelector('.ctrl.prev');
    const next = document.querySelector('.ctrl.next');
    let index = 0, timer;

    function go(i){
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index*100}%)`;
    }
    function autoplay(){
      clearInterval(timer);
      timer = setInterval(()=> go(index+1), 5000);
    }
    prev.addEventListener('click', ()=>{ go(index-1); autoplay(); });
    next.addEventListener('click', ()=>{ go(index+1); autoplay(); });
    autoplay();

    // Efecto de luz que sigue el puntero en tarjetas (sutil)
    document.querySelectorAll('.card').forEach(card=>{
      card.addEventListener('pointermove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width)*100;
        const y = ((e.clientY - r.top) / r.height)*100;
        card.style.setProperty('--mx', x+'%');
        card.style.setProperty('--my', y+'%');
      });
    });
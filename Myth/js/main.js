/*
  main.js
  - Creates a snow particle system on a full-screen canvas.
  - Adds interactions for the pledge form and hero CTA (mock; no backend).
*/

// ---------------------- Snow Canvas ----------------------
(() => {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const num = Math.round((w * h) / 9000); // density based on viewport
  const flakes = [];

  function rand(min, max){return Math.random() * (max - min) + min}

  function init(){
    flakes.length = 0;
    for (let i=0;i<num;i++){
      flakes.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.6,3.6),
        d: rand(0.5,1.5),
        vx: rand(-0.3,0.8)
      });
    }
  }

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
  }

  function update(){
    for(let i=0;i<flakes.length;i++){
      const f = flakes[i];
      f.y += Math.pow(f.d, 1.2) + 0.4; // fall speed
      f.x += Math.sin(f.y * 0.01) * 0.6 + f.vx; // sideways drift
      if (f.y > h + 10){
        f.y = -10; f.x = rand(0,w);
      }
      if (f.x > w + 20) f.x = -20;
      if (f.x < -20) f.x = w + 20;
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    // faint vignette
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'rgba(10,16,24,0.0)');
    g.addColorStop(1,'rgba(0,0,0,0.2)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    ctx.fillStyle = 'rgba(230,245,255,0.9)';
    ctx.beginPath();
    for(const f of flakes){
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  let raf;
  function loop(){
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    raf = requestAnimationFrame(loop);
  });

  resize();
  raf = requestAnimationFrame(loop);
})();

// ---------------------- Form & CTA Interactions ----------------------
(() => {
  const pledgeBtn = document.getElementById('pledge-btn');
  const pledgeSoul = document.getElementById('pledge-soul');
  const pledgeForm = document.getElementById('pledge-form');
  const confirm = document.getElementById('pledge-confirm');
  const nameField = document.getElementById('name');
  const reasonField = document.getElementById('reason');

  // Smooth scroll helper
  function scrollToSupport(){
    const el = document.getElementById('support');
    if (!el) return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
  }

  // Hero CTA scrolls to the support form and adds a subtle highlight
  pledgeBtn && pledgeBtn.addEventListener('click', () => {
    scrollToSupport();
    // small pulse on the form
    const f = document.getElementById('pledge-form');
    if (f){
      f.animate([{boxShadow:'0 0 0 0 rgba(160,200,220,0.0)'},{boxShadow:'0 0 22px 6px rgba(120,170,190,0.08)'}],{duration:900,iterations:1});
    }
  });

  // 'Pledge Your Soul' shortcut pre-fills the reason and scrolls
  pledgeSoul && pledgeSoul.addEventListener('click', () => {
    scrollToSupport();
    if (reasonField) reasonField.value = "I offer my soul to Morana — I accept the calm of the eternal frost.";
    if (nameField) nameField.focus();
  });

  // Mock submission: validate and show a local confirmation. No backend.
  pledgeForm && pledgeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (nameField && nameField.value.trim()) || 'A faithful follower';
    const reason = (reasonField && reasonField.value.trim()) || 'For the frost.';
    // tiny validation
    if(name.length < 1 || reason.length < 5){
      confirm.textContent = 'Please provide your name and a reason.';
      confirm.style.color = '#d29';
      return;
    }

    // show an ephemeral confirmation
    confirm.style.color = '';
    confirm.innerHTML = `O noble ${escapeHtml(name)}, your oath is recorded in the frost.`;
    // simple fade-in
    confirm.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});

    // Clear form after short delay
    setTimeout(()=>{
      pledgeForm.reset();
    },600);
  });

  // Small helper to avoid XSS in the confirmation
  function escapeHtml(str){
    return str.replace(/[&<>"]/g, (c)=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
    }[c]));
  }
})();

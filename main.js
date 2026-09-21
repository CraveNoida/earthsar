/* Earthsar website — main script
   Content lives in js/config.js. */
(function(){
"use strict";
document.body.classList.remove("no-js");
const C=window.EARTHSAR_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const icon=(id,cls="")=>`<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const safeUrl=u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:""}catch(e){return ""}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),3200)}
$("#yr").textContent=new Date().getFullYear();


/* ================= STATE (from config) ================= */
const toTime=d=>{const t=d?Date.parse(d):NaN;return isNaN(t)?0:t};
const S={
  partners:C.partners||[],credentials:C.credentials||[],team:C.team||[],
  reviews:(C.reviews||[]).map((r,i)=>({id:"r"+i,...r,rating:Math.max(1,Math.min(5,+r.rating||5)),createdAt:toTime(r.date)})).sort((a,b)=>b.createdAt-a.createdAt),
  settings:Object.assign({},C.stats||{},C.contact||{}),
  hero:{image:C.heroImage||"",alt:C.heroImageAlt||"Earthsar advisors with clients"},
  showAll:false
};

/* ================= HERO ART ================= */
function heroSVG(){
  const W=480,H=560,VP={x:250,y:-900},B=640;
  const at=(bx,y)=>bx+(VP.x-bx)*(B-y)/(B-VP.y);
  const face=(x0,x1,fill,line,op,top)=>{
    let s=`<polygon points="${at(x0,B)},${B} ${at(x1,B)},${B} ${at(x1,top)},${top} ${at(x0,top)},${top}" fill="${fill}"/>`;
    for(let k=1;k<200;k++){const y=VP.y+(B-VP.y)*40/(40+k*1.6);if(y<top)break;s+=`<line x1="${at(x0,y)}" y1="${y}" x2="${at(x1,y)}" y2="${y}" stroke="${line}" stroke-opacity="${op}" stroke-width="1.2"/>`}
    const n=Math.round(Math.abs(x1-x0)/26);
    for(let i=1;i<n;i++){const bx=x0+(x1-x0)*i/n;s+=`<line x1="${bx}" y1="${B}" x2="${at(bx,top)}" y2="${top}" stroke="${line}" stroke-opacity="${op*.7}" stroke-width="1"/>`}
    return s;
  };
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract modern architecture rising into a clear sky">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF2FF"/><stop offset="1" stop-color="#F7FAFF"/></linearGradient>
  <linearGradient id="rf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A57C2"/><stop offset="1" stop-color="#003A88"/></linearGradient>
  <linearGradient id="lf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE8FA"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="96" cy="120" r="150" fill="#004AAD" opacity=".06"/>
  <circle cx="92" cy="118" r="30" fill="#F1770A"/>
  ${face(-60,70,"#C9DBF5","#004AAD",.25,250)}
  ${face(70,250,"url(#lf)","#004AAD",.28,-20)}
  ${face(250,470,"url(#rf)","#FFFFFF",.22,-20)}
  <line x1="${at(250,B)}" y1="${B}" x2="${at(250,-20)}" y2="-20" stroke="#fff" stroke-width="1.5" opacity=".7"/>
  <line x1="0" y1="452" x2="${W}" y2="452" stroke="#F1770A" stroke-width="3"/>
  </svg>`;
}
function renderHero(){
  const f=$("#heroFrame");
  if(S.hero.image){f.innerHTML=`<img src="${esc(S.hero.image)}" alt="${esc(S.hero.alt)}">`}else{f.innerHTML=heroSVG()}
}
renderHero();


/* ================= STATS ================= */
const STAT_DEF={years:{suf:"+"},satisfaction:{suf:"%"},properties:{suf:"K"},clients:{suf:"+"},associations:{suf:"+"}};
function renderStats(){
  $$(".stat-num").forEach(el=>{
    const k=el.dataset.k,v=S.settings[k],def=STAT_DEF[k]||{suf:""},suf=def.suf,n=parseInt(v,10);
    if(!v||isNaN(n)){el.classList.add("ph");el.innerHTML=`XX<sup>${suf}</sup>`;el.dataset.n="";return}
    el.dataset.n=n;el.innerHTML=`0<sup>${suf}</sup>`;
  });
}
function countUp(el){
  const n=+el.dataset.n,def=STAT_DEF[el.dataset.k]||{suf:""},suf=def.suf;
  if(reduce){el.innerHTML=`${n.toLocaleString("en-IN")}<sup>${suf}</sup>`;return}
  const t0=performance.now(),dur=1600;
  (function f(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.innerHTML=`${Math.round(n*e).toLocaleString("en-IN")}<sup>${suf}</sup>`;if(p<1)requestAnimationFrame(f)})(t0);
}

/* ================= CONTACT ================= */
function renderContact(){
  const c=S.settings||{};
  const tbd=t=>`<span class="tbd">${t}</span>`;
  const phone=c.phone?`<a href="tel:${esc(c.phone.replace(/\s+/g,""))}">${esc(c.phone)}</a>`:tbd("Phone number to be added");
  const email=c.email?`<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`:tbd("Email to be added");
  const addr=c.address?`<span>${esc(c.address)}</span>`:tbd("Office address to be added");
  const hrs=c.hours?`<span>${esc(c.hours)}</span>`:tbd("Office hours to be added");
  $("#cinfo").innerHTML=`<li><span class="ic" style="color:var(--heading)">${icon("i-phone")}</span><div><small>Call</small>${phone}</div></li>
  <li><span class="ic" style="color:var(--heading)">${icon("i-mail")}</span><div><small>Email</small>${email}</div></li>
  <li><span class="ic" style="color:var(--heading)">${icon("i-building")}</span><div><small>Office</small>${addr}</div></li>
  <li><span class="ic" style="color:var(--heading)">${icon("i-clock")}</span><div><small>Hours</small>${hrs}</div></li>`;
  $("#fContact").innerHTML=`${c.phone?`<li><a href="tel:${esc(c.phone.replace(/\s+/g,""))}">${esc(c.phone)}</a></li>`:""}${c.email?`<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`:""}${c.address?`<li>${esc(c.address)}</li>`:""}<li><a href="#contact">Send an enquiry</a></li>`;
}


/* ================= PARTNERS (marquee) ================= */
let carTimer=null;
function renderPartners(){
  const box=$("#partners");clearInterval(carTimer);
  if(!S.partners.length){
    box.innerHTML=`<div class="empty"><b>Partner logos will appear here</b>Our network is being updated.</div>`;return}
  /* Build a single tile markup */
  const tile=p=>{
    const w=safeUrl(p.website),tag=w?"a":"div",attrs=w?` href="${esc(w)}" target="_blank" rel="noopener noreferrer"`:"";
    return `<${tag} class="logo-tile"${attrs} title="${esc(p.name)}">${p.logo?`<img src="${esc(p.logo)}" alt="${esc(p.name)} logo" loading="lazy">`:`<span class="txtlogo">${esc(p.name)}</span>`}</${tag}>`;
  };

  /* Single row, duplicated for seamless loop */
  const all=S.partners.map(tile).join("");
  box.innerHTML=`<div class="marquee-track" aria-label="Associated companies">${all}${all}</div>`;
}

/* ================= CREDENTIALS ================= */
function renderCreds(){
  const g=$("#creds");
  if(!S.credentials.length){
    const ph=[["Registration","RERA registration","Registration number to be added"],["Membership","Industry membership","Association name to be added"],["Recognition","Award or recognition","Title and year to be added"]];
    g.innerHTML=ph.map(([t,h,m])=>`<article class="card cred ph"><span class="tag">${t}</span><h3>${h}</h3><div class="meta">${m}</div><p>Placeholder — only genuine credentials should be added in js/config.js.</p></article>`).join("");return}
  g.innerHTML=S.credentials.map(c=>`<article class="card card-hover cred reveal in"><span class="tag">${esc(c.type||"Credential")}</span><h3>${esc(c.title)}</h3><div class="meta">${esc([c.issuer,c.year].filter(Boolean).join(", "))}</div>${c.description?`<p>${esc(c.description)}</p>`:""}${c.reference?`<div class="ref">Reference: <b>${esc(c.reference)}</b></div>`:""}</article>`).join("");
}

/* ================= TEAM ================= */
function initials(n){return String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase()}
function renderTeam(){
  const g=$("#teamGrid");
  if(!S.team.length){
    g.innerHTML=[1,2,3].map(()=>`<article class="card member ph"><div class="member-photo"><span class="ini">${icon("i-user")}</span></div><div class="member-body"><h3>Advisor name</h3><div class="role">Designation</div><div class="div"></div><p>Placeholder profile — add real team members in js/config.js.</p></div></article>`).join("");
    $$(".member.ph .ini svg",g).forEach(s=>{s.style.width="64px";s.style.height="64px";s.style.color="var(--heading)"});return}
  g.innerHTML=S.team.map((m,idx)=>{
    const li=safeUrl(m.linkedin);
    const isFounder=idx===0||(m.role&&m.role.toLowerCase().includes("founder"));
    return `<article class="card card-hover member${isFounder?" member-founder":""} reveal in"><div class="member-photo">${m.photo?`<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`:`<span class="ini">${esc(initials(m.name))}</span>`}</div><div class="member-body">${isFounder?`<span class="tag tag-founder">Founder</span>`:""}<h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div><div class="div"></div>${m.experience?`<div class="xp">${esc(m.experience)}</div>`:""}${m.bio?`<p>${esc(m.bio)}</p>`:""}${li?`<a class="li" href="${esc(li)}" target="_blank" rel="noopener noreferrer">${icon("i-in")}LinkedIn</a>`:""}</div></article>`;
  }).join("");
}

/* ================= REVIEWS ================= */
const stars=(n,cls="")=>`<span class="stars ${cls}" aria-label="${n} out of 5 stars">${[1,2,3,4,5].map(i=>`<svg class="${i<=Math.floor(n+.25)?"":"off"}" aria-hidden="true"><use href="#i-star"/></svg>`).join("")}</span>`;
const fmtDate=t=>t?new Date(t).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"";
function videoInfo(u){
  if(!u)return null;const s=safeUrl(u);if(!s)return null;
  let m=s.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if(m)return{kind:"youtube",embed:`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`,url:s};
  m=s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if(m)return{kind:"vimeo",embed:`https://player.vimeo.com/video/${m[1]}?autoplay=1`,url:s};
  return{kind:"link",url:s};
}
function renderReviews(){
  const R=S.reviews,n=R.length;
  const avg=n?R.reduce((a,r)=>a+(+r.rating||0),0)/n:0;
  const dist=[5,4,3,2,1].map(k=>[k,R.filter(r=>+r.rating===k).length]);
  $("#summary").innerHTML=n?`<div class="big">${avg.toFixed(1)}</div>${stars(avg)}<div class="based">Based on ${n} published review${n>1?"s":""}</div>
    <div class="bars">${dist.map(([k,c])=>`<div class="bar"><span>${k}★</span><span class="t"><i style="width:${n?c/n*100:0}%"></i></span><span>${c}</span></div>`).join("")}</div>
    <button class="btn btn-primary" style="width:100%;margin-top:24px" data-review>Post Your Review</button>`
    :`<div class="big" style="color:var(--faint)">—</div>${stars(0)}<div class="based">No reviews published yet. Be the first to share your experience.</div><button class="btn btn-primary" style="width:100%;margin-top:24px" data-review>Post Your Review</button>`;
  const list=S.showAll?R:R.slice(0,6);
  $("#revGrid").innerHTML=n?list.map((r,i)=>{
    const vi=r.videoAsset?{kind:"file",url:r.videoAsset}:videoInfo(r.videoUrl);
    return `<article class="card rev"><div class="rev-h"><span class="avatar">${r.photo?`<img src="${esc(r.photo)}" alt="">`:esc(initials(r.name))}</span><div><div class="rev-name">${esc(r.name)}</div>${r.verified?`<span class="badge" style="color:var(--heading)">${icon("i-verified")}Verified Client</span>`:""}</div></div>
    <div class="rev-meta">${stars(+r.rating,"sm")}<span class="rev-date">${esc(fmtDate(r.createdAt))}</span></div>
    <p>${esc(r.message)}</p>
    ${(r.photos&&r.photos.length)?`<div class="rev-photos">${r.photos.map((p,j)=>`<button data-photo="${i}:${j}" aria-label="View photo ${j+1}"><img src="${esc(p)}" alt="" loading="lazy"></button>`).join("")}</div>`:""}
    ${vi?`<button class="rev-video" data-video="${esc(r.id)}">${icon("i-video")}<span>Watch video testimonial</span></button>`:""}</article>`}).join("")
    :`<div class="empty" style="grid-column:1/-1"><b>Client reviews will appear here</b>Reviews are published after our team confirms them.</div>`;
  $$(".rev-video svg").forEach(s=>{s.style.width="20px";s.style.height="20px"});
  $$(".badge svg").forEach(s=>{s.style.width="14px";s.style.height="14px"});
  $("#moreWrap").innerHTML=n>6?`<button class="btn btn-secondary" id="moreBtn">${S.showAll?"Show fewer reviews":`Show all ${n} reviews`}</button>`:"";
  const mb=$("#moreBtn");if(mb)mb.onclick=()=>{S.showAll=!S.showAll;renderReviews()};
  $$("[data-photo]").forEach(b=>b.onclick=()=>{const[i,j]=b.dataset.photo.split(":").map(Number);openLightbox(list[i].photos[j])});
  $$("[data-video]").forEach(b=>b.onclick=()=>openVideo(S.reviews.find(r=>r.id===b.dataset.video)));
  renderVideos();
}
function renderVideos(){
  const V=S.reviews.filter(r=>r.videoAsset||videoInfo(r.videoUrl));
  const cards=V.slice(0,6).map(r=>`<button class="card vid card-hover" data-vid="${esc(r.id)}"><div class="vid-thumb">${r.photos&&r.photos[0]?`<img class="bgimg" src="${esc(r.photos[0])}" alt="">`:""}<span class="ring"></span><span class="play">${icon("i-play")}</span></div><div class="vid-body"><b>${esc(r.name)}</b><span>${r.verified?"Verified Client · ":""}${esc(fmtDate(r.createdAt))}</span></div></button>`);
  if(cards.length<3)cards.push(`<button class="card vid invite card-hover${cards.length?"":" wide"}" data-review><div class="vid-thumb"><span class="ring"></span><span class="play">${icon("i-play")}</span></div><div class="vid-body"><b>Share your story on video</b><span>${cards.length?"Add a YouTube or Vimeo link with your review.":"Video testimonials from Earthsar clients will appear here. Worked with us? Add a YouTube or Vimeo link when you post your review."}</span></div></button>`);
  $("#vidGrid").innerHTML=cards.join("");
  $$(".play svg").forEach(s=>{s.style.width="24px";s.style.height="24px"});
  $$("[data-vid]").forEach(b=>b.onclick=()=>openVideo(S.reviews.find(r=>r.id===b.dataset.vid)));
}

renderHero();renderStats();renderContact();renderPartners();renderCreds();renderTeam();renderReviews();

/* ================= MODAL ================= */
let lastFocus=null;
function openModal(html,cls=""){
  lastFocus=document.activeElement;
  const box=$("#modalBox");box.className="modal-box "+cls;box.innerHTML=html;
  $("#modal").classList.add("open");document.body.style.overflow="hidden";
  const f=box.querySelector("input,button,select,textarea,[tabindex]");if(f)setTimeout(()=>f.focus(),30);
}
function closeModal(){$("#modal").classList.remove("open");$("#modalBox").innerHTML="";document.body.style.overflow="";if(lastFocus)lastFocus.focus()}
document.addEventListener("click",e=>{if(e.target.closest("[data-close]"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("#modal").classList.contains("open"))closeModal()});
const xBtn=`<button class="modal-x" data-close aria-label="Close">${icon("i-x")}</button>`;
function openLightbox(src){openModal(`${xBtn}<div class="lightbox"><img src="${esc(src)}" alt="Photo shared with review"></div>`,"media")}
function openVideo(r){
  if(!r)return;
  if(r.videoAsset){openModal(`${xBtn}<div class="media-frame"><video src="${esc(r.videoAsset)}" controls autoplay playsinline></video></div><div class="media-alt"><span>${esc(r.name)}</span></div>`,"media");return}
  const v=videoInfo(r.videoUrl);if(!v)return;
  if(v.kind==="link"){window.open(v.url,"_blank","noopener");return}
  openModal(`${xBtn}<div class="media-frame"><iframe src="${esc(v.embed)}" title="Video testimonial from ${esc(r.name)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><div class="media-alt"><span>${esc(r.name)} — video testimonial</span><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Open on ${v.kind==="youtube"?"YouTube":"Vimeo"}</a></div>`,"media");
}


/* ================= FORM SENDING ================= */
async function send(endpoint,formData){
  if(!endpoint)throw new Error("not_configured");
  const r=await fetch(endpoint,{method:"POST",body:formData,headers:{Accept:"application/json"}});
  if(!r.ok)throw new Error("failed");
}

/* ================= REVIEW FORM ================= */
function openReviewForm(){
  openModal(`<div class="modal-h"><div><h3 id="modalTitle">Share your experience</h3><p>Your review will appear after our team confirms it.</p></div>${xBtn}</div>
  <div class="modal-b"><form id="revForm" novalidate><div class="form-grid">
    <div class="fld"><label for="r-name">Name</label><input id="r-name" autocomplete="name" required><div class="emsg">Enter your name.</div></div>
    <div class="fld"><label for="r-email">Email</label><input id="r-email" type="email" autocomplete="email" required><div class="hint">Not shown publicly.</div><div class="emsg">Enter a valid email address.</div></div>
    <div class="fld full"><label for="r-phone">Phone <span class="opt">(optional, not shown publicly)</span></label><input id="r-phone" type="tel" autocomplete="tel"></div>
    <div class="fld full" id="rateFld"><label id="rateLbl">Your rating</label><div style="display:flex;flex-wrap:wrap"><div class="star-pick" role="radiogroup" aria-labelledby="rateLbl">${[1,2,3,4,5].map(i=>`<button type="button" role="radio" aria-checked="false" aria-label="${i} star${i>1?"s":""}" data-s="${i}">${icon("i-star")}</button>`).join("")}</div><span class="star-txt" id="starTxt"></span></div><div class="emsg">Choose a rating from 1 to 5 stars.</div></div>
    <div class="fld full"><label for="r-msg">Your review</label><textarea id="r-msg" required maxlength="1500" placeholder="What did Earthsar help you with, and how was the experience?"></textarea><div class="emsg">Write a few words about your experience.</div></div>
    <div class="fld"><label>Profile photo <span class="opt">(optional)</span></label><label class="drop"><input type="file" accept="image/*" id="r-photo"><span class="dic" style="color:var(--heading)">${icon("i-user")}</span><span><b id="r-photo-l">Add a photo</b><span>JPG or PNG</span></span></label></div>
    <div class="fld"><label>Photos <span class="opt">(up to 4)</span></label><label class="drop"><input type="file" accept="image/*" multiple id="r-photos"><span class="dic" style="color:var(--heading)">${icon("i-image")}</span><span><b id="r-photos-l">Add photos</b><span>From your experience</span></span></label></div>
    <div class="fld full"><label>Video testimonial <span class="opt">(optional, up to 20 MB)</span></label><label class="drop"><input type="file" accept="video/mp4,video/webm,video/quicktime" id="r-video"><span class="dic" style="color:var(--heading)">${icon("i-video")}</span><span><b id="r-video-l">Upload a video</b><span>MP4, MOV or WebM</span></span></label></div>
    <div class="fld full"><label for="r-vurl">YouTube or Vimeo link <span class="opt">(optional)</span></label><input id="r-vurl" type="url" placeholder="https://youtu.be/…"><div class="emsg">Paste a full YouTube or Vimeo link.</div></div>
  </div>
  <div class="progress" id="rProg"><i></i></div>
  <div class="form-foot"><span class="note-err" id="rErr"></span><button class="btn btn-primary" type="submit" id="rBtn">Submit review</button></div></form></div>`);
  const f={rating:0};
  const labels=["","Poor","Fair","Good","Very good","Excellent"];
  const paint=n=>$$(".star-pick button").forEach(b=>{b.classList.toggle("on",+b.dataset.s<=n);b.setAttribute("aria-checked",+b.dataset.s===f.rating?"true":"false")});
  $$(".star-pick button").forEach(b=>{b.onclick=()=>{f.rating=+b.dataset.s;paint(f.rating);$("#starTxt").textContent=labels[f.rating];$("#rateFld").classList.remove("err")};b.onmouseenter=()=>paint(+b.dataset.s);b.onmouseleave=()=>paint(f.rating)});
  const label=(inp,lbl,def)=>$(inp).onchange=e=>{const fs=Array.from(e.target.files);$(lbl).textContent=fs.length?(fs.length>1?`${fs.length} files selected`:fs[0].name):def};
  label("#r-photo","#r-photo-l","Add a photo");label("#r-photos","#r-photos-l","Add photos");label("#r-video","#r-video-l","Upload a video");
  $("#revForm").onsubmit=async e=>{
    e.preventDefault();$("#rErr").textContent="";
    const name=$("#r-name").value.trim(),email=$("#r-email").value.trim(),msg=$("#r-msg").value.trim(),vurl=$("#r-vurl").value.trim();
    const bad=[];const mark=(id,ok)=>{$(id).closest(".fld").classList.toggle("err",!ok);if(!ok)bad.push(id)};
    mark("#r-name",!!name);mark("#r-email",/^\S+@\S+\.\S+$/.test(email));mark("#r-msg",msg.length>=3);
    $("#rateFld").classList.toggle("err",!f.rating);if(!f.rating)bad.push("rate");
    const vi=vurl?videoInfo(vurl):null;mark("#r-vurl",!vurl||(vi&&vi.kind!=="link"));
    const photos=Array.from($("#r-photos").files).slice(0,4),video=$("#r-video").files[0];
    if(video&&video.size>20*1024*1024){$("#rErr").textContent="That video is larger than 20 MB. Use a shorter clip or a YouTube link.";return}
    if(bad.length){$("#rErr").textContent="Check the highlighted fields.";return}
    const fd=new FormData();
    fd.append("_subject",`New Earthsar review from ${name}`);fd.append("form","Client review");
    fd.append("name",name);fd.append("email",email);fd.append("phone",$("#r-phone").value.trim());
    fd.append("rating",f.rating);fd.append("review",msg);fd.append("video_link",vi?vi.url:"");
    if($("#r-photo").files[0])fd.append("profile_photo",$("#r-photo").files[0]);
    photos.forEach((p,i)=>fd.append("photo_"+(i+1),p));if(video)fd.append("video",video);
    const btn=$("#rBtn"),prog=$("#rProg"),bar=$("i",prog);btn.disabled=true;prog.classList.add("show");bar.style.width="40%";
    try{
      await send(C.forms&&C.forms.reviewEndpoint,fd);bar.style.width="100%";
      setTimeout(()=>{$("#modalBox").innerHTML=`<div class="modal-h"><div><h3>Thank you, ${esc(name.split(" ")[0])}.</h3><p>Your review has been sent. It will appear on the site after our team confirms it.</p></div>${xBtn}</div><div class="modal-b"><button class="btn btn-primary" data-close>Done</button></div>`},300);
    }catch(er){btn.disabled=false;prog.classList.remove("show");
      $("#rErr").textContent=er.message==="not_configured"?"Review submissions are not set up yet. Add a form endpoint in js/config.js.":"The review could not be sent. Check your connection and try again."}
  };
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-review]");if(b){e.preventDefault();openReviewForm()}});

/* ================= ENQUIRY ================= */
$("#enqForm").onsubmit=async e=>{
  e.preventDefault();$("#enqErr").textContent="";$("#enqOk").classList.remove("show");
  const g=id=>$(id).value.trim();const bad=[];
  const mark=(id,ok)=>{$(id).closest(".fld").classList.toggle("err",!ok);if(!ok)bad.push(id)};
  mark("#e-name",!!g("#e-name"));mark("#e-phone",g("#e-phone").replace(/\D/g,"").length>=7);mark("#e-email",!g("#e-email")||/^\S+@\S+\.\S+$/.test(g("#e-email")));
  $("#consentFld").classList.toggle("err",!$("#e-consent").checked);if(!$("#e-consent").checked)bad.push("c");
  if(bad.length){$("#enqErr").textContent="Check the highlighted fields.";return}
  const fd=new FormData();
  fd.append("_subject",`New Earthsar enquiry from ${g("#e-name")}`);fd.append("form","Enquiry");
  fd.append("name",g("#e-name"));fd.append("phone",g("#e-phone"));fd.append("email",g("#e-email"));
  fd.append("topic",$("#e-topic").value);fd.append("message",g("#e-msg"));
  const btn=$("#enqBtn");btn.disabled=true;
  try{await send(C.forms&&C.forms.enquiryEndpoint,fd);$("#enqForm").reset();$("#enqOk").classList.add("show")}
  catch(er){
    if(er.message==="not_configured"){
      const to=S.settings.email;
      if(to){location.href=`mailto:${to}?subject=${encodeURIComponent("Enquiry from "+g("#e-name"))}&body=${encodeURIComponent(`Name: ${g("#e-name")}\nPhone: ${g("#e-phone")}\nEmail: ${g("#e-email")}\nAdvice on: ${$("#e-topic").value}\n\n${g("#e-msg")}`)}`}
      else $("#enqErr").textContent="The enquiry form is not set up yet. Add a form endpoint in js/config.js.";
    }else $("#enqErr").textContent="The enquiry could not be sent. Check your connection and try again.";
  }
  btn.disabled=false;
};

/* ================= LEGAL ================= */
document.addEventListener("click",e=>{const b=e.target.closest("[data-legal]");if(!b)return;
  const url=C.legal&&C.legal[b.dataset.legal];if(url){b.href=url;return}
  e.preventDefault();
  const t={privacy:"Privacy policy",terms:"Terms of use",disclaimer:"Disclaimer"}[b.dataset.legal];
  openModal(`<div class="modal-h"><div><h3 id="modalTitle">${t}</h3><p>This page will hold Earthsar's approved ${t.toLowerCase()}.</p></div>${xBtn}</div><div class="modal-b"><p style="color:var(--muted)">The final wording is being prepared.</p></div>`)});

/* ================= NAV / SCROLL / REVEAL ================= */
const hdr=$("#hdr");
const onScroll=()=>hdr.classList.toggle("scrolled",scrollY>8);addEventListener("scroll",onScroll,{passive:true});onScroll();
$("#menuBtn").onclick=()=>{const o=hdr.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",o)};
$$("#nav a").forEach(a=>a.addEventListener("click",()=>{hdr.classList.remove("open");$("#menuBtn").setAttribute("aria-expanded","false")}));
$$("[data-talk]").forEach(a=>a.addEventListener("click",()=>setTimeout(()=>$("#e-name").focus({preventScroll:true}),600)));
const navMap=["home","about","expertise","why","associations","achievements","reviews","contact"];
const setActive=id=>$$("#nav a:not(.btn)").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id));
const secIO=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)})},{rootMargin:"-45% 0px -50% 0px"});
navMap.forEach(id=>{const el=document.getElementById(id);if(el)secIO.observe(el)});
const rIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rIO.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>rIO.observe(el));
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){$("#processRow").classList.add("in");o.disconnect()}},{threshold:.4}).observe($("#processRow"));
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){$$(".stat-num").forEach(el=>{if(el.dataset.n)countUp(el)});o.disconnect()}},{threshold:.5}).observe($("#stats"));
$$(".acc-btn").forEach(b=>b.onclick=()=>{const it=b.closest(".acc-item"),o=!it.classList.contains("open");it.classList.toggle("open",o);b.setAttribute("aria-expanded",o)});
requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add("loaded")));


})();

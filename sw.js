// Tiplus : réseau d'abord pour les pages (toujours la dernière version),
// copie locale seulement hors connexion. Icônes : copie locale d'abord.
const C='tiplus-demo-v4',F=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  const page=r.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('.webmanifest')||u.pathname.endsWith('/');
  if(page){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})));
  }
});

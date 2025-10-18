// Basic client-side behaviours
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('[data-setbg]').forEach(function(el){
    var bg = el.getAttribute('data-setbg'); if(bg) el.style.backgroundImage = 'url('+bg+')';
  });
});

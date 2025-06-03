document.getElementById('startBtn').onclick = function() {
  const name = document.getElementById('committeeName').value.trim();
  if(!name) {
    alert('กรุณากรอกชื่อกรรมการ');
    return;
  }
  // ส่งชื่อกรรมการไปหน้าถัดไปด้วย query string
  window.location.href = `score.html?committee=${encodeURIComponent(name)}`;
}

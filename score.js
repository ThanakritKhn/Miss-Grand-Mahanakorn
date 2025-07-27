// รายชื่อผู้เข้าแข่งขัน (อัปเดตใหม่ 16 คน)
const names = [
  "Auto Kill Omarterna", "tathuadin Band", "Liss Cascio", "	Sakura Mammoth", "	Namsom Howhe"
];

// ฟังก์ชันรวมคะแนน
window.updateTotal = function (index) {
  const getVal = (name) => {
    const el = document.querySelector(`[name="${name}${index}"]`);
    return el && el.value ? parseFloat(el.value) : 0;
  };
  const total = getVal("dress") + getVal("creative");
  document.getElementById(`total${index}`).textContent = total;
};

// ดึงชื่อกรรมการจาก query string
const params = new URLSearchParams(window.location.search);
const committee = params.get('committee') || '';
document.getElementById('displayCommitteeName').textContent = committee;

// ปุ่ม Test กรอกคะแนน random แล้วส่ง
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("testBtn").addEventListener("click", function () {
    for (let i = 1; i <= names.length; i++) {
      const setVal = (name, min, max) => {
        const el = document.querySelector(`[name="${name}${i}"]`);
        if (el) el.value = Math.floor(Math.random() * (max - min + 1)) + min;
      };
      setVal("dress", 0, 20);
      setVal("creative", 0, 20);
      if (typeof updateTotal === "function") updateTotal(i);
    }
    document.getElementById("score-form").dispatchEvent(new Event("submit", { cancelable: true }));
  });
});

// ----- ยืนยัน popup ก่อนส่งคะแนน -----
document.getElementById("score-form").addEventListener("submit", function (e) {
  e.preventDefault();
  showConfirmModal();
});

// ===== Popup Confirm modal logic =====
function showConfirmModal() {
  let modal = document.getElementById("confirmModal");
  if (!modal) {
    // --- ถ้ายังไม่มี modal ใน HTML, สร้างแบบ dynamic ---
    modal = document.createElement("div");
    modal.id = "confirmModal";
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-card">
        <div class="modal-header">
          <h4>ยืนยันการส่งคะแนน</h4>
        </div>
        <div class="modal-body">
          <p style="font-size:1.09rem;">คุณต้องการส่งคะแนนหรือไม่?</p>
          <p style="color:#1976d2; margin-top:1.1em; font-size:.99rem;">
            <b>หมายเหตุ:</b> ส่งหลังประกวดครบ 2 รอบเท่านั้น<br>
            และแต่ละกรรมการส่งได้เพียงครั้งเดียว
          </p>
        </div>
        <div class="modal-footer">
          <button id="modalCancel" type="button" class="btn btn-secondary">ยกเลิก</button>
          <button id="modalOk" type="button" class="btn btn-primary">ส่งคะแนน</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // เพิ่ม CSS popup confirm (กรณี HTML ไม่มี)
    if (!document.getElementById("confirmModalCSS")) {
      const style = document.createElement("style");
      style.id = "confirmModalCSS";
      style.innerHTML = `
      #confirmModal {
        position: fixed; inset: 0; z-index: 1111;
        display: flex; align-items: center; justify-content: center;
      }
      #confirmModal .modal-backdrop {
        position: fixed; inset: 0; background: #222b44c7;
        backdrop-filter: blur(2.5px);
        z-index: 0;
      }
      #confirmModal .modal-card {
        position: relative;
        background: #fff;
        border-radius: 1.5rem;
        box-shadow: 0 8px 48px #1976d25a, 0 2px 8px #2196f37c;
        z-index: 2;
        width: 95vw; max-width: 410px;
        padding: 2.1em 1.4em 1.2em 1.4em;
        animation: popin .21s cubic-bezier(.34,1.2,.72,1.01);
      }
      @keyframes popin {
        from { transform: scale(.93) translateY(30px); opacity:.3; }
        to   { transform: none; opacity:1; }
      }
      #confirmModal .modal-header h4 {
        margin: 0 0 .5em 0;
        color: #1976d2;
        font-weight: bold;
        font-size: 1.21rem;
        text-align: center;
      }
      #confirmModal .modal-body { text-align: center; }
      #confirmModal .modal-footer {
        display: flex;
        justify-content: center;
        gap: 1.5em;
        margin-top: 1.2em;
      }
      #modalCancel {
        background: #90caf9 !important;
        color: #1976d2 !important;
        font-weight: 600;
        border-radius: .9em !important;
        min-width: 96px;
      }
      #modalCancel:hover {
        background: #1976d2 !important; color: #fff !important;
      }
      #modalOk {
        background: linear-gradient(90deg,#1976d2 70%,#42a5f5 100%) !important;
        color: #fff !important;
        font-weight: 700;
        border-radius: .9em !important;
        min-width: 96px;
        box-shadow: 0 2px 14px #90caf97c;
      }
      #modalOk:hover {
        background: #1565c0 !important;
        color: #fff !important;
      }
      `;
      document.head.appendChild(style);
    }
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  document.getElementById("modalCancel").onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "";
  };
  document.getElementById("modalOk").onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "";
    sendScoreData();
  };
}

// ===== Custom Alert Success =====
function showCustomAlert(msgHtml, autoClose = 2600) {
  let alertDiv = document.getElementById("customAlert");
  if (!alertDiv) {
    alertDiv = document.createElement("div");
    alertDiv.id = "customAlert";
    alertDiv.innerHTML = `
      <div class="custom-alert-card">
        <div class="icon-success">
          <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="19" fill="#1976d2"/><path d="M11 20.8l5.7 5.2c.5.5 1.3.5 1.7 0l8.6-8.8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
        </div>
        <div class="custom-alert-msg"></div>
        <button id="closeAlertBtn" class="btn btn-primary">ปิด</button>
      </div>
    `;
    document.body.appendChild(alertDiv);

    // CSS
    if (!document.getElementById("customAlertCSS")) {
      const style = document.createElement("style");
      style.id = "customAlertCSS";
      style.innerHTML = `
      #customAlert {
        position: fixed; inset: 0; z-index: 3333;
        display: flex; align-items: center; justify-content: center;
        background: rgba(30,50,90,.13);
        backdrop-filter: blur(2.5px);
      }
      .custom-alert-card {
        background: #fff;
        border-radius: 1.4em;
        box-shadow: 0 4px 32px #2196f37d, 0 1.5px 8px #1976d236;
        min-width: 265px; max-width: 95vw;
        text-align: center;
        padding: 2em 1.3em 1.3em 1.3em;
        animation: popalert .25s cubic-bezier(.34,1.2,.72,1.01);
        position: relative;
      }
      @keyframes popalert {
        from { transform: scale(.95) translateY(18px); opacity:.4;}
        to   { transform: none; opacity:1;}
      }
      .icon-success {
        display: flex; justify-content: center; align-items: center;
        margin-bottom: 1em;
      }
      .icon-success svg { display: block;}
      .custom-alert-msg {
        font-size: 1.13rem;
        margin-bottom: 1.4em;
        color: #1976d2;
        font-weight: 500;
      }
      #closeAlertBtn {
        background: linear-gradient(90deg,#1976d2 70%,#42a5f5 100%) !important;
        color: #fff !important;
        font-weight: 700;
        border-radius: .95em !important;
        min-width: 105px;
        box-shadow: 0 1px 7px #90caf97c;
        font-size: 1.05rem;
        border: none;
      }
      #closeAlertBtn:hover { background: #1565c0 !important; }
      @media (max-width: 500px) {
        .custom-alert-card { min-width: 160px; font-size: 0.99rem;}
      }
      `;
      document.head.appendChild(style);
    }
  }

  alertDiv.querySelector('.custom-alert-msg').innerHTML = msgHtml;
  alertDiv.style.display = "flex";
  document.body.style.overflow = "hidden";

  let timer;
  document.getElementById("closeAlertBtn").onclick = function() {
    alertDiv.style.display = "none";
    document.body.style.overflow = "";
    if (timer) clearTimeout(timer);
  };
  timer = setTimeout(() => {
    alertDiv.style.display = "none";
    document.body.style.overflow = "";
  }, autoClose);
}

// ----- ส่งคะแนนจริง -----
function sendScoreData() {
  if (!committee) {
    showCustomAlert("<b>ไม่พบชื่อกรรมการ</b>", 2000);
    return;
  }
  const data = [];
  for (let i = 1; i <= names.length; i++) {
    const getVal = (name) => {
      const el = document.querySelector(`[name="${name}${i}"]`);
      return el ? parseFloat(el.value || 0) : 0;
    };
    const dress = getVal("dress");
    const creative = getVal("creative");
    const total = dress + creative;
    data.push({
      "คณะกรรมการ": committee,
      "หมายเลข": i,
      "ชื่อผู้เข้าแข่งขัน": names[i - 1],
      "การแต่งกาย": dress,
      "ความคิดสร้างสรรค์": creative,
      "รวม": total
    });
  }

  const scriptURL = "https://script.google.com/macros/s/AKfycbzscAZGp2Cb000Dp3CkOb6y7cZgMAtXcJv3cEtNOGLiNNtFy0gFnJAnIi6SQwbJYYmQ/exec";

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(() => {
      showCustomAlert('<b>ส่งคะแนนเรียบร้อยแล้ว</b><br><span style="font-size:.98em; color:#1976d2;">(ไม่สามารถตรวจสอบผลลัพธ์ได้)</span>');
    })
    .catch((err) => {
      showCustomAlert('<b>❌ เกิดข้อผิดพลาดในการส่งคะแนน</b>', 3000);
      console.error(err);
    });
}

// รายชื่อผู้เข้าแข่งขัน
const names = [
  "Sasha Whiterose", "Kyra Lillie", "Sakura Mammoth", "Nongpalah Maleawkub", "Pan Wythe",
  "Meen Basato", "Ivyy natacha", "Gummy Scalet", "สละสิทธิ์", "Blue Suwannaweth",
  "Nene Jraaaaa", "IRENE Morgan", "Bloody Heizenberg", "Irene Liss Ellie", "Kankeaw Maimeehuajai",
  "Yuki Unknow", "Ahoii Lionheart"
];

// ฟังก์ชันรวมคะแนน
window.updateTotal = function (index) {
  const getVal = (name) => {
    const el = document.querySelector(`[name="${name}${index}"]`);
    return el && el.value ? parseFloat(el.value) : 0;
  };
  const total = getVal("dress") + getVal("creative") + getVal("personality") + getVal("confidence") + getVal("speech");
  document.getElementById(`total${index}`).textContent = total;
};

// ดึงชื่อกรรมการจาก query string
const params = new URLSearchParams(window.location.search);
const committee = params.get('committee') || '';
document.getElementById('displayCommitteeName').textContent = committee;

// ส่งคะแนนไป Google Apps Script
document.getElementById("score-form").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!committee) {
    alert("ไม่พบชื่อกรรมการ");
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
    const personality = getVal("personality");
    const confidence = getVal("confidence");
    const speech = getVal("speech");
    const total = dress + creative + personality + confidence + speech;
    data.push({
      "คณะกรรมการ": committee,
      "หมายเลข": i,
      "ชื่อผู้เข้าแข่งขัน": names[i - 1],
      "การแต่งกาย": dress,
      "ความคิดสร้างสรรค์": creative,
      "บุคลิกภาพ + มารยาท": personality,
      "ความเชื่อมั่น": confidence,
      "การพูด": speech,
      "รวม": total
    });
  }

  // ✅ เปลี่ยนลิงก์ตรงนี้ให้เป็นของคุณ!
  const scriptURL = "https://script.google.com/macros/s/AKfycbzscAZGp2Cb000Dp3CkOb6y7cZgMAtXcJv3cEtNOGLiNNtFy0gFnJAnIi6SQwbJYYmQ/exec";

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText}`);
      }
      return res.json();
    })
    .then(msg => {
      alert("✅ ส่งคะแนนสำเร็จ!");
    })
    .catch(err => {
      console.error("❌ ERROR: ", err);
      alert("❌ เกิดข้อผิดพลาดในการส่งคะแนน:\n" + err.message);
    });
});

// ปุ่ม Test กรอกคะแนน random แล้วส่ง
document.getElementById("testBtn").addEventListener("click", function () {
  for (let i = 1; i <= names.length; i++) {
    const setVal = (name, min, max) => {
      const el = document.querySelector(`[name="${name}${i}"]`);
      if (el) el.value = Math.floor(Math.random() * (max - min + 1)) + min;
    };
    setVal("dress", 0, 20);
    setVal("creative", 0, 20);
    setVal("personality", 0, 20);
    setVal("confidence", 0, 10);
    setVal("speech", 0, 10);
    if (typeof updateTotal === "function") updateTotal(i);
  }

  // ส่งคะแนนอัตโนมัติ
  document.getElementById("score-form").dispatchEvent(new Event("submit", { cancelable: true }));
});

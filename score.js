// รายชื่อผู้เข้าแข่งขัน (ให้ตรงกับจำนวนแถวใน html)
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

// ส่งคะแนนไป Sheet.best
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

  // ส่งไป Sheet.best
  fetch("https://api.sheetbest.com/sheets/d56ee172-d048-441a-9554-88bb5445708a", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(msg => {
      alert("ส่งคะแนนสำเร็จ!");
    })
    .catch(err => {
      alert("เกิดข้อผิดพลาดในการส่งคะแนน");
      console.error(err);
    });
});

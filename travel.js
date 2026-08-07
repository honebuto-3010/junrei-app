// ▼ 写真プレビュー
const travelPhotoInput = document.getElementById("travelPhoto");
const previewTravel = document.getElementById("previewTravel");

travelPhotoInput.addEventListener("change", () => {
    const file = travelPhotoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        previewTravel.src = reader.result;
    };
    reader.readAsDataURL(file);
});

// ▼ 保存処理（旅カテゴリ）
document.getElementById("saveTravel").addEventListener("click", () => {
    const title = document.getElementById("travelTitle").value;
    const comment = document.getElementById("travelComment").value;
    const photo = previewTravel.src;

    if (!title || !comment || !photo) {
        alert("タイトル・コメント・写真を入力してください");
        return;
    }

    const data = {
        title,
        comment,
        photo,
        date: new Date().toLocaleString(),
        category: "travel"
    };

    const list = JSON.parse(localStorage.getItem("travelData") || "[]");
    list.push(data);
    localStorage.setItem("travelData", JSON.stringify(list));

    alert("巡礼記に追加しました！");
    renderTravelList();
});

// ▼ 表示（新しい順）
function renderTravelList() {
    const list = JSON.parse(localStorage.getItem("travelData") || "[]");

    // 旅カテゴリだけ表示
    const travelOnly = list.filter(item => item.category === "travel");

    travelOnly.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("travelList");

    container.innerHTML = travelOnly.map((item, index) => `
        <section class="mag-article">
            <div class="article-controls">
                <button onclick="deleteTravelReport(${index})">削除</button>
            </div>

            <img class="float-photo" src="${item.photo}">
            <h3>${item.title}</h3>
            <p class="mag-text">${item.comment}</p>
            <p class="mag-text">投稿日：${item.date}</p>
        </section>
    `).join("");
}

// ▼ 削除
function deleteTravelReport(index) {
    if (!confirm("この記事を削除しますか？")) return;

    const list = JSON.parse(localStorage.getItem("travelData") || "[]");

    // 旅カテゴリだけ抽出
    const travelOnly = list.filter(item => item.category === "travel");

    // 削除対象を取得
    const target = travelOnly[index];

    // 元の配列から削除
    const newList = list.filter(item => item !== target);

    localStorage.setItem("travelData", JSON.stringify(newList));

    renderTravelList();
}

renderTravelList();

// ▼ 写真プレビュー（撮影した画像を表示）
const photoInput = document.getElementById("foodPhoto");
const preview = document.getElementById("previewFood");

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
    };
    reader.readAsDataURL(file);
});

// ▼ 保存処理（旅レポートに追加）
document.getElementById("saveFood").addEventListener("click", () => {
    const title = document.getElementById("foodTitle").value;
    const comment = document.getElementById("foodComment").value;
    const photo = preview.src;

    if (!title || !comment || !photo) {
        alert("タイトル・コメント・写真を入力してください");
        return;
    }

    const data = {
        title,
        comment,
        photo,
        date: new Date().toLocaleString()
    };

    const list = JSON.parse(localStorage.getItem("travelReports") || "[]");
    list.push(data);
    localStorage.setItem("travelReports", JSON.stringify(list));

    alert("旅レポートに追加しました！");
    renderFoodList();
});

// ▼ food.html に雑誌風で表示（新しい順）
function renderFoodList() {
    const list = JSON.parse(localStorage.getItem("travelReports") || "[]");

    // ★ 新しい順に並べ替え
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("food-list");

    container.innerHTML = list.map((item, index) => `
        <section class="mag-article">
            <div class="article-controls">
                <button onclick="deleteFoodReport(${index})">削除</button>
            </div>

            <img class="float-photo" src="${item.photo}">
            <h3>${item.title}</h3>
            <p class="mag-text">${item.comment}</p>
            <p class="mag-text">投稿日：${item.date}</p>
        </section>
    `).join("");
}

// ▼ 削除機能（food.html 用）
function deleteFoodReport(index) {
    if (!confirm("この記事を削除しますか？")) return;

    const list = JSON.parse(localStorage.getItem("travelReports") || "[]");
    list.splice(index, 1);
    localStorage.setItem("travelReports", JSON.stringify(list));

    renderFoodList();
}

// 初期表示
renderFoodList();

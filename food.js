function compressImage(base64, maxWidth = 800) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
            const scale = maxWidth / img.width;
            const canvas = document.createElement("canvas");
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            resolve(canvas.toDataURL("image/jpeg", 0.7)); // 70%品質
        };
        img.src = base64;
    });
}

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
    const compressedPhoto = await compressImage(photo);

    if (!title || !comment ) {
        alert("タイトルとコメントを入力してください");
        return;
    }

    const data = {
        title,
        comment,
        photo: compressedPhoto,
        date: new Date().toLocaleString(),
        category: "food"
    };

    const list = JSON.parse(localStorage.getItem("travelData") || "[]");
    list.push(data);
    localStorage.setItem("travelData", JSON.stringify(list));

    alert("旅レポートに追加しました！");
    renderFoodList();
});

// ▼ food.html に雑誌風で表示（新しい順）
function renderFoodList() {
    const list = JSON.parse(localStorage.getItem("travelData") || "[]");
    //foodカテゴリだけ表示
    const foodOnly = list.filter(item => item.category === "food");

    foodOnly.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("food-list");

    container.innerHTML = foodOnly.map((item, index) => `
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

    const list = JSON.parse(localStorage.getItem("travelData") || "[]");

    //foodカテゴリだけ抽出
    const foodOnly = list.filter(item => item.category === "food");

    const target = foodOnly[index];

    //元の配列から削除
    const newlist = list.filter(item => item !== target);
    
    localStorage.setItem("travelData", JSON.stringify(newlist));

    renderFoodList();
}

// 初期表示
renderFoodList();

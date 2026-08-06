// ===============================
// 巡礼記レビュー（完全版）
// travel.html / food.html と連携して動く
// ===============================

// ▼ 一覧と詳細のDOM
const reviewList = document.getElementById("reviewList");
const reviewDetail = document.getElementById("reviewDetail");

// ▼ 一覧を描画（毎回最新の localStorage を読み込む）
function renderList() {

    // ★ 毎回最新のデータを読み込む（ここが最重要）
    const travelData = JSON.parse(localStorage.getItem("travelData") || "[]");

    reviewList.innerHTML = "";

    if (travelData.length === 0) {
        reviewList.innerHTML = `<p class="mag-text">まだ記事が保存されていません。</p>`;
        return;
    }

    // travel と food をまとめて一覧表示
    travelData.forEach((item, index) => {

        const div = document.createElement("div");
        div.className = "review-tile";

        // カテゴリ表示（巡礼記 / グルメ）
        const categoryLabel = item.category === "travel" ? "巡礼記" : "グルメ";

        div.innerHTML = `
            <h4>${item.title}</h4>
            <p class="mag-text">${categoryLabel}</p>
        `;

        // タップで詳細表示
        div.addEventListener("click", () => {
            showDetail(index);
        });

        reviewList.appendChild(div);
    });
}

// ▼ 詳細表示
function showDetail(index) {

    const travelData = JSON.parse(localStorage.getItem("travelData") || "[]");
    const item = travelData[index];

    reviewList.style.display = "none";
    reviewDetail.style.display = "block";

    const categoryLabel = item.category === "travel" ? "巡礼記" : "グルメ";

    reviewDetail.innerHTML = `
        <img src="${item.photo}" class="review-detail-photo">
        <h4>${item.title}</h4>
        <p class="mag-text">${item.comment}</p>
        <p class="mag-text">カテゴリ：${categoryLabel}</p>
        <p class="mag-text">投稿日：${item.date}</p>

        <button id="deleteBtn" class="wafu-delete-btn">
            この記事を削除する
        </button>

        <button id="backBtn" class="food-button">
            一覧に戻る
        </button>
    `;

    // ▼ 削除ボタン
    document.getElementById("deleteBtn").addEventListener("click", () => {

        if (!confirm("この記事を削除しますか？")) return;

        const newList = travelData.filter((_, i) => i !== index);

        localStorage.setItem("travelData", JSON.stringify(newList));

        reviewDetail.style.display = "none";
        reviewList.style.display = "block";

        renderList();
    });

    // ▼ 戻るボタン
    document.getElementById("backBtn").addEventListener("click", () => {
        reviewDetail.style.display = "none";
        reviewList.style.display = "block";
    });
}

// ▼ 初期表示
renderList();

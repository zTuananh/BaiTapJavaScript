/* Chuyển đổi Light / Dark Mode */
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = themeToggleBtn.querySelector('i');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

/* Hàm upDate chuẩn bài tập */
function upDate(previewPic) {
    const imageDiv = document.getElementById("image");
    imageDiv.innerHTML = previewPic.alt;
    imageDiv.style.backgroundImage = "url('" + previewPic.src + "')";
}

/* Hàm unDo chuẩn bài tập */
function unDo() {
    const imageDiv = document.getElementById("image");
    imageDiv.style.backgroundImage = "url('')";
    imageDiv.innerHTML = "Hover over an image below to display here.";
}

/* =========================================================
   XỬ LÝ CHẾ ĐỘ PHÓNG TO & TOÀN MÀN HÌNH (LIGHTBOX & ZOOM)
   ========================================================= */
const imageBox = document.getElementById('image');
const modal = document.getElementById('fullscreenModal');
const modalImg = document.getElementById('modalImg');
const closeModal = document.getElementById('closeModal');

// Hàm mở Modal hiển thị ảnh phóng to
function openModal(imgSrc) {
    if (!imgSrc || imgSrc === 'url("")' || imgSrc === 'none') return;
    const cleanUrl = imgSrc.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    modalImg.src = cleanUrl;
    modal.classList.add('active');
    modalImg.classList.remove('zoomed');
}

// 1. Nhấn vào khung hiển thị lớn #image để mở phóng to
imageBox.addEventListener('click', () => {
    openModal(imageBox.style.backgroundImage);
});

// 2. Nhấn trực tiếp vào bất kỳ ô ảnh nhỏ nào trong lưới grid
document.querySelectorAll('.preview').forEach(img => {
    img.addEventListener('click', (e) => {
        openModal(e.target.src);
    });
});

// 3. Nhấn vào ảnh trong Modal để bật/tắt Zoom 1.4x
modalImg.addEventListener('click', (e) => {
    e.stopPropagation();
    modalImg.classList.toggle('zoomed');
});

// 4. Đóng Modal và reset trạng thái phóng to
function hideModal() {
    modal.classList.remove('active');
    modalImg.classList.remove('zoomed');
}

closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
    }
});
/* =========================================================
   1. CÁC HÀM BÀI TẬP (INTERACTION & ACCESSIBILITY)
   ========================================================= */

// Hàm upDate cập nhật khung hiển thị chính
function upDate(previewPic) {
    console.log("Sự kiện MouseOver / Focus được kích hoạt cho ảnh:", previewPic.alt);
    const imageDiv = document.getElementById("image");
    if (imageDiv) {
        imageDiv.innerHTML = previewPic.alt;
        imageDiv.style.backgroundImage = "url('" + previewPic.src + "')";
    }
}

// Hàm unDo trả khung hiển thị chính về mặc định
function unDo() {
    console.log("Sự kiện MouseOut / Blur được kích hoạt");
    const imageDiv = document.getElementById("image");
    if (imageDiv) {
        imageDiv.style.backgroundImage = "url('')";
        imageDiv.innerHTML = "Hover over an image below to display here.";
    }
}

// Hàm addTabFocus tự động thêm tabindex cho toàn bộ ảnh trong thư viện
function addTabFocus() {
    console.log("Hàm onload (addTabFocus) bắt đầu chạy...");
    const images = document.querySelectorAll(".preview");

    for (let i = 0; i < images.length; i++) {
        images[i].setAttribute("tabindex", "0");
        console.log("Đã gán thành công tabindex='0' cho ảnh thứ " + (i + 1));
    }
}

/* =========================================================
   2. XỬ LÝ SỰ KIỆN GIAO DIỆN VÀ MODAL PHÓNG TO
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // --- Bật / Tắt giao diện Sáng - Tối ---
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            if (themeIcon) {
                themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        });
    }

    // --- Khởi tạo các phần tử Modal ---
    const imageBox = document.getElementById('image');
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.getElementById('closeModal');

    // Hàm mở Modal xem ảnh phóng to
    function openModal(imgSrc) {
        if (!modal || !modalImg || !imgSrc || imgSrc === 'url("")' || imgSrc === 'none') return;
        
        // Làm sạch chuỗi URL lấy từ backgroundImage
        const cleanUrl = imgSrc.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '').replace(/['"]/g, '');
        if (!cleanUrl) return;

        modalImg.src = cleanUrl;
        modal.classList.add('active');
        modal.style.display = 'flex'; // Ép buộc hiển thị khung Modal
        modalImg.classList.remove('zoomed');
    }

    // Hàm đóng Modal
    function hideModal() {
        if (modal && modalImg) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modalImg.classList.remove('zoomed');
        }
    }

    // 1. Click vào ô hiển thị lớn #image để mở Modal
    if (imageBox) {
        imageBox.addEventListener('click', () => {
            openModal(imageBox.style.backgroundImage);
        });
    }

    // 2. Click hoặc nhấn phím trên các ảnh preview
    document.querySelectorAll('.preview').forEach(img => {
        img.addEventListener('click', (e) => {
            openModal(e.target.src);
        });

        // Hỗ trợ người dùng bàn phím: Bấm Enter hoặc Space để mở Modal
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(img.src);
            }
        });
    });

    // 3. Bật / Tắt phóng to 1.4x khi nhấp vào ảnh trong Modal
    if (modalImg) {
        modalImg.addEventListener('click', (e) => {
            e.stopPropagation();
            modalImg.classList.toggle('zoomed');
        });
    }

    // 4. Lắng nghe các sự kiện đóng Modal (Nút X, Click ngoài lề, phím ESC)
    if (closeModal) closeModal.addEventListener('click', hideModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            hideModal();
        }
    });
});
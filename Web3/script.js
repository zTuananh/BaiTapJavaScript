/**
 * Hàm tính điểm trung bình
 * @param {number[]} scores - Mảng chứa điểm số của 5 môn
 * @returns {number} - Điểm trung bình
 */
function calculateAverage(scores) {
    if (!scores || scores.length === 0) return 0;
    let sum = scores.reduce((acc, val) => acc + val, 0);
    return sum / scores.length;
}

/**
 * Hàm xếp loại học tập
 * @param {number} avg - Điểm trung bình đã tính
 * @returns {string} - Tên xếp loại (Giỏi, Khá, Trung bình, Yếu)
 */
function classify(avg) {
    if (avg >= 8.0) {
        return "Giỏi";
    } else if (avg >= 6.5) {
        return "Khá";
    } else if (avg >= 5.0) {
        return "Trung bình";
    } else {
        return "Yếu";
    }
}

// Xử lý khi nhấn nút "Tính kết quả"
document.getElementById('calcBtn').addEventListener('click', function() {
    // Lấy giá trị từ các trường form
    const studentName = document.getElementById('studentName').value.trim();
    const s1 = document.getElementById('subj1').value;
    const s2 = document.getElementById('subj2').value;
    const s3 = document.getElementById('subj3').value;
    const s4 = document.getElementById('subj4').value;
    const s5 = document.getElementById('subj5').value;

    // Reset các thông báo lỗi trước đó
    document.getElementById('nameError').innerText = "";
    document.getElementById('subj1Error').innerText = "";
    document.getElementById('subj2Error').innerText = "";
    document.getElementById('subj3Error').innerText = "";
    document.getElementById('subj4Error').innerText = "";
    document.getElementById('subj5Error').innerText = "";

    let isValid = true;

    // Kiểm tra tính hợp lệ của Tên sinh viên
    if (studentName === "") {
        document.getElementById('nameError').innerText = "Tên sinh viên không được để trống!";
        isValid = false;
    }

    // Danh sách các điểm cần validate
    const inputList = [
        { val: s1, errId: 'subj1Error' },
        { val: s2, errId: 'subj2Error' },
        { val: s3, errId: 'subj3Error' },
        { val: s4, errId: 'subj4Error' },
        { val: s5, errId: 'subj5Error' }
    ];

    const scores = [];

    // Kiểm tra dữ liệu điểm 5 môn học
    inputList.forEach(item => {
        if (item.val === "") {
            document.getElementById(item.errId).innerText = "Điểm không được để trống!";
            isValid = false;
        } else {
            let num = parseFloat(item.val);
            if (isNaN(num) || num < 0 || num > 10) {
                document.getElementById(item.errId).innerText = "Điểm hợp lệ từ 0 đến 10!";
                isValid = false;
            } else {
                scores.push(num);
            }
        }
    });

    // Nếu dữ liệu hợp lệ hoàn toàn
    if (isValid) {
        // Gọi hàm tính toán theo yêu cầu
        const avg = calculateAverage(scores);
        const rank = classify(avg);

        // Hiển thị kết quả ra giao diện dạng bảng
        document.getElementById('resNameBadge').innerText = studentName;
        document.getElementById('resSubj1').innerText = scores[0];
        document.getElementById('resSubj2').innerText = scores[1];
        document.getElementById('resSubj3').innerText = scores[2];
        document.getElementById('resSubj4').innerText = scores[3];
        document.getElementById('resSubj5').innerText = scores[4];

        // Làm tròn điểm trung bình 2 chữ số thập phân
        document.getElementById('resAvg').innerText = avg.toFixed(2);

        // Hiển thị xếp loại và đổi màu sắc tương ứng
        const rankElement = document.getElementById('resClassify');
        rankElement.innerText = rank;
        
        rankElement.className = "sum-content"; // Reset class màu cũ
        if (rank === "Giỏi") rankElement.classList.add('tag-gioi');
        else if (rank === "Khá") rankElement.classList.add('tag-kha');
        else if (rank === "Trung bình") rankElement.classList.add('tag-tb');
        else rankElement.classList.add('tag-yeu');

        // Mở hiển thị bảng kết quả không cần reload trang
        document.getElementById('resultSection').classList.remove('hidden');
    } else {
        // Ẩn vùng kết quả nếu phát hiện dữ liệu lỗi
        document.getElementById('resultSection').classList.add('hidden');
    }
});

// Xử lý nút "Nhập lại" (Reset form và ẩn kết quả)
document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('scoreForm').reset();
    document.getElementById('resultSection').classList.add('hidden');
    
    // Xóa sạch text lỗi
    const errorSpans = document.querySelectorAll('.error-text');
    errorSpans.forEach(span => span.innerText = "");
});
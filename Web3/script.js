// Khởi tạo mảng lưu danh sách sinh viên từ LocalStorage (nếu có)
let studentList = JSON.parse(localStorage.getItem('STUDENT_LIST_DATA')) || [];
let editingIndex = -1; // -1 nghĩa là đang ở chế độ Thêm Mới, >= 0 là đang Chỉnh Sửa vị trí tương ứng

/**
 * Hàm tính điểm trung bình
 */
function calculateAverage(scores) {
    if (!scores || scores.length === 0) return 0;
    let sum = scores.reduce((acc, val) => acc + val, 0);
    return sum / scores.length;
}

/**
 * Hàm xếp loại học tập
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

// Khởi chạy hiển thị danh sách ngay khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    renderStudentTable();
});

// Xử lý khi nhấn nút "Tính & Lưu kết quả"
document.getElementById('calcBtn').addEventListener('click', function() {
    const studentName = document.getElementById('studentName').value.trim();
    const s1 = document.getElementById('subj1').value;
    const s2 = document.getElementById('subj2').value;
    const s3 = document.getElementById('subj3').value;
    const s4 = document.getElementById('subj4').value;
    const s5 = document.getElementById('subj5').value;

    // Reset thông báo lỗi
    clearErrorMessages();

    let isValid = true;

    // Kiểm tra tên sinh viên
    if (studentName === "") {
        document.getElementById('nameError').innerText = "Tên sinh viên không được để trống!";
        isValid = false;
    }

    const inputList = [
        { val: s1, errId: 'subj1Error' },
        { val: s2, errId: 'subj2Error' },
        { val: s3, errId: 'subj3Error' },
        { val: s4, errId: 'subj4Error' },
        { val: s5, errId: 'subj5Error' }
    ];

    const scores = [];

    // Validation điểm số
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

    if (isValid) {
        const avg = calculateAverage(scores);
        const rank = classify(avg);

        const studentData = {
            name: studentName,
            scores: scores,
            avg: avg,
            rank: rank
        };

        if (editingIndex === -1) {
            // Trường hợp 1: THÊM MỚI SINH VIÊN
            studentList.push(studentData);
        } else {
            // Trường hợp 2: CẬP NHẬT SINH VIÊN ĐÃ CÓ
            studentList[editingIndex] = studentData;
            editingIndex = -1; // Đưa về trạng thái ban đầu
            document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính & Lưu kết quả`;
        }

        // Lưu vào Local Storage
        saveToLocalStorage();

        // Hiển thị kết quả cá nhân vừa tính
        displaySingleResult(studentName, scores, avg, rank);

        // Render lại bảng danh sách tổng hợp
        renderStudentTable();

        // Xóa sạch ô nhập để sẵn sàng nhập sinh viên tiếp theo
        resetFormInputs();
    }
});

// Hiển thị kết quả chi tiết của 1 sinh viên vừa tính
function displaySingleResult(name, scores, avg, rank) {
    document.getElementById('resNameBadge').innerText = name;
    document.getElementById('resSubj1').innerText = scores[0];
    document.getElementById('resSubj2').innerText = scores[1];
    document.getElementById('resSubj3').innerText = scores[2];
    document.getElementById('resSubj4').innerText = scores[3];
    document.getElementById('resSubj5').innerText = scores[4];
    document.getElementById('resAvg').innerText = avg.toFixed(2);

    const rankElement = document.getElementById('resClassify');
    rankElement.innerText = rank;
    rankElement.className = "sum-content"; 
    
    if (rank === "Giỏi") rankElement.classList.add('tag-gioi');
    else if (rank === "Khá") rankElement.classList.add('tag-kha');
    else if (rank === "Trung bình") rankElement.classList.add('tag-tb');
    else rankElement.classList.add('tag-yeu');

    document.getElementById('resultSection').classList.remove('hidden');
}

// Render lại bảng danh sách tổng hợp
function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    const totalCount = document.getElementById('totalStudentsCount');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    tbody.innerHTML = '';
    totalCount.innerText = studentList.length;

    if (studentList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Chưa có sinh viên nào trong danh sách.
                </td>
            </tr>`;
        deleteAllBtn.classList.add('hidden');
        return;
    }

    deleteAllBtn.classList.remove('hidden');

    studentList.forEach((sv, index) => {
        const tr = document.createElement('tr');

        let tagClass = "tag-yeu";
        if (sv.rank === "Giỏi") tagClass = "tag-gioi";
        else if (sv.rank === "Khá") tagClass = "tag-kha";
        else if (sv.rank === "Trung bình") tagClass = "tag-tb";

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${sv.name}</strong></td>
            <td style="text-align: center;"><strong>${sv.avg.toFixed(2)}</strong></td>
            <td style="text-align: center;"><span class="${tagClass}" style="font-weight:700">${sv.rank}</span></td>
            <td style="text-align: center;">
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editStudent(${index})" title="Chỉnh sửa">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteStudent(${index})" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Hàm load thông tin sinh viên lên form để SỬA
function editStudent(index) {
    const sv = studentList[index];
    document.getElementById('studentName').value = sv.name;
    document.getElementById('subj1').value = sv.scores[0];
    document.getElementById('subj2').value = sv.scores[1];
    document.getElementById('subj3').value = sv.scores[2];
    document.getElementById('subj4').value = sv.scores[3];
    document.getElementById('subj5').value = sv.scores[4];

    editingIndex = index;
    document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Cập nhật sinh viên`;
    clearErrorMessages();

    // Cuộn mượt lên form nhập liệu
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hàm XÓA 1 sinh viên
function deleteStudent(index) {
    const svName = studentList[index].name;
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên "${svName}" khỏi danh sách?`)) {
        studentList.splice(index, 1);
        saveToLocalStorage();
        renderStudentTable();

        // Nếu đang sửa đúng sinh viên bị xóa thì hủy chế độ sửa
        if (editingIndex === index) {
            resetFormInputs();
            editingIndex = -1;
            document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính & Lưu kết quả`;
        }
    }
}

// Hàm XÓA TẤT CẢ danh sách
document.getElementById('deleteAllBtn').addEventListener('click', function() {
    if (confirm("⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TOÀN BỘ DANH SÁCH SINH VIÊN?")) {
        studentList = [];
        localStorage.removeItem('STUDENT_LIST_DATA');
        renderStudentTable();
        document.getElementById('resultSection').classList.add('hidden');
        resetFormInputs();
    }
});

// Xử lý nút "Nhập lại"
document.getElementById('resetBtn').addEventListener('click', function() {
    resetFormInputs();
    clearErrorMessages();
    editingIndex = -1;
    document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính & Lưu kết quả`;
    document.getElementById('resultSection').classList.add('hidden');
});

// Các hàm tiện ích
function saveToLocalStorage() {
    localStorage.setItem('STUDENT_LIST_DATA', JSON.stringify(studentList));
}

function clearErrorMessages() {
    const errorSpans = document.querySelectorAll('.error-text');
    errorSpans.forEach(span => span.innerText = "");
}

function resetFormInputs() {
    document.getElementById('scoreForm').reset();
}

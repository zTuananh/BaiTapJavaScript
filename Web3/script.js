// LocalStorage Management (Chức năng 1)
let studentList = JSON.parse(localStorage.getItem('STUDENT_LIST_DATA')) || [];
let editingIndex = -1;

const SUBJECT_NAMES = [
    "Giải tích 1",
    "Đại số tuyến tính",
    "Xác suất thống kê",
    "Tin học đại cương",
    "Xây dựng ứng dụng Web"
];

/**
 * 1. HÀM TÍNH ĐIỂM TRUNG BÌNH THANG 10
 */
function calculateAverage(scores) {
    if (!scores || scores.length === 0) return 0;
    let sum = scores.reduce((acc, val) => acc + val, 0);
    return sum / scores.length;
}

/**
 * 2. HÀM XẾP LOẠI HỌC TẬP
 */
function classify(avg) {
    if (avg >= 8.0) return "Giỏi";
    if (avg >= 6.5) return "Khá";
    if (avg >= 5.0) return "Trung bình";
    return "Yếu";
}

/**
 * 3. HÀM QUY ĐỔI ĐIỂM SỐ SANG THANG CHỮ & THANG 4 (ĐỦ 8 MỨC CHUẨN)
 * Quy tắc:
 * 8.5 - 10.0 -> A  (4.0)
 * 8.0 - 8.4  -> B+ (3.5)
 * 7.0 - 7.9  -> B  (3.0)
 * 6.5 - 6.9  -> C+ (2.5)
 * 5.5 - 6.4  -> C  (2.0)
 * 5.0 - 5.4  -> D+ (1.5)
 * 4.0 - 4.9  -> D  (1.0)
 * < 4.0      -> F  (0.0)
 */
function convertScale(score) {
    if (score >= 8.5) return { letter: "A",  gpa: 4.0 };
    if (score >= 8.0) return { letter: "B+", gpa: 3.5 };
    if (score >= 7.0) return { letter: "B",  gpa: 3.0 };
    if (score >= 6.5) return { letter: "C+", gpa: 2.5 };
    if (score >= 5.5) return { letter: "C",  gpa: 2.0 };
    if (score >= 5.0) return { letter: "D+", gpa: 1.5 };
    if (score >= 4.0) return { letter: "D",  gpa: 1.0 };
    return { letter: "F", gpa: 0.0 };
}

/**
 * XÉT DUYỆT HỌC BỔNG & CẢNH BÁO HỌC TẬP (Chức năng 3)
 * - Học bổng: ĐTB >= 8.5 VÀ không môn nào < 6.5
 * - Cảnh báo: ĐTB < 5.0 HOẶC có môn liệt < 3.0
 */
function evaluateAcademic(avg, scores) {
    const overallScale = convertScale(avg);
    const hasFailedSubject = scores.some(s => s < 3.0);
    const allSubjectsAbove65 = scores.every(s => s >= 6.5);

    let status = "Đạt";
    let statusClass = "status-pass";

    if (avg >= 8.5 && allSubjectsAbove65) {
        status = "Học Bổng 🌟";
        statusClass = "status-scholarship";
    } else if (avg < 5.0 || hasFailedSubject) {
        status = "Cảnh Báo ⚠️";
        statusClass = "status-warning";
    }

    return {
        gpa: overallScale.gpa,
        letter: overallScale.letter,
        status: status,
        statusClass: statusClass
    };
}

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    renderStudentTable();
    initFilterEvents();
});

// Xử lý sự kiện "Tính kết quả"
document.getElementById('calcBtn').addEventListener('click', function() {
    const studentName = document.getElementById('studentName').value.trim();
    const s1 = document.getElementById('subj1').value;
    const s2 = document.getElementById('subj2').value;
    const s3 = document.getElementById('subj3').value;
    const s4 = document.getElementById('subj4').value;
    const s5 = document.getElementById('subj5').value;

    clearErrorMessages();
    let isValid = true;

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

    inputList.forEach(item => {
        if (item.val === "") {
            document.getElementById(item.errId).innerText = "Điểm không được để trống!";
            isValid = false;
        } else {
            let num = parseFloat(item.val);
            if (isNaN(num) || num < 0 || num > 10) {
                document.getElementById(item.errId).innerText = "Điểm phải từ 0 đến 10!";
                isValid = false;
            } else {
                scores.push(num);
            }
        }
    });

    if (isValid) {
        const avg = calculateAverage(scores);
        const rank = classify(avg);
        const evalData = evaluateAcademic(avg, scores);

        // Quy đổi điểm 5 môn học
        const subjectDetails = scores.map((score, idx) => {
            const scale = convertScale(score);
            return {
                subject: SUBJECT_NAMES[idx],
                score10: score,
                letter: scale.letter,
                gpa: scale.gpa
            };
        });

        const studentData = {
            name: studentName,
            scores: scores,
            subjectDetails: subjectDetails,
            avg: avg,
            rank: rank,
            gpa: evalData.gpa,
            letter: evalData.letter,
            status: evalData.status,
            statusClass: evalData.statusClass
        };

        if (editingIndex === -1) {
            studentList.push(studentData);
        } else {
            studentList[editingIndex] = studentData;
            editingIndex = -1;
            document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính kết quả`;
        }

        saveToLocalStorage();
        displaySingleResult(studentData);
        renderStudentTable();
        resetFormInputs();
    }
});

// Hiển thị kết quả cá nhân
function displaySingleResult(sv) {
    document.getElementById('resNameBadge').innerText = sv.name;
    const tbody = document.getElementById('singleResultTbody');
    tbody.innerHTML = '';

    sv.subjectDetails.forEach((detail, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${detail.subject}</td>
            <td style="text-align: center;"><strong>${detail.score10}</strong></td>
            <td style="text-align: center;"><span class="badge-letter">${detail.letter}</span></td>
            <td style="text-align: center;">${detail.gpa.toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('resAvg').innerText = sv.avg.toFixed(2);
    document.getElementById('resGpa').innerText = `${sv.gpa.toFixed(1)} (${sv.letter})`;

    const rankElement = document.getElementById('resClassify');
    rankElement.innerText = sv.rank;
    rankElement.className = "sum-content";
    if (sv.rank === "Giỏi") rankElement.classList.add('tag-gioi');
    else if (sv.rank === "Khá") rankElement.classList.add('tag-kha');
    else if (sv.rank === "Trung bình") rankElement.classList.add('tag-tb');
    else rankElement.classList.add('tag-yeu');

    const statusElement = document.getElementById('resStatus');
    statusElement.innerText = sv.status;
    statusElement.className = `sum-content ${sv.statusClass}`;

    document.getElementById('resultSection').classList.remove('hidden');
}

/**
 * 5. TÌM KIẾM, LỌC & SẮP XẾP
 */
function getFilteredAndSortedStudents() {
    const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedRank = document.getElementById('filterRank').value;
    const sortBy = document.getElementById('sortBy').value;

    let result = studentList.filter(sv => {
        const matchesName = sv.name.toLowerCase().includes(keyword);
        const matchesRank = (selectedRank === 'ALL') || (sv.rank === selectedRank);
        return matchesName && matchesRank;
    });

    if (sortBy === 'avg-desc') {
        result.sort((a, b) => b.avg - a.avg);
    } else if (sortBy === 'avg-asc') {
        result.sort((a, b) => a.avg - b.avg);
    } else if (sortBy === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return result;
}

function initFilterEvents() {
    document.getElementById('searchInput').addEventListener('input', renderStudentTable);
    document.getElementById('filterRank').addEventListener('change', renderStudentTable);
    document.getElementById('sortBy').addEventListener('change', renderStudentTable);
}

// Render Bảng Danh Sách Sinh Viên
function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    const totalCount = document.getElementById('totalStudentsCount');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    const displayList = getFilteredAndSortedStudents();

    tbody.innerHTML = '';
    totalCount.innerText = studentList.length;

    if (displayList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Chưa có dữ liệu sinh viên phù hợp.
                </td>
            </tr>`;
        if (studentList.length === 0) deleteAllBtn.classList.add('hidden');
        return;
    }

    if (studentList.length > 0) deleteAllBtn.classList.remove('hidden');

    displayList.forEach((sv, index) => {
        const originalIndex = studentList.indexOf(sv);
        const tr = document.createElement('tr');

        let tagClass = "tag-yeu";
        if (sv.rank === "Giỏi") tagClass = "tag-gioi";
        else if (sv.rank === "Khá") tagClass = "tag-kha";
        else if (sv.rank === "Trung bình") tagClass = "tag-tb";

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${sv.name}</strong></td>
            <td style="text-align: center;"><strong>${sv.avg.toFixed(2)}</strong></td>
            <td style="text-align: center;">${sv.gpa.toFixed(1)} (${sv.letter})</td>
            <td style="text-align: center;"><span class="${tagClass}">${sv.rank}</span></td>
            <td style="text-align: center;"><span class="${sv.statusClass}">${sv.status}</span></td>
            <td style="text-align: center;" class="no-print">
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editStudent(${originalIndex})" title="Sửa">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteStudent(${originalIndex})" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Thao tác Sửa dữ liệu
function editStudent(originalIndex) {
    const sv = studentList[originalIndex];
    document.getElementById('studentName').value = sv.name;
    document.getElementById('subj1').value = sv.scores[0];
    document.getElementById('subj2').value = sv.scores[1];
    document.getElementById('subj3').value = sv.scores[2];
    document.getElementById('subj4').value = sv.scores[3];
    document.getElementById('subj5').value = sv.scores[4];

    editingIndex = originalIndex;
    document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Cập nhật sinh viên`;
    clearErrorMessages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Thao tác Xóa 1 sinh viên
function deleteStudent(originalIndex) {
    if (confirm(`Bạn có chắc muốn xóa sinh viên "${studentList[originalIndex].name}"?`)) {
        studentList.splice(originalIndex, 1);
        saveToLocalStorage();
        renderStudentTable();
        if (editingIndex === originalIndex) {
            resetFormInputs();
            editingIndex = -1;
            document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính kết quả`;
        }
    }
}

// Thao tác Xóa toàn bộ
document.getElementById('deleteAllBtn').addEventListener('click', function() {
    if (confirm("⚠️ Bạn có chắc chắn muốn xóa tất cả sinh viên?")) {
        studentList = [];
        localStorage.removeItem('STUDENT_LIST_DATA');
        renderStudentTable();
        document.getElementById('resultSection').classList.add('hidden');
        resetFormInputs();
    }
});

/**
 * 4. BÁO CÁO & XUẤT DỮ LIỆU
 */
// Xuất Excel CSV UTF-8
document.getElementById('exportCsvBtn').addEventListener('click', function() {
    if (studentList.length === 0) {
        alert("Danh sách trống! Không thể xuất file.");
        return;
    }

    let csvContent = "\uFEFF"; // Ký tự BOM chống lỗi font tiếng Việt trong Excel
    csvContent += "STT,Họ và tên,Giải tích 1,Đại số tuyến tính,Xác suất thống kê,Tin học đại cương,Xây dựng ứng dụng Web,ĐTB Thang 10,ĐTB Thang 4,Điểm chữ,Xếp loại,Trạng thái\n";

    studentList.forEach((sv, idx) => {
        let row = [
            idx + 1,
            `"${sv.name}"`,
            sv.scores[0],
            sv.scores[1],
            sv.scores[2],
            sv.scores[3],
            sv.scores[4],
            sv.avg.toFixed(2),
            sv.gpa.toFixed(1),
            sv.letter,
            sv.rank,
            `"${sv.status}"`
        ];
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_Sach_Diem_Sinh_Vien_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// In phiếu điểm / Print PDF
document.getElementById('printBtn').addEventListener('click', function() {
    if (studentList.length === 0) {
        alert("Danh sách sinh viên đang trống!");
        return;
    }
    window.print();
});

// Nút Nhập lại
document.getElementById('resetBtn').addEventListener('click', function() {
    resetFormInputs();
    clearErrorMessages();
    editingIndex = -1;
    document.getElementById('calcBtn').innerHTML = `<i class="fa-solid fa-calculator"></i> Tính kết quả`;
    document.getElementById('resultSection').classList.add('hidden');
});

// Helper Functions
function saveToLocalStorage() {
    localStorage.setItem('STUDENT_LIST_DATA', JSON.stringify(studentList));
}

function clearErrorMessages() {
    document.querySelectorAll('.error-text').forEach(span => span.innerText = "");
}

function resetFormInputs() {
    document.getElementById('scoreForm').reset();
}

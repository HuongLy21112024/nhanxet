document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const studentNamesInput = document.getElementById('student-names');
    const lessonDateInput = document.getElementById('lesson-date');
    const startBtn = document.getElementById('start-btn');
    
    const evaluationForm = document.getElementById('evaluation-form');
    const currentStudentName = document.getElementById('current-student-name');
    const currentIndexInfo = document.getElementById('current-index-info');
    const progressBarFill = document.getElementById('progress-bar-fill');
    
    const resultsContainer = document.getElementById('results-container');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const downloadExcelBtn = document.getElementById('download-excel-btn');
    const restartBtn = document.getElementById('restart-btn');

    let students = [];
    let currentIndex = 0;
    let studentResults = [];
    let lessonDateValue = "";

    // --- Content Mapping ---
    const reviewContent = {
        cap1: { // Nhận biết
            1: "Em vẫn chưa phân biệt được các thiết bị điện tử và chi tiết lắp ráp, cần được giáo viên hỗ trợ rất nhiều trong quá trình làm việc.",
            2: "Em đã bước đầu nhận biết được một vài thiết bị nhưng còn khá nhiều nhầm lẫn và cần giáo viên nhắc lại kiến thức thường xuyên.",
            3: "Em đã phân biệt đúng các thiết bị điện tử và chi tiết lắp ráp, đồng thời nhận diện được đúng tên gọi của chúng.",
            4: "Em ghi nhớ rất tốt chức năng cơ bản của từng thiết bị như động cơ hay cảm biến, thể hiện sự tập trung cao trong bài học.",
            5: "Em nắm vững chức năng của các thiết bị và biết cách vận dụng sáng tạo chúng vào việc thiết kế các mô hình thực tế."
        },
        cap2: { // Lắp ráp
            1: "Về kỹ năng lắp ráp, em chưa chọn đúng các chi tiết cần thiết và còn gặp khó khăn trong việc xác định hướng và vị trí lắp ghép.",
            2: "Trong phần lắp ráp, em đã chọn đúng chi tiết nhưng vẫn chưa xác định được hướng hoặc vị trí chính xác, cần được hỗ trợ thường xuyên.",
            3: "Em đã chọn đúng chi tiết và xác định được hướng, vị trí lắp ráp, tuy nhiên đôi khi vẫn còn mắc lỗi nhẹ và cần giáo viên nhắc nhở để sửa sai.",
            4: "Kỹ năng lắp ráp của em khá chính xác, đôi khi có sai sót nhỏ nhưng em có thể tự sửa lại ngay khi nhận được gợi ý từ giáo viên.",
            5: "Em thực hiện các thao tác lắp ráp vô cùng chính xác, có tư duy không gian tốt và khả năng tự phát hiện, sửa lỗi mà không cần sự trợ giúp."
        },
        cap3: { // Lập trình
            1: "Đối với phần lập trình, em chưa thực hiện được thao tác kéo thả khối lệnh và gặp nhiều trở ngại ngay cả khi có sự hướng dẫn sát sao.",
            2: "Em đã biết cách kéo thả khối lệnh nhưng vẫn còn nhầm lẫn về chức năng của từng khối, cần được giáo viên hướng dẫn thêm nhiều.",
            3: "Em nắm được cách kéo thả và sử dụng đúng chức năng các khối lệnh cơ bản, dù đôi lúc còn sai sót nhưng đã biết tự sửa khi có gợi ý.",
            4: "Về tư duy lập trình, em đã hoàn thành tốt nhiệm vụ, sử dụng thành thạo và chính xác các khối lệnh để điều khiển mô hình.",
            5: "Em hoàn thành xuất sắc tất cả các nhiệm vụ lập trình, đồng thời thể hiện tư duy sáng tạo vượt trội trong việc xây dựng chương trình."
        },
        cap4: { // Giao tiếp
            1: "Về thái độ, em chưa chủ động giao tiếp và còn ngại trả lời khi được hỏi, cần thêm thời gian để mở lòng và hợp tác hơn trong lớp.",
            2: "Em có tương tác với giáo viên nhưng chưa thực sự chủ động, chủ yếu chỉ trả lời khi được đặt câu hỏi trực tiếp.",
            3: "Em có tinh thần hợp tác tốt với giáo viên, tuy nhiên vẫn còn chút nhút nhát và chưa tự tin chia sẻ về sản phẩm của mình.",
            4: "Em giao tiếp một cách tự nhiên, luôn sẵn sàng trao đổi và phối hợp nhịp nhàng với giáo viên trong suốt buổi học.",
            5: "Em vô cùng tự tin, hợp tác tốt và hào hứng chia sẻ về mô hình của mình. Thái độ học tập tích cực của em đã truyền cảm hứng cho cả lớp."
        }
    };

    // --- State Management ---
    
    // Start button
    startBtn.addEventListener('click', () => {
        const names = studentNamesInput.value.trim().split('\n').filter(name => name.trim() !== "");
        if (names.length === 0) {
            alert("Vui lòng nhập tên ít nhất một học sinh!");
            return;
        }
        
        lessonDateValue = lessonDateInput.value.trim() || "hôm nay";
        students = names.map(n => n.trim());
        currentIndex = 0;
        studentResults = [];
        
        showStep2();
    });

    function showStep2() {
        step1.classList.add('hidden');
        step3.classList.add('hidden');
        step2.classList.remove('hidden');
        
        updateStudentInfo();
        evaluationForm.reset();
        
        // Remove 'selected' class from all option cards
        document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    }

    function updateStudentInfo() {
        currentStudentName.innerText = students[currentIndex];
        currentIndexInfo.innerText = `Học sinh ${currentIndex + 1}/${students.length}`;
        const progress = ((currentIndex) / students.length) * 100;
        progressBarFill.style.width = `${progress}%`;
    }

    // Radio styles toggle
    document.querySelectorAll('.option-card input').forEach(input => {
        input.addEventListener('change', (e) => {
            const name = e.target.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                radio.parentElement.classList.toggle('selected', radio.checked);
            });
        });
    });

    // Form submission
    evaluationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(evaluationForm);
        const data = {
            name: students[currentIndex],
            cap1: formData.get('cap1'),
            cap2: formData.get('cap2'),
            cap3: formData.get('cap3'),
            cap4: formData.get('cap4')
        };
        
        const generatedText = generateComment(data);
        studentResults.push({ name: data.name, text: generatedText });
        
        currentIndex++;
        
        if (currentIndex < students.length) {
            updateStudentInfo();
            evaluationForm.reset();
            document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showStep3();
        }
    });

    function generateComment(data) {
        const p1 = reviewContent.cap1[data.cap1];
        const p2 = reviewContent.cap2[data.cap2];
        const p3 = reviewContent.cap3[data.cap3];
        const p4 = reviewContent.cap4[data.cap4];
        
        const dateString = lessonDateValue === "hôm nay" ? "buổi học ngày hôm nay" : `buổi học ngày ${lessonDateValue}`;
        
        // Combine with professional transitions
        return `Trong ${dateString}, ${data.name} đã có những thể hiện rất đáng chú ý. ${p1} ${p2} ${p3} ${p4} Chúc mừng em đã hoàn thành tốt buổi học!`;
    }

    function showStep3() {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        progressBarFill.style.width = `100%`;
        
        resultsContainer.innerHTML = '';
        studentResults.forEach((res, i) => {
            const div = document.createElement('div');
            div.className = 'result-item fade-in';
            div.style.animationDelay = `${i * 0.1}s`;
            div.innerHTML = `
                <h4>Học sinh: ${res.name}</h4>
                <p class="result-text">${res.text}</p>
                <button class="secondary-btn copy-item-btn" onclick="copyText('${res.text.replace(/'/g, "\\'")}')">Sao chép</button>
            `;
            resultsContainer.appendChild(div);
        });
    }

    // Global helper for copying
    window.copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Đã sao chép nhận xét của học sinh!");
        });
    };

    copyAllBtn.addEventListener('click', () => {
        const allText = studentResults.map(r => `Học sinh: ${r.name}\n${r.text}`).join('\n\n');
        navigator.clipboard.writeText(allText).then(() => {
            alert("Đã sao chép toàn bộ danh sách nhận xét!");
        });
    });

    downloadExcelBtn.addEventListener('click', () => {
        // Create CSV content with BOM for UTF-8 (Excel friendly)
        let csvContent = "\uFEFF"; // BOM
        csvContent += "STT,Tên học sinh,Nhận xét\n";
        
        studentResults.forEach((res, index) => {
            // Escape quotes for CSV
            const escapedText = res.text.replace(/"/g, '""');
            csvContent += `${index + 1},${res.name},"${escapedText}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Nhan_Xet_Hoc_Sinh_${lessonDateValue.replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    restartBtn.addEventListener('click', () => {
        if (confirm("Bạn có chắc chắn muốn làm lại từ đầu? Mọi dữ liệu hiện tại sẽ bị xóa.")) {
            step3.classList.add('hidden');
            step1.classList.remove('hidden');
            studentNamesInput.value = '';
            progressBarFill.style.width = `0%`;
        }
    });
});

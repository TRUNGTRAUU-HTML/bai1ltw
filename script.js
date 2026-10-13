// 5 công việc mẫu ban đầu trong mảng đối tượng trong script.js
let tasks = [
    {
        id: 1,
        name: "Hoàn thành bài tập HTML/CSS/JS",
        deadline: "2026-10-15",
        priority: "Cao",
        completed: false
    },
    {
        id: 2,
        name: "Đọc tài liệu lập trình Web nâng cao",
        deadline: "2026-10-18",
        priority: "Trung bình",
        completed: false
    },
    {
        id: 3,
        name: "Kiểm tra và sửa lỗi responsive giao diện",
        deadline: "2026-10-20",
        priority: "Thấp",
        completed: true
    },
    {
        id: 4,
        name: "Chuẩn bị slide thuyết trình đề tài",
        deadline: "2026-10-22",
        priority: "Cao",
        completed: false
    },
    {
        id: 5,
        name: "Gặp giảng viên hướng dẫn đồ án",
        deadline: "2026-10-25",
        priority: "Trung bình",
        completed: false
    }
];

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskPriorityInput = document.getElementById('task-priority');
const errorMsg = document.getElementById('error-msg');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

// Render tasks on load
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Thêm công việc từ form
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = taskNameInput.value.trim();
    const deadline = taskDeadlineInput.value;
    const priority = taskPriorityInput.value;
    
    // Kiểm tra tên không rỗng
    if (name === '') {
        errorMsg.textContent = 'Tên công việc không được để trống!';
        taskNameInput.focus();
        return;
    }
    
    errorMsg.textContent = '';
    
    // Thêm vào mảng (cập nhật ngay)
    const newTask = {
        id: Date.now(),
        name: name,
        deadline: deadline || 'Không có',
        priority: priority,
        completed: false
    };
    
    tasks.unshift(newTask);
    renderTasks();
    
    // Xóa nội dung form
    taskForm.reset();
});

// Hàm hiển thị danh sách công việc (hỗ trợ tìm kiếm và lọc trạng thái)
function renderTasks() {
    const keyword = searchInput.value.toLowerCase().trim();
    const filterValue = statusFilter.value;
    
    let filteredTasks = tasks.filter(task => {
        // Lọc theo tên (không phân biệt hoa/thường)
        const matchesName = task.name.toLowerCase().includes(keyword);
        
        // Lọc theo trạng thái
        let matchesStatus = true;
        if (filterValue === 'completed') {
            matchesStatus = task.completed;
        } else if (filterValue === 'pending') {
            matchesStatus = !task.completed;
        }
        
        return matchesName && matchesStatus;
    });
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">Không tìm thấy công việc phù hợp.</p>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Xử lý class mức ưu tiên cho badge
        let priorityClass = 'trung-binh';
        if (task.priority === 'Cao') priorityClass = 'cao';
        else if (task.priority === 'Thấp') priorityClass = 'thap';
        
        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" style="margin-top: 4px; cursor: pointer;">
                <div class="task-details">
                    <span class="task-title">${escapeHtml(task.name)}</span>
                    <div class="task-meta">
                        <span>Hạn: ${task.deadline}</span>
                        <span class="badge ${priorityClass}">${task.priority}</span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${task.id})" title="${task.completed ? 'Đánh dấu chưa làm' : 'Đánh dấu hoàn thành'}">
                    ${task.completed ? 'Hoàn tác' : 'Xong'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Xóa công việc">Xóa</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

// Đánh dấu hoàn thành / chưa hoàn thành
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

// Xóa công việc
function deleteTask(id) {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này không?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

// Sự kiện tìm kiếm và lọc thay đổi
searchInput.addEventListener('input', renderTasks);
statusFilter.addEventListener('change', renderTasks);

// Hàm phụ trợ chống XSS cơ bản khi render HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Admin credentials (in a real application, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'STEM2024@bns'
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    } else if (isLoggedIn && window.location.href.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.querySelector('.error-message');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.classList.add('show');
        setTimeout(() => errorMessage.classList.remove('show'), 3000);
    }
}

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

// Initialize dashboard
function initDashboard() {
    const categoryFilter = document.getElementById('categoryFilter');
    const subjectFilter = document.getElementById('subjectFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const exportBtn = document.getElementById('exportBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const feedbackList = document.getElementById('feedbackList');

    let currentQuery = db.collection('feedback')
        .orderBy('timestamp', 'desc');

    // Real-time feedback updates
    function setupRealtimeUpdates() {
        return currentQuery.onSnapshot(snapshot => {
            feedbackList.innerHTML = '';
            
            if (snapshot.empty) {
                const noFeedback = document.createElement('div');
                noFeedback.className = 'no-feedback';
                noFeedback.textContent = 'No feedback found';
                feedbackList.appendChild(noFeedback);
                return;
            }

            snapshot.forEach(doc => {
                const feedback = doc.data();
                const template = document.getElementById('feedbackTemplate').content.cloneNode(true);
                
                template.querySelector('.name').textContent = feedback.name || 'Anonymous';
                template.querySelector('.category').textContent = feedback.category;
                template.querySelector('.subject').textContent = feedback.subject || 'N/A';
                template.querySelector('.timestamp').textContent = feedback.timestamp ? 
                    new Date(feedback.timestamp.toDate()).toLocaleString() : 'N/A';
                template.querySelector('.message').textContent = feedback.message;

                const deleteBtn = template.querySelector('.delete-feedback');
                deleteBtn.addEventListener('click', () => {
                    showConfirmDialog(() => deleteFeedback(doc.id));
                });

                feedbackList.appendChild(template);
            });
        }, error => {
            console.error('Error getting feedback:', error);
            feedbackList.innerHTML = '<div class="error-message">Error loading feedback. Please refresh the page.</div>';
        });
    }

    // Initial setup of real-time updates
    let unsubscribe = setupRealtimeUpdates();

    // Filter feedback
    function updateFilters() {
        const category = categoryFilter.value;
        const subject = subjectFilter.value;

        // Unsubscribe from previous listener
        if (unsubscribe) {
            unsubscribe();
        }

        // Build new query
        let query = db.collection('feedback')
            .orderBy('timestamp', 'desc');

        if (category) {
            query = query.where('category', '==', category);
        }
        if (subject) {
            query = query.where('subject', '==', subject);
        }

        currentQuery = query;
        unsubscribe = setupRealtimeUpdates();
    }

    // Delete specific feedback
    function deleteFeedback(id) {
        db.collection('feedback').doc(id).delete()
            .catch(error => {
                console.error('Error deleting feedback:', error);
                alert('Error deleting feedback. Please try again.');
            });
    }

    // Delete all feedback
    function deleteAllFeedback() {
        showConfirmDialog(() => {
            db.collection('feedback').get().then(snapshot => {
                const batch = db.batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            }).catch(error => {
                console.error('Error deleting all feedback:', error);
                alert('Error deleting feedback. Please try again.');
            });
        });
    }

    // Export to Excel
    function exportToExcel() {
        const feedbacks = Array.from(document.querySelectorAll('.feedback-item')).map(item => ({
            name: item.querySelector('.name').textContent,
            category: item.querySelector('.category').textContent,
            subject: item.querySelector('.subject').textContent,
            message: item.querySelector('.message').textContent,
            timestamp: item.querySelector('.timestamp').textContent
        }));

        if (feedbacks.length === 0) {
            alert('No feedback to export');
            return;
        }
        
        const csvContent = [
            ['Name', 'Category', 'Subject', 'Message', 'Timestamp'],
            ...feedbacks.map(f => [
                f.name,
                f.category,
                f.subject,
                f.message,
                f.timestamp
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    // Event listeners
    categoryFilter.addEventListener('change', updateFilters);
    subjectFilter.addEventListener('change', updateFilters);
    clearFiltersBtn.addEventListener('click', () => {
        categoryFilter.value = '';
        subjectFilter.value = '';
        updateFilters();
    });
    exportBtn.addEventListener('click', exportToExcel);
    deleteAllBtn.addEventListener('click', deleteAllFeedback);
    logoutBtn.addEventListener('click', handleLogout);
}

// Show/hide confirmation dialog
function showConfirmDialog(onConfirm) {
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    confirmDialog.classList.add('active');
    
    const handleConfirm = () => {
        onConfirm();
        hideConfirmDialog();
    };

    const handleCancel = () => {
        hideConfirmDialog();
    };

    confirmYes.addEventListener('click', handleConfirm, { once: true });
    confirmNo.addEventListener('click', handleCancel, { once: true });
}

function hideConfirmDialog() {
    const confirmDialog = document.getElementById('confirmDialog');
    confirmDialog.classList.remove('active');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    if (window.location.href.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    } else {
        initDashboard();
    }
}); 
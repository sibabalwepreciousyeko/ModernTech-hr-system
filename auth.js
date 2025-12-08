// Authentication System for ModernTech Solutions
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDemoUser();
    }

    loadUsers() {
        const stored = localStorage.getItem('hrUsers');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('hrUsers', JSON.stringify(this.users));
    }

    loadDemoUser() {
        // Add demo admin user if not exists
        const adminExists = this.users.find(user => user.email === 'admin@moderntech.com');
        if (!adminExists) {
            this.users.push({
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@moderntech.com',
                password: 'admin123',
                department: 'Human Resources',
                role: 'HR Manager',
                createdAt: new Date().toISOString()
            });
            this.saveUsers();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        // Signup functionality removed
    }

    handleLogin(form) {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!this.validateLoginForm(form)) return;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.loginUser(user);
        } else {
            this.showError('Invalid email or password. Please try again.');
            this.shakeForm(form);
        }
    }



    validateLoginForm(form) {
        let isValid = true;
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');

        // Email validation
        if (!email.value.trim() || !this.isValidEmail(email.value)) {
            this.setFieldError(email, 'Please enter a valid email address.');
            isValid = false;
        } else {
            this.clearFieldError(email);
        }

        // Password validation
        if (!password.value.trim()) {
            this.setFieldError(password, 'Please enter your password.');
            isValid = false;
        } else {
            this.clearFieldError(password);
        }

        return isValid;
    }





    setFieldError(field, message) {
        field.classList.add('is-invalid');
        let feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    generateUserId() {
        return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    }

    loginUser(user) {
        const btn = document.querySelector('#loginForm button[type="submit"]');
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Signing In...';

        setTimeout(() => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        }, 1500);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 9999;
                    animation: slideIn 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .notification.success {
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                }
                .notification.error {
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    shakeForm(form) {
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => form.style.animation = '', 500);

        // Add shake animation if not already added
        if (!document.querySelector('#shake-styles')) {
            const styles = document.createElement('style');
            styles.id = 'shake-styles';
            styles.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Utility functions for form switching
function showLogin() {
    document.getElementById('loginSection').classList.add('active');
    clearForms();
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.parentNode.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function clearForms() {
    document.getElementById('loginForm').reset();
    
    // Clear validation states
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
    });
}

// Initialize authentication system
const authSystem = new AuthSystem();
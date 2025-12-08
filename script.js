// ModernTech Solutions HR System - JavaScript
class HRSystem {
    constructor() {
        this.employees = [];
        this.timeOffRequests = [];
        this.attendanceRecords = [];
        this.payrollData = [];
        this.currentUser = null;
        this.charts = {};
        
        console.log('HRSystem constructor called');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    // Authentication System
    checkAuthentication() {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        try {
            this.currentUser = JSON.parse(user);
            // Don't update dashboard here, wait for data to load
        } catch (e) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }



    getStartDateFromHistory(history) {
        const match = history.match(/\d{4}/);
        return match ? `${match[0]}-01-01` : '2020-01-01';
    }



    mapLeaveType(reason) {
        const lowerReason = reason.toLowerCase();
        if (lowerReason.includes('sick')) return 'sick';
        if (lowerReason.includes('vacation')) return 'vacation';
        if (lowerReason.includes('personal') || lowerReason.includes('childcare')) return 'personal';
        return 'other';
    }



    generateFallbackPayrollData() {
        console.log('Generating fallback payroll data for', this.employees.length, 'employees');
        this.payrollData = this.employees.map(emp => {
            const hoursWorked = 160 + Math.floor(Math.random() * 20); // 160-180 hours
            const overtimeHours = Math.max(0, hoursWorked - 160);
            const basePay = emp.salary / 12;
            const overtimePay = (emp.salary / 12 / 160) * overtimeHours * 1.5;
            const grossPay = basePay + overtimePay;
            const deductions = grossPay * 0.25; // 25% deductions
            const netPay = grossPay - deductions;
            
            return {
                employeeId: emp.id,
                month: '2024-07',
                baseSalary: emp.salary,
                hoursWorked,
                overtimeHours,
                grossPay,
                deductions,
                netPay
            };
        });
        console.log('Generated fallback payroll:', this.payrollData.length, 'records');
    }

    loadFallbackData() {
        // Fallback data if JSON files fail to load - All 10 employees
        this.employees = [
            {
                id: 1,
                firstName: 'Sibongile',
                lastName: 'Nkosi',
                email: 'sibongile.nkosi@moderntech.com',
                phone: '+27 123456789',
                department: 'Development',
                position: 'Software Engineer',
                salary: 70000,
                startDate: '2015-01-01'
            },
            {
                id: 2,
                firstName: 'Lungile',
                lastName: 'Moyo',
                email: 'lungile.moyo@moderntech.com',
                phone: '+27 123456790',
                department: 'HR',
                position: 'HR Manager',
                salary: 80000,
                startDate: '2013-01-01'
            },
            {
                id: 3,
                firstName: 'Thabo',
                lastName: 'Molefe',
                email: 'thabo.molefe@moderntech.com',
                phone: '+27 123456791',
                department: 'QA',
                position: 'Quality Analyst',
                salary: 55000,
                startDate: '2018-01-01'
            },
            {
                id: 4,
                firstName: 'Keshav',
                lastName: 'Naidoo',
                email: 'keshav.naidoo@moderntech.com',
                phone: '+27 123456792',
                department: 'Sales',
                position: 'Sales Representative',
                salary: 60000,
                startDate: '2020-01-01'
            },
            {
                id: 5,
                firstName: 'Zanele',
                lastName: 'Khumalo',
                email: 'zanele.khumalo@moderntech.com',
                phone: '+27 123456793',
                department: 'Marketing',
                position: 'Marketing Specialist',
                salary: 58000,
                startDate: '2019-01-01'
            },
            {
                id: 6,
                firstName: 'Sipho',
                lastName: 'Zulu',
                email: 'sipho.zulu@moderntech.com',
                phone: '+27 123456794',
                department: 'Design',
                position: 'UI/UX Designer',
                salary: 65000,
                startDate: '2016-01-01'
            },
            {
                id: 7,
                firstName: 'Naledi',
                lastName: 'Moeketsi',
                email: 'naledi.moeketsi@moderntech.com',
                phone: '+27 123456795',
                department: 'IT',
                position: 'DevOps Engineer',
                salary: 72000,
                startDate: '2017-01-01'
            },
            {
                id: 8,
                firstName: 'Farai',
                lastName: 'Gumbo',
                email: 'farai.gumbo@moderntech.com',
                phone: '+27 123456796',
                department: 'Marketing',
                position: 'Content Strategist',
                salary: 56000,
                startDate: '2021-01-01'
            },
            {
                id: 9,
                firstName: 'Karabo',
                lastName: 'Dlamini',
                email: 'karabo.dlamini@moderntech.com',
                phone: '+27 123456797',
                department: 'Finance',
                position: 'Accountant',
                salary: 62000,
                startDate: '2018-01-01'
            },
            {
                id: 10,
                firstName: 'Fatima',
                lastName: 'Patel',
                email: 'fatima.patel@moderntech.com',
                phone: '+27 123456798',
                department: 'Support',
                position: 'Customer Support Lead',
                salary: 58000,
                startDate: '2016-01-01'
            }
        ];
        
        // Generate fallback time off requests
        this.timeOffRequests = [
            { id: 1, employeeId: 1, type: 'sick', startDate: '2025-07-22', endDate: '2025-07-22', reason: 'Sick Leave', status: 'approved' },
            { id: 2, employeeId: 2, type: 'personal', startDate: '2025-07-15', endDate: '2025-07-15', reason: 'Family Responsibility', status: 'denied' },
            { id: 3, employeeId: 3, type: 'sick', startDate: '2025-07-10', endDate: '2025-07-10', reason: 'Medical Appointment', status: 'approved' }
        ];
        
        // Generate fallback attendance records
        this.attendanceRecords = [];
        const dates = ['2025-07-25', '2025-07-26', '2025-07-27', '2025-07-28', '2025-07-29'];
        this.employees.forEach(emp => {
            dates.forEach(date => {
                const rand = Math.random();
                let status, checkIn, checkOut, hours;
                if (rand > 0.8) {
                    status = 'present';
                    checkIn = '09:00';
                    checkOut = '17:00';
                    hours = 8;
                } else if (rand > 0.7) {
                    status = 'late';
                    checkIn = '09:30';
                    checkOut = '17:30';
                    hours = 8;
                } else {
                    status = 'absent';
                    checkIn = '-';
                    checkOut = '-';
                    hours = 0;
                }
                this.attendanceRecords.push({
                    employeeId: emp.id,
                    date,
                    checkIn,
                    checkOut,
                    hours,
                    status
                });
            });
        });
        
        // Generate fallback payroll data
        this.generateFallbackPayrollData();
        console.log('Loaded fallback data:', {
            employees: this.employees.length,
            timeOff: this.timeOffRequests.length,
            attendance: this.attendanceRecords.length,
            payroll: this.payrollData.length
        });
    }
    
    loadLecturerData() {
        // Lecturer's exact employee data
        this.employees = [
            {id: 1, firstName: 'Sibongile', lastName: 'Nkosi', email: 'sibongile.nkosi@moderntech.com', phone: '+27 123456789', department: 'Development', position: 'Software Engineer', salary: 70000, startDate: '2015-01-01'},
            {id: 2, firstName: 'Lungile', lastName: 'Moyo', email: 'lungile.moyo@moderntech.com', phone: '+27 123456790', department: 'HR', position: 'HR Manager', salary: 80000, startDate: '2013-01-01'},
            {id: 3, firstName: 'Thabo', lastName: 'Molefe', email: 'thabo.molefe@moderntech.com', phone: '+27 123456791', department: 'QA', position: 'Quality Analyst', salary: 55000, startDate: '2018-01-01'},
            {id: 4, firstName: 'Keshav', lastName: 'Naidoo', email: 'keshav.naidoo@moderntech.com', phone: '+27 123456792', department: 'Sales', position: 'Sales Representative', salary: 60000, startDate: '2020-01-01'},
            {id: 5, firstName: 'Zanele', lastName: 'Khumalo', email: 'zanele.khumalo@moderntech.com', phone: '+27 123456793', department: 'Marketing', position: 'Marketing Specialist', salary: 58000, startDate: '2019-01-01'},
            {id: 6, firstName: 'Sipho', lastName: 'Zulu', email: 'sipho.zulu@moderntech.com', phone: '+27 123456794', department: 'Design', position: 'UI/UX Designer', salary: 65000, startDate: '2016-01-01'},
            {id: 7, firstName: 'Naledi', lastName: 'Moeketsi', email: 'naledi.moeketsi@moderntech.com', phone: '+27 123456795', department: 'IT', position: 'DevOps Engineer', salary: 72000, startDate: '2017-01-01'},
            {id: 8, firstName: 'Farai', lastName: 'Gumbo', email: 'farai.gumbo@moderntech.com', phone: '+27 123456796', department: 'Marketing', position: 'Content Strategist', salary: 56000, startDate: '2021-01-01'},
            {id: 9, firstName: 'Karabo', lastName: 'Dlamini', email: 'karabo.dlamini@moderntech.com', phone: '+27 123456797', department: 'Finance', position: 'Accountant', salary: 62000, startDate: '2018-01-01'},
            {id: 10, firstName: 'Fatima', lastName: 'Patel', email: 'fatima.patel@moderntech.com', phone: '+27 123456798', department: 'Support', position: 'Customer Support Lead', salary: 58000, startDate: '2016-01-01'}
        ];
        
        // Lecturer's exact attendance data
        this.attendanceRecords = [
            {employeeId: 1, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 1, date: '2025-07-26', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 1, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 1, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 1, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 2, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 2, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 2, date: '2025-07-27', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 2, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 2, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 3, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 3, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 3, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 3, date: '2025-07-28', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 3, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 4, date: '2025-07-25', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 4, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 4, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 4, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 4, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 5, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 5, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 5, date: '2025-07-27', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 5, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 5, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 6, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 6, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 6, date: '2025-07-27', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 6, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 6, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 7, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 7, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 7, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 7, date: '2025-07-28', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 7, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 8, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 8, date: '2025-07-26', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 8, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 8, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 8, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 9, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 9, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 9, date: '2025-07-27', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 9, date: '2025-07-28', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 9, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 10, date: '2025-07-25', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 10, date: '2025-07-26', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 10, date: '2025-07-27', checkIn: '-', checkOut: '-', hours: 0, status: 'absent'},
            {employeeId: 10, date: '2025-07-28', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'},
            {employeeId: 10, date: '2025-07-29', checkIn: '09:00', checkOut: '17:00', hours: 8, status: 'present'}
        ];
        
        // Lecturer's exact leave requests
        this.timeOffRequests = [
            {id: 1, employeeId: 1, type: 'sick', startDate: '2025-07-22', endDate: '2025-07-22', reason: 'Sick Leave', status: 'approved'},
            {id: 2, employeeId: 1, type: 'personal', startDate: '2024-12-01', endDate: '2024-12-01', reason: 'Personal', status: 'pending'},
            {id: 3, employeeId: 2, type: 'personal', startDate: '2025-07-15', endDate: '2025-07-15', reason: 'Family Responsibility', status: 'denied'},
            {id: 4, employeeId: 2, type: 'vacation', startDate: '2024-12-02', endDate: '2024-12-02', reason: 'Vacation', status: 'approved'},
            {id: 5, employeeId: 3, type: 'sick', startDate: '2025-07-10', endDate: '2025-07-10', reason: 'Medical Appointment', status: 'approved'},
            {id: 6, employeeId: 3, type: 'personal', startDate: '2024-12-05', endDate: '2024-12-05', reason: 'Personal', status: 'pending'},
            {id: 7, employeeId: 4, type: 'emergency', startDate: '2025-07-20', endDate: '2025-07-20', reason: 'Bereavement', status: 'approved'},
            {id: 8, employeeId: 5, type: 'personal', startDate: '2024-12-01', endDate: '2024-12-01', reason: 'Childcare', status: 'pending'},
            {id: 9, employeeId: 6, type: 'sick', startDate: '2025-07-18', endDate: '2025-07-18', reason: 'Sick Leave', status: 'approved'},
            {id: 10, employeeId: 7, type: 'vacation', startDate: '2025-07-22', endDate: '2025-07-22', reason: 'Vacation', status: 'pending'},
            {id: 11, employeeId: 8, type: 'sick', startDate: '2024-12-02', endDate: '2024-12-02', reason: 'Medical Appointment', status: 'approved'},
            {id: 12, employeeId: 9, type: 'personal', startDate: '2025-07-19', endDate: '2025-07-19', reason: 'Childcare', status: 'denied'},
            {id: 13, employeeId: 10, type: 'vacation', startDate: '2024-12-03', endDate: '2024-12-03', reason: 'Vacation', status: 'pending'}
        ];
        
        // Lecturer's exact payroll data
        this.payrollData = [
            {employeeId: 1, month: '2024-07', baseSalary: 70000, hoursWorked: 160, overtimeHours: 0, grossPay: 73500, deductions: 4000, netPay: 69500},
            {employeeId: 2, month: '2024-07', baseSalary: 80000, hoursWorked: 150, overtimeHours: 0, grossPay: 84000, deductions: 5000, netPay: 79000},
            {employeeId: 3, month: '2024-07', baseSalary: 55000, hoursWorked: 170, overtimeHours: 10, grossPay: 56800, deductions: 2000, netPay: 54800},
            {employeeId: 4, month: '2024-07', baseSalary: 60000, hoursWorked: 165, overtimeHours: 5, grossPay: 62700, deductions: 3000, netPay: 59700},
            {employeeId: 5, month: '2024-07', baseSalary: 58000, hoursWorked: 158, overtimeHours: 0, grossPay: 60350, deductions: 2500, netPay: 57850},
            {employeeId: 6, month: '2024-07', baseSalary: 65000, hoursWorked: 168, overtimeHours: 8, grossPay: 66800, deductions: 2000, netPay: 64800},
            {employeeId: 7, month: '2024-07', baseSalary: 72000, hoursWorked: 175, overtimeHours: 15, grossPay: 73300, deductions: 1500, netPay: 71800},
            {employeeId: 8, month: '2024-07', baseSalary: 56000, hoursWorked: 160, overtimeHours: 0, grossPay: 56000, deductions: 0, netPay: 56000},
            {employeeId: 9, month: '2024-07', baseSalary: 62000, hoursWorked: 155, overtimeHours: 0, grossPay: 64000, deductions: 2500, netPay: 61500},
            {employeeId: 10, month: '2024-07', baseSalary: 58000, hoursWorked: 162, overtimeHours: 2, grossPay: 59750, deductions: 2000, netPay: 57750}
        ];
        
        console.log('✅ Lecturer\'s data loaded successfully:', {
            employees: this.employees.length,
            attendance: this.attendanceRecords.length,
            payroll: this.payrollData.length,
            timeOff: this.timeOffRequests.length
        });
    }



    // Event Listeners
    setupEventListeners() {
        // Authentication is handled by login.html

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(e.target.dataset.section);
                this.updateNavigation(e.target);
            });
        });

        // Employee form
        const employeeForm = document.getElementById('employeeForm');
        if (employeeForm) {
            employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(e.target)) {
                    this.saveEmployee(new FormData(e.target));
                }
            });
        }

        // Time off form
        const timeoffForm = document.getElementById('timeoffForm');
        if (timeoffForm) {
            timeoffForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForm(e.target)) {
                    this.saveTimeOffRequest(new FormData(e.target));
                }
            });
        }

        // Search functionality
        const employeeSearch = document.getElementById('employeeSearch');
        if (employeeSearch) {
            employeeSearch.addEventListener('input', (e) => {
                this.filterEmployees(e.target.value);
            });
        }

        // Filter time off requests
        const requestFilter = document.getElementById('requestFilter');
        if (requestFilter) {
            requestFilter.addEventListener('change', (e) => {
                this.filterTimeOffRequests(e.target.value);
            });
        }

        // Generate payroll
        const generatePayroll = document.getElementById('generatePayroll');
        if (generatePayroll) {
            generatePayroll.addEventListener('click', () => {
                this.generatePayrollReport();
            });
        }

        // Mark attendance
        const markAttendance = document.getElementById('markAttendance');
        if (markAttendance) {
            markAttendance.addEventListener('click', () => {
                this.markAttendance();
            });
        }

        // Set default date for attendance
        const attendanceDate = document.getElementById('attendanceDate');
        if (attendanceDate) {
            attendanceDate.value = new Date().toISOString().split('T')[0];
        }
    }

    // Form Validation
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
                
                // Email validation
                if (input.type === 'email' && !this.isValidEmail(input.value)) {
                    input.classList.add('is-invalid');
                    isValid = false;
                }
                
                // Date validation for time off
                if (input.name === 'endDate') {
                    const startDate = form.querySelector('[name="startDate"]').value;
                    if (startDate && input.value < startDate) {
                        input.classList.add('is-invalid');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Navigation
    showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });
        document.getElementById(sectionId).classList.remove('d-none');
        
        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'employees':
                console.log('Loading employee table with', this.employees.length, 'employees');
                this.loadEmployeeTable();
                break;
            case 'payroll':
                console.log('Loading payroll section with', this.payrollData.length, 'payroll records');
                this.loadPayrollTable();
                break;
            case 'timeoff':
                console.log('Loading time-off section with', this.timeOffRequests.length, 'requests');
                this.loadTimeOffTable();
                this.populateEmployeeDropdown();
                break;
            case 'attendance':
                console.log('Loading attendance section with', this.attendanceRecords.length, 'records');
                this.loadAttendanceTable();
                break;
        }
    }

    updateNavigation(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Dashboard
    updateDashboard() {
        console.log('updateDashboard called, employees:', this.employees.length);
        
        // Force load data if empty
        if (this.employees.length === 0) {
            console.log('No data in dashboard, loading...');
            this.loadLecturerData();
        }
        
        // Update statistics
        document.getElementById('totalEmployees').textContent = this.employees.length;
        document.getElementById('pendingRequests').textContent = 
            this.timeOffRequests.filter(req => req.status === 'pending').length;
        
        const monthlyPayroll = this.payrollData.reduce((sum, pay) => sum + pay.netPay, 0);
        document.getElementById('monthlyPayroll').textContent = 
            'R' + monthlyPayroll.toLocaleString('en-ZA');
        
        const avgAttendance = this.calculateAverageAttendance();
        document.getElementById('avgAttendance').textContent = avgAttendance + '%';
        
        // Create charts
        this.createCharts();
    }

    calculateAverageAttendance() {
        const presentRecords = this.attendanceRecords.filter(record => record.status === 'present' || record.status === 'late');
        return Math.round((presentRecords.length / this.attendanceRecords.length) * 100);
    }

    createCharts() {
        // Attendance Chart
        const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
        if (this.charts.attendance) this.charts.attendance.destroy();
        
        const attendanceData = this.getAttendanceChartData();
        this.charts.attendance = new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: attendanceData.labels,
                datasets: [{
                    label: 'Attendance Rate',
                    data: attendanceData.data,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });

        // Department Chart
        const departmentCtx = document.getElementById('departmentChart').getContext('2d');
        if (this.charts.department) this.charts.department.destroy();
        
        const departmentData = this.getDepartmentChartData();
        this.charts.department = new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: departmentData.labels,
                datasets: [{
                    data: departmentData.data,
                    backgroundColor: [
                        '#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0', '#6f42c1'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    getAttendanceChartData() {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                last7Days.push(date.toISOString().split('T')[0]);
            }
        }
        
        const data = last7Days.map(date => {
            const dayRecords = this.attendanceRecords.filter(record => record.date === date);
            const presentRecords = dayRecords.filter(record => record.status === 'present' || record.status === 'late');
            return dayRecords.length > 0 ? Math.round((presentRecords.length / dayRecords.length) * 100) : 0;
        });
        
        return {
            labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
            data
        };
    }

    getDepartmentChartData() {
        const departments = {};
        this.employees.forEach(emp => {
            departments[emp.department] = (departments[emp.department] || 0) + 1;
        });
        
        return {
            labels: Object.keys(departments),
            data: Object.values(departments)
        };
    }

    // Employee Management
    loadEmployeeTable() {
        console.log('loadEmployeeTable called, employees:', this.employees.length);
        const tbody = document.querySelector('#employeeTable tbody');
        if (!tbody) {
            console.error('Employee table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        // Force load data if empty
        if (this.employees.length === 0) {
            console.log('No employees, loading data...');
            this.loadLecturerData();
        }
        
        if (this.employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No employees found after loading data</td></tr>';
            return;
        }
        
        console.log('Displaying', this.employees.length, 'employees');
        this.employees.forEach(emp => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.firstName} ${emp.lastName}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>R${emp.salary.toLocaleString('en-ZA')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="hrSystem.editEmployee(${emp.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="hrSystem.deleteEmployee(${emp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    saveEmployee(formData) {
        const employee = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            department: formData.get('department'),
            position: formData.get('position'),
            salary: parseInt(formData.get('salary')),
            startDate: formData.get('startDate')
        };
        
        const id = formData.get('id');
        if (id) {
            // Update existing employee
            const index = this.employees.findIndex(emp => emp.id == id);
            employee.id = parseInt(id);
            this.employees[index] = employee;
        } else {
            // Add new employee
            employee.id = Math.max(...this.employees.map(emp => emp.id)) + 1;
            this.employees.push(employee);
        }
        
        this.loadEmployeeTable();
        bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
        document.getElementById('employeeForm').reset();
    }

    editEmployee(id) {
        const employee = this.employees.find(emp => emp.id === id);
        const form = document.getElementById('employeeForm');
        
        form.firstName.value = employee.firstName;
        form.lastName.value = employee.lastName;
        form.email.value = employee.email;
        form.phone.value = employee.phone;
        form.department.value = employee.department;
        form.position.value = employee.position;
        form.salary.value = employee.salary;
        form.startDate.value = employee.startDate;
        form.id.value = employee.id;
        
        new bootstrap.Modal(document.getElementById('employeeModal')).show();
    }

    deleteEmployee(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.loadEmployeeTable();
        }
    }

    filterEmployees(searchTerm) {
        const rows = document.querySelectorAll('#employeeTable tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    // Payroll Management
    loadPayrollTable() {
        const tbody = document.querySelector('#payrollTable tbody');
        if (!tbody) {
            console.error('Payroll table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (this.payrollData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No payroll data available. Please generate payroll first.</td></tr>';
            return;
        }
        
        console.log('Loading payroll table with', this.payrollData.length, 'records');
        this.payrollData.forEach(pay => {
            const employee = this.employees.find(emp => emp.id === pay.employeeId);
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>R${pay.baseSalary.toLocaleString('en-ZA')}</td>
                <td>${pay.hoursWorked}</td>
                <td>${pay.overtimeHours}</td>
                <td>R${pay.grossPay.toLocaleString('en-ZA')}</td>
                <td>R${pay.deductions.toLocaleString('en-ZA')}</td>
                <td>R${pay.netPay.toLocaleString('en-ZA')}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="hrSystem.generatePayslip(${pay.employeeId})">
                        <i class="fas fa-file-invoice"></i> Payslip
                    </button>
                </td>
            `;
        });
    }

    generatePayrollReport() {
        const month = document.getElementById('payrollMonth').value;
        if (!month) {
            alert('Please select a month');
            return;
        }
        
        if (this.payrollData.length === 0) {
            this.generateFallbackPayrollData();
        }
        
        this.loadPayrollTable();
        alert('Payroll generated successfully for ' + month);
    }

    generatePayslip(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        const payroll = this.payrollData.find(pay => pay.employeeId === employeeId);
        
        const payslipContent = `
            <div class="payslip-header">
                <h3>ModernTech Solutions</h3>
                <h4>Digital Payslip</h4>
                <p>Pay Period: June 2024</p>
            </div>
            <div class="payslip-details">
                <div class="row">
                    <div class="col-md-6">
                        <strong>Employee Details:</strong><br>
                        Name: ${employee.firstName} ${employee.lastName}<br>
                        ID: ${employee.id}<br>
                        Department: ${employee.department}<br>
                        Position: ${employee.position}
                    </div>
                    <div class="col-md-6">
                        <strong>Pay Details:</strong><br>
                        Base Salary: R${payroll.baseSalary.toLocaleString('en-ZA')}<br>
                        Hours Worked: ${payroll.hoursWorked}<br>
                        Overtime Hours: ${payroll.overtimeHours}
                    </div>
                </div>
            </div>
            <table class="payslip-table table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gross Pay</td>
                        <td>R${payroll.grossPay.toLocaleString('en-ZA')}</td>
                    </tr>
                    <tr>
                        <td>Deductions (Tax, Insurance, etc.)</td>
                        <td>-R${payroll.deductions.toLocaleString('en-ZA')}</td>
                    </tr>
                    <tr class="payslip-total">
                        <td><strong>Net Pay</strong></td>
                        <td><strong>R${payroll.netPay.toLocaleString('en-ZA')}</strong></td>
                    </tr>
                </tbody>
            </table>
        `;
        
        document.getElementById('payslipContent').innerHTML = payslipContent;
        new bootstrap.Modal(document.getElementById('payslipModal')).show();
    }

    // Time Off Management
    loadTimeOffTable() {
        const tbody = document.querySelector('#timeoffTable tbody');
        tbody.innerHTML = '';
        
        this.timeOffRequests.forEach(request => {
            const employee = this.employees.find(emp => emp.id === request.employeeId);
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${request.type.charAt(0).toUpperCase() + request.type.slice(1)}</td>
                <td>${request.startDate}</td>
                <td>${request.endDate}</td>
                <td>${days}</td>
                <td><span class="badge status-${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
                <td>
                    ${request.status === 'pending' ? `
                        <button class="btn btn-sm btn-success" onclick="hrSystem.approveTimeOff(${request.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="hrSystem.denyTimeOff(${request.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : '-'}
                </td>
            `;
        });
    }

    populateEmployeeDropdown() {
        const select = document.querySelector('#timeoffForm [name="employeeId"]');
        select.innerHTML = '<option value="">Select Employee</option>';
        
        this.employees.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id;
            option.textContent = `${emp.firstName} ${emp.lastName}`;
            select.appendChild(option);
        });
    }

    saveTimeOffRequest(formData) {
        const request = {
            id: Math.max(...this.timeOffRequests.map(req => req.id)) + 1,
            employeeId: parseInt(formData.get('employeeId')),
            type: formData.get('type'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            reason: formData.get('reason'),
            status: 'pending'
        };
        
        this.timeOffRequests.push(request);
        this.loadTimeOffTable();
        bootstrap.Modal.getInstance(document.getElementById('timeoffModal')).hide();
        document.getElementById('timeoffForm').reset();
    }

    approveTimeOff(id) {
        const request = this.timeOffRequests.find(req => req.id === id);
        request.status = 'approved';
        this.loadTimeOffTable();
        this.updateAttendanceForTimeOff(request);
    }

    denyTimeOff(id) {
        const request = this.timeOffRequests.find(req => req.id === id);
        request.status = 'denied';
        this.loadTimeOffTable();
    }

    updateAttendanceForTimeOff(request) {
        const startDate = new Date(request.startDate);
        const endDate = new Date(request.endDate);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
                const dateStr = d.toISOString().split('T')[0];
                const existingRecord = this.attendanceRecords.find(
                    record => record.employeeId === request.employeeId && record.date === dateStr
                );
                
                if (existingRecord) {
                    existingRecord.status = 'approved_leave';
                    existingRecord.checkIn = 'Leave';
                    existingRecord.checkOut = 'Leave';
                    existingRecord.hours = 8; // Count as full day for approved leave
                }
            }
        }
    }

    filterTimeOffRequests(status) {
        const rows = document.querySelectorAll('#timeoffTable tbody tr');
        rows.forEach(row => {
            if (!status) {
                row.style.display = '';
            } else {
                const statusCell = row.cells[5].textContent.toLowerCase();
                row.style.display = statusCell.includes(status) ? '' : 'none';
            }
        });
    }

    // Attendance Management
    loadAttendanceTable() {
        const tbody = document.querySelector('#attendanceTable tbody');
        if (!tbody) {
            console.error('Attendance table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (this.attendanceRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No attendance records found. Loading data...</td></tr>';
            return;
        }
        
        // Show all attendance records from lecturer's data
        const sortedRecords = this.attendanceRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('Displaying', sortedRecords.length, 'attendance records');
        sortedRecords.forEach(record => {
            const employee = this.employees.find(emp => emp.id === record.employeeId);
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${record.date}</td>
                <td>${record.checkIn}</td>
                <td>${record.checkOut}</td>
                <td>${record.hours}</td>
                <td><span class="badge status-${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
            `;
        });
    }

    markAttendance() {
        const date = document.getElementById('attendanceDate').value;
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        // Simulate marking attendance for all employees
        this.employees.forEach(emp => {
            const existingRecord = this.attendanceRecords.find(
                record => record.employeeId === emp.id && record.date === date
            );
            
            if (!existingRecord) {
                const attendance = Math.random();
                let status, checkIn, checkOut, hours;
                
                if (attendance > 0.9) {
                    status = 'present';
                    checkIn = '09:00';
                    checkOut = '17:00';
                    hours = 8;
                } else if (attendance > 0.8) {
                    status = 'late';
                    checkIn = '09:30';
                    checkOut = '17:30';
                    hours = 8;
                } else {
                    status = 'absent';
                    checkIn = '-';
                    checkOut = '-';
                    hours = 0;
                }
                
                this.attendanceRecords.push({
                    employeeId: emp.id,
                    date,
                    checkIn,
                    checkOut,
                    hours,
                    status
                });
            }
        });
        
        this.loadAttendanceTable();
        alert('Attendance marked successfully for ' + date);
    }
}

// Initialize the HR System when DOM is ready
let hrSystem;

document.addEventListener('DOMContentLoaded', function() {
    hrSystem = new HRSystem();
    hrSystem.loadLecturerData();
    window.hrSystem = hrSystem; // Make globally available
    console.log('Data loaded:', hrSystem.employees.length, 'employees');
});
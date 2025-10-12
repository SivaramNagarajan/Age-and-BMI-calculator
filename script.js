document.addEventListener('DOMContentLoaded', function() {
    checkDoctorView();
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    if (userData.name && userData.gender) {
        showDashboard();
    }
    setupEventListeners();
    loadMotivationalQuote();
});

function checkDoctorView() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view === 'doctor') {
        showPage('doctor-access-page');
    }
}

function setupEventListeners() {
    document.getElementById('welcome-next-btn').addEventListener('click', function() {
        const name = document.getElementById('user-name').value.trim();
        const gender = document.getElementById('user-gender').value;
        if (name && gender) {
            const userData = { name: name, gender: gender };
            localStorage.setItem('healthDashboardUser', JSON.stringify(userData));
            showDashboard();
        } else {
            alert('Please enter your name and select your gender.');
        }
    });

    document.getElementById('doctor-access-btn').addEventListener('click', function() {
        showPage('doctor-access-page');
    });

    document.getElementById('personal-info-card').addEventListener('click', function() {
        document.getElementById('password-modal').classList.add('active');
    });

    document.getElementById('doctor-view-card').addEventListener('click', function() {
        document.getElementById('doctor-view-modal').classList.add('active');
    });

    document.getElementById('age-calculator-card').addEventListener('click', function() {
        showCalculator('age');
    });

    document.getElementById('bmi-calculator-card').addEventListener('click', function() {
        showCalculator('bmi');
    });

    document.getElementById('heart-rate-card').addEventListener('click', function() {
        showCalculator('heart-rate');
    });

    document.getElementById('temperature-card').addEventListener('click', function() {
        showCalculator('temperature');
    });

    document.getElementById('sleep-calculator-card').addEventListener('click', function() {
        showCalculator('sleep');
    });

    document.getElementById('water-intake-card').addEventListener('click', function() {
        showCalculator('water');
    });

    document.getElementById('verify-password-btn').addEventListener('click', verifyPassword);
    document.getElementById('close-password-modal').addEventListener('click', function() {
        document.getElementById('password-modal').classList.remove('active');
    });

    document.getElementById('view-patient-btn').addEventListener('click', function() {
        const shareCode = document.getElementById('doctor-code-input').value.trim().toUpperCase();
        if (shareCode.length === 6) {
            const sharedData = localStorage.getItem(`sharedData_${shareCode}`);
            if (sharedData) {
                const data = JSON.parse(sharedData);
                displayDoctorView(data);
                document.getElementById('doctor-view-modal').classList.remove('active');
                document.getElementById('doctor-code-input').value = '';
                document.getElementById('doctor-code-error').style.display = 'none';
            } else {
                document.getElementById('doctor-code-error').style.display = 'block';
            }
        } else {
            document.getElementById('doctor-code-error').style.display = 'block';
        }
    });

    document.getElementById('close-doctor-modal').addEventListener('click', function() {
        document.getElementById('doctor-view-modal').classList.remove('active');
        document.getElementById('doctor-code-input').value = '';
        document.getElementById('doctor-code-error').style.display = 'none';
    });

    document.getElementById('close-calculator-modal').addEventListener('click', function() {
        document.getElementById('calculator-modal').classList.remove('active');
    });

    document.getElementById('back-to-dashboard').addEventListener('click', function() {
        showPage('dashboard-page');
    });

    document.getElementById('edit-info-btn').addEventListener('click', enableEditMode);
    document.getElementById('save-info-btn').addEventListener('click', savePersonalInfo);
    document.getElementById('cancel-edit-btn').addEventListener('click', cancelEditMode);

    document.getElementById('share-info-btn').addEventListener('click', showShareModal);

    document.getElementById('close-share-modal').addEventListener('click', function() {
        document.getElementById('share-modal').classList.remove('active');
    });

    document.getElementById('copy-code-btn').addEventListener('click', copyShareCode);
    document.getElementById('generate-new-code-btn').addEventListener('click', generateNewShareCode);

    document.getElementById('access-patient-btn').addEventListener('click', accessPatientInfo);
    document.getElementById('back-to-doctor-access').addEventListener('click', function() {
        showPage('doctor-access-page');
        document.getElementById('share-code-input').value = '';
        document.getElementById('access-error').style.display = 'none';
    });

    document.getElementById('back-to-welcome').addEventListener('click', function() {
        showPage('welcome-page');
        document.getElementById('share-code-input').value = '';
        document.getElementById('access-error').style.display = 'none';
    });

    setupFileUploadHandlers();
}

function accessPatientInfo() {
    const shareCode = document.getElementById('share-code-input').value.trim().toUpperCase();
    if (shareCode.length === 6) {
        const sharedData = localStorage.getItem(`sharedData_${shareCode}`);
        if (sharedData) {
            const data = JSON.parse(sharedData);
            displayDoctorView(data);
        } else {
            document.getElementById('access-error').style.display = 'block';
        }
    } else {
        document.getElementById('access-error').style.display = 'block';
    }
}

function displayDoctorView(data) {
    const container = document.getElementById('doctor-info-container');
    container.innerHTML = '';
    const patientInfoSection = document.createElement('div');
    patientInfoSection.innerHTML = `
        <h2 class="section-title">Patient Information</h2>
        <div class="info-grid">
            <div class="info-item"><div class="info-label">Name</div><div class="info-value">${data.userData.name || '-'}</div></div>
            <div class="info-item"><div class="info-label">Date of Birth</div><div class="info-value">${data.personalInfo.dob || '-'}</div></div>
            <div class="info-item"><div class="info-label">Gender</div><div class="info-value">${data.userData.gender ? data.userData.gender.charAt(0).toUpperCase() + data.userData.gender.slice(1) : '-'}</div></div>
            <div class="info-item"><div class="info-label">Blood Group</div><div class="info-value">${data.personalInfo.bloodGroup || '-'}</div></div>
            <div class="info-item"><div class="info-label">Height</div><div class="info-value">${data.personalInfo.height || '-'}</div></div>
            <div class="info-item"><div class="info-label">Weight</div><div class="info-value">${data.personalInfo.weight || '-'}</div></div>
            <div class="info-item"><div class="info-label">Allergies</div><div class="info-value">${data.personalInfo.allergies || '-'}</div></div>
            <div class="info-item"><div class="info-label">Emergency Contact</div><div class="info-value">${data.personalInfo.emergencyContact || '-'}</div></div>
            <div class="info-item"><div class="info-label">Email ID</div><div class="info-value">${data.personalInfo.email || '-'}</div></div>
            <div class="info-item"><div class="info-label">Current Medications</div><div class="info-value">${data.personalInfo.medications || '-'}</div></div>
            <div class="info-item" style="grid-column: span 2;"><div class="info-label">Medical History</div><div class="info-value">${data.personalInfo.medicalHistory || '-'}</div></div>
        </div>
    `;
    container.appendChild(patientInfoSection);
    const certificatesSection = document.createElement('div');
    certificatesSection.innerHTML = `
        <h2 class="section-title">Medical Certificates</h2>
        <div class="upload-grid">
            ${Object.keys(data.uploadedFiles).map(fileType => `
                <div class="upload-item">
                    <div class="upload-icon"><i class="fas fa-file-medical"></i></div>
                    <div>${fileType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div class="uploaded-file">${data.uploadedFiles[fileType].name}</div>
                </div>
            `).join('')}
        </div>
    `;
    container.appendChild(certificatesSection);
    const analysisSection = document.createElement('div');
    analysisSection.innerHTML = `
        <h2 class="section-title">Report Analysis</h2>
        <div class="analysis-grid">
            <div class="analysis-item"><div class="analysis-title">Blood Pressure</div><div class="analysis-value">${data.analysisData.bloodPressure || '120/80'}</div><div class="analysis-status status-normal">Normal</div></div>
            <div class="analysis-item"><div class="analysis-title">Blood Sugar</div><div class="analysis-value">${data.analysisData.bloodSugar || '100 mg/dL'}</div><div class="analysis-status status-normal">Normal</div></div>
            <div class="analysis-item"><div class="analysis-title">Heart Rate</div><div class="analysis-value">${data.analysisData.heartRate ? `${data.analysisData.heartRate} bpm` : '72 bpm'}</div><div class="analysis-status status-normal">Normal</div></div>
            <div class="analysis-item"><div class="analysis-title">Cholesterol</div><div class="analysis-value">${data.analysisData.cholesterol || '180 mg/dL'}</div><div class="analysis-status status-normal">Normal</div></div>
        </div>
    `;
    container.appendChild(analysisSection);
    const timestampSection = document.createElement('div');
    timestampSection.style.marginTop = '20px';
    timestampSection.style.textAlign = 'center';
    timestampSection.style.color = '#666';
    timestampSection.style.fontSize = '0.9rem';
    timestampSection.innerHTML = `Information shared on: ${new Date(data.timestamp).toLocaleString()}`;
    container.appendChild(timestampSection);
    showPage('doctor-view-page');
}

function showDashboard() {
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    document.getElementById('display-name').textContent = userData.name;
    document.getElementById('user-avatar').textContent = userData.name.charAt(0).toUpperCase();
    showPage('dashboard-page');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function verifyPassword() {
    const password = document.getElementById('password-input').value;
    const correctPassword = 'health123';
    if (password === correctPassword) {
        document.getElementById('password-modal').classList.remove('active');
        showPersonalInfoPage();
        document.getElementById('password-input').value = '';
        document.getElementById('password-error').style.display = 'none';
    } else {
        document.getElementById('password-error').style.display = 'block';
    }
}

function showPersonalInfoPage() {
    loadPersonalInfoData();
    showPage('personal-info-page');
}

function loadPersonalInfoData() {
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    const personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {};
    document.getElementById('info-name').textContent = userData.name || '-';
    document.getElementById('info-gender').textContent = userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : '-';
    document.getElementById('info-dob').textContent = personalInfo.dob || '-';
    document.getElementById('info-blood-group').textContent = personalInfo.bloodGroup || '-';
    document.getElementById('info-height').textContent = personalInfo.height || '-';
    document.getElementById('info-weight').textContent = personalInfo.weight || '-';
    document.getElementById('info-allergies').textContent = personalInfo.allergies || '-';
    document.getElementById('info-emergency').textContent = personalInfo.emergencyContact || '-';
    document.getElementById('info-email').textContent = personalInfo.email || '-';
    document.getElementById('info-medications').textContent = personalInfo.medications || '-';
    document.getElementById('info-medical-history').textContent = personalInfo.medicalHistory || '-';
    loadUploadedFiles();
}

function loadUploadedFiles() {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    Object.keys(uploadedFiles).forEach(fileType => {
        const fileElement = document.getElementById(`${fileType}-file`);
        if (fileElement && uploadedFiles[fileType]) {
            fileElement.textContent = uploadedFiles[fileType].name;
        }
    });
}

function setupFileUploadHandlers() {
    const uploadItems = document.querySelectorAll('.upload-item');
    uploadItems.forEach(item => {
        const uploadType = item.getAttribute('data-upload-type');
        const fileInput = document.getElementById(`${uploadType}-input`);
        item.addEventListener('click', function() {
            fileInput.click();
        });
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
                uploadedFiles[uploadType] = { name: file.name, size: file.size, type: file.type };
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
                document.getElementById(`${uploadType}-file`).textContent = file.name;
            }
        });
    });
}

function enableEditMode() {
    document.getElementById('edit-info-btn').style.display = 'none';
    document.getElementById('save-info-btn').style.display = 'inline-block';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
    const infoItems = document.querySelectorAll('.info-value');
    infoItems.forEach(item => {
        const currentValue = item.textContent.trim();
        const itemId = item.id;
        let inputElement;
        if (itemId === 'info-gender') {
            inputElement = document.createElement('select');
            inputElement.innerHTML = `
                <option value="">Select gender</option>
                <option value="male" ${currentValue === 'Male' ? 'selected' : ''}>Male</option>
                <option value="female" ${currentValue === 'Female' ? 'selected' : ''}>Female</option>
                <option value="other" ${currentValue === 'Other' ? 'selected' : ''}>Other</option>
            `;
        } else if (itemId === 'info-medical-history' || itemId === 'info-allergies' || itemId === 'info-medications') {
            inputElement = document.createElement('textarea');
            inputElement.value = currentValue === '-' ? '' : currentValue;
        } else if (itemId === 'info-dob') {
            inputElement = document.createElement('input');
            inputElement.type = 'date';
            inputElement.value = currentValue === '-' ? '' : currentValue;
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = currentValue === '-' ? '' : currentValue;
        }
        item.innerHTML = '';
        item.appendChild(inputElement);
        item.classList.add('editing');
    });
}

function savePersonalInfo() {
    const personalInfo = {};
    const infoItems = document.querySelectorAll('.info-value.editing');
    infoItems.forEach(item => {
        const input = item.querySelector('input, select, textarea');
        const itemId = item.id;
        const value = input.value.trim();
        if (itemId === 'info-name') personalInfo.name = value;
        else if (itemId === 'info-dob') personalInfo.dob = value;
        else if (itemId === 'info-gender') personalInfo.gender = value;
        else if (itemId === 'info-blood-group') personalInfo.bloodGroup = value;
        else if (itemId === 'info-height') personalInfo.height = value;
        else if (itemId === 'info-weight') personalInfo.weight = value;
        else if (itemId === 'info-allergies') personalInfo.allergies = value;
        else if (itemId === 'info-emergency') personalInfo.emergencyContact = value;
        else if (itemId === 'info-email') personalInfo.email = value;
        else if (itemId === 'info-medications') personalInfo.medications = value;
        else if (itemId === 'info-medical-history') personalInfo.medicalHistory = value;
    });
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    if (personalInfo.name) userData.name = personalInfo.name;
    if (personalInfo.gender) userData.gender = personalInfo.gender;
    localStorage.setItem('healthDashboardUser', JSON.stringify(userData));
    loadPersonalInfoData();
    exitEditMode();
    showNotification('Personal information saved successfully!');
}

function cancelEditMode() {
    loadPersonalInfoData();
    exitEditMode();
}

function exitEditMode() {
    document.getElementById('edit-info-btn').style.display = 'inline-block';
    document.getElementById('save-info-btn').style.display = 'none';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    document.querySelectorAll('.info-value').forEach(item => {
        item.classList.remove('editing');
    });
}

function showShareModal()

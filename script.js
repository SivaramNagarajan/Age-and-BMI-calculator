

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are in doctor view mode
    checkDoctorView();
   
    // Check if user data exists in localStorage
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
   
    // If user data exists, go directly to dashboard
    if (userData.name && userData.gender) {
        showDashboard();
    }
   
    // Set up event listeners
    setupEventListeners();
   
    // Load motivational quote
    loadMotivationalQuote();
});

// Check if we are in doctor view mode
function checkDoctorView() {
    // Check URL parameter for doctor view
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
   
    if (view === 'doctor') {
        showPage('doctor-access-page');
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Welcome page next button
    document.getElementById('welcome-next-btn').addEventListener('click', function() {
        const name = document.getElementById('user-name').value.trim();
        const gender = document.getElementById('user-gender').value;
       
        if (name && gender) {
            // Save user data to localStorage
            const userData = {
                name: name,
                gender: gender
            };
            localStorage.setItem('healthDashboardUser', JSON.stringify(userData));
           
            // Show dashboard
            showDashboard();
        } else {
            alert('Please enter your name and select your gender.');
        }
    });
   
    // Doctor access button
    document.getElementById('doctor-access-btn').addEventListener('click', function() {
        showPage('doctor-access-page');
    });
   
    // Dashboard cards
    document.getElementById('personal-info-card').addEventListener('click', function() {
        document.getElementById('password-modal').classList.add('active');
    });
   
    // Doctor view card
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
   
    // Password modal
    document.getElementById('verify-password-btn').addEventListener('click', verifyPassword);
    document.getElementById('close-password-modal').addEventListener('click', function() {
        document.getElementById('password-modal').classList.remove('active');
    });
   
    // Doctor view modal
    document.getElementById('view-patient-btn').addEventListener('click', function() {
        const shareCode = document.getElementById('doctor-code-input').value.trim().toUpperCase();
       
        if (shareCode.length === 6) {
            const sharedData = localStorage.getItem(`sharedData_${shareCode}`);
           
            if (sharedData) {
                // Parse the shared data
                const data = JSON.parse(sharedData);
               
                // Display the patient information
                displayDoctorView(data);
               
                // Close modal
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
   
    // Calculator modal
    document.getElementById('close-calculator-modal').addEventListener('click', function() {
        document.getElementById('calculator-modal').classList.remove('active');
    });
   
    // Back to dashboard button
    document.getElementById('back-to-dashboard').addEventListener('click', function() {
        showPage('dashboard-page');
    });
   
    // Edit/Save/Cancel buttons
    document.getElementById('edit-info-btn').addEventListener('click', enableEditMode);
    document.getElementById('save-info-btn').addEventListener('click', savePersonalInfo);
    document.getElementById('cancel-edit-btn').addEventListener('click', cancelEditMode);
   
    // Share button
    document.getElementById('share-info-btn').addEventListener('click', showShareModal);
   
    // Share modal
    document.getElementById('close-share-modal').addEventListener('click', function() {
        document.getElementById('share-modal').classList.remove('active');
    });
   
    document.getElementById('copy-code-btn').addEventListener('click', copyShareCode);
    document.getElementById('generate-new-code-btn').addEventListener('click', generateNewShareCode);
   
    // Doctor access
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
   
    // File upload handlers
    setupFileUploadHandlers();
}

// Access patient information
function accessPatientInfo() {
    const shareCode = document.getElementById('share-code-input').value.trim().toUpperCase();
   
    if (shareCode.length === 6) {
        const sharedData = localStorage.getItem(`sharedData_${shareCode}`);
       
        if (sharedData) {
            // Parse the shared data
            const data = JSON.parse(sharedData);
           
            // Display the patient information
            displayDoctorView(data);
        } else {
            document.getElementById('access-error').style.display = 'block';
        }
    } else {
        document.getElementById('access-error').style.display = 'block';
    }
}

// Display the doctor view with patient data
function displayDoctorView(data) {
    const container = document.getElementById('doctor-info-container');
   
    // Clear the container
    container.innerHTML = '';
   
    // Create patient information section
    const patientInfoSection = document.createElement('div');
    patientInfoSection.innerHTML = `
        <h2 class="section-title">Patient Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Name</div>
                <div class="info-value">${data.userData.name || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${data.personalInfo.dob || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${data.userData.gender ? data.userData.gender.charAt(0).toUpperCase() + data.userData.gender.slice(1) : '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Blood Group</div>
                <div class="info-value">${data.personalInfo.bloodGroup || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Height</div>
                <div class="info-value">${data.personalInfo.height || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Weight</div>
                <div class="info-value">${data.personalInfo.weight || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Allergies</div>
                <div class="info-value">${data.personalInfo.allergies || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Emergency Contact</div>
                <div class="info-value">${data.personalInfo.emergencyContact || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email ID</div>
                <div class="info-value">${data.personalInfo.email || '-'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Current Medications</div>
                <div class="info-value">${data.personalInfo.medications || '-'}</div>
            </div>
            <div class="info-item" style="grid-column: span 2;">
                <div class="info-label">Medical History</div>
                <div class="info-value">${data.personalInfo.medicalHistory || '-'}</div>
            </div>
        </div>
    `;
   
    container.appendChild(patientInfoSection);
   
    // Create medical certificates section
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
   
    // Create report analysis section
    const analysisSection = document.createElement('div');
    analysisSection.innerHTML = `
        <h2 class="section-title">Report Analysis</h2>
        <div class="analysis-grid">
            <div class="analysis-item">
                <div class="analysis-title">Blood Pressure</div>
                <div class="analysis-value">${data.analysisData.bloodPressure || '120/80'}</div>
                <div class="analysis-status status-normal">Normal</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-title">Blood Sugar</div>
                <div class="analysis-value">${data.analysisData.bloodSugar || '100 mg/dL'}</div>
                <div class="analysis-status status-normal">Normal</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-title">Heart Rate</div>
                <div class="analysis-value">${data.analysisData.heartRate ? `${data.analysisData.heartRate} bpm` : '72 bpm'}</div>
                <div class="analysis-status status-normal">Normal</div>
            </div>
            <div class="analysis-item">
                <div class="analysis-title">Cholesterol</div>
                <div class="analysis-value">${data.analysisData.cholesterol || '180 mg/dL'}</div>
                <div class="analysis-status status-normal">Normal</div>
            </div>
        </div>
    `;
   
    container.appendChild(analysisSection);
   
    // Add timestamp information
    const timestampSection = document.createElement('div');
    timestampSection.style.marginTop = '20px';
    timestampSection.style.textAlign = 'center';
    timestampSection.style.color = '#666';
    timestampSection.style.fontSize = '0.9rem';
    timestampSection.innerHTML = `Information shared on: ${new Date(data.timestamp).toLocaleString()}`;
    container.appendChild(timestampSection);
   
    // Show the doctor view page
    showPage('doctor-view-page');
}

// Show dashboard page
function showDashboard() {
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
   
    // Update user info in dashboard
    document.getElementById('display-name').textContent = userData.name;
    document.getElementById('user-avatar').textContent = userData.name.charAt(0).toUpperCase();
   
    // Show dashboard page
    showPage('dashboard-page');
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
   
    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

// Verify password for personal info
function verifyPassword() {
    const password = document.getElementById('password-input').value;
    const correctPassword = 'health123';
   
    if (password === correctPassword) {
        // Close modal
        document.getElementById('password-modal').classList.remove('active');
       
        // Show personal info page
        showPersonalInfoPage();
       
        // Clear password field
        document.getElementById('password-input').value = '';
        document.getElementById('password-error').style.display = 'none';
    } else {
        // Show error
        document.getElementById('password-error').style.display = 'block';
    }
}

// Show personal info page
function showPersonalInfoPage() {
    // Load personal info data
    loadPersonalInfoData();
   
    // Show personal info page
    showPage('personal-info-page');
}

// Load personal info data
function loadPersonalInfoData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    const personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {};
   
    // Update display with user data
    document.getElementById('info-name').textContent = userData.name || '-';
    document.getElementById('info-gender').textContent = userData.gender ?
        userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : '-';
   
    // Update display with personal info data
    document.getElementById('info-dob').textContent = personalInfo.dob || '-';
    document.getElementById('info-blood-group').textContent = personalInfo.bloodGroup || '-';
    document.getElementById('info-height').textContent = personalInfo.height || '-';
    document.getElementById('info-weight').textContent = personalInfo.weight || '-';
    document.getElementById('info-allergies').textContent = personalInfo.allergies || '-';
    document.getElementById('info-emergency').textContent = personalInfo.emergencyContact || '-';
    document.getElementById('info-email').textContent = personalInfo.email || '-';
    document.getElementById('info-medications').textContent = personalInfo.medications || '-';
    document.getElementById('info-medical-history').textContent = personalInfo.medicalHistory || '-';
   
    // Load uploaded files
    loadUploadedFiles();
}

// Load uploaded files
function loadUploadedFiles() {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
   
    // Update file display
    Object.keys(uploadedFiles).forEach(fileType => {
        const fileElement = document.getElementById(`${fileType}-file`);
        if (fileElement && uploadedFiles[fileType]) {
            fileElement.textContent = uploadedFiles[fileType].name;
        }
    });
}

// Set up file upload handlers
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
                // Save file info to localStorage
                const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
                uploadedFiles[uploadType] = {
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
               
                // Update display
                document.getElementById(`${uploadType}-file`).textContent = file.name;
            }
        });
    });
}

// Enable edit mode for personal info
function enableEditMode() {
    // Hide edit button and show save/cancel buttons
    document.getElementById('edit-info-btn').style.display = 'none';
    document.getElementById('save-info-btn').style.display = 'inline-block';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
   
    // Convert info values to input fields
    const infoItems = document.querySelectorAll('.info-value');
    infoItems.forEach(item => {
        const currentValue = item.textContent.trim();
        const itemId = item.id;
       
        // Create appropriate input based on field type
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
       
        // Clear the current content and add the input
        item.innerHTML = '';
        item.appendChild(inputElement);
        item.classList.add('editing');
    });
}

// Save personal info
function savePersonalInfo() {
    const personalInfo = {};
   
    // Get values from input fields
    const infoItems = document.querySelectorAll('.info-value.editing');
    infoItems.forEach(item => {
        const input = item.querySelector('input, select, textarea');
        const itemId = item.id;
        const value = input.value.trim();
       
        // Map item ID to personalInfo key
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
   
    // Save to localStorage
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
   
    // Update user data if name or gender changed
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    if (personalInfo.name) userData.name = personalInfo.name;
    if (personalInfo.gender) userData.gender = personalInfo.gender;
    localStorage.setItem('healthDashboardUser', JSON.stringify(userData));
   
    // Reload the personal info data
    loadPersonalInfoData();
   
    // Exit edit mode
    exitEditMode();
   
    // Show success message
    showNotification('Personal information saved successfully!');
}

// Cancel edit mode
function cancelEditMode() {
    // Reload the personal info data to discard changes
    loadPersonalInfoData();
   
    // Exit edit mode
    exitEditMode();
}

// Exit edit mode
function exitEditMode() {
    // Show edit button and hide save/cancel buttons
    document.getElementById('edit-info-btn').style.display = 'inline-block';
    document.getElementById('save-info-btn').style.display = 'none';
    document.getElementById('cancel-edit-btn').style.display = 'none';
   
    // Remove editing class from all info items
    document.querySelectorAll('.info-value').forEach(item => {
        item.classList.remove('editing');
    });
}

// Show share modal
function showShareModal() {
    // Generate or retrieve share code
    let shareCode = localStorage.getItem('healthShareCode');
    if (!shareCode) {
        shareCode = generateShareCode();
        localStorage.setItem('healthShareCode', shareCode);
    }
   
    // Display the share code
    document.getElementById('share-code').textContent = shareCode;
   
    // Show the modal
    document.getElementById('share-modal').classList.add('active');
   
    // Save current data for sharing
    saveDataForSharing();
}

// Generate share code
function generateShareCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Generate new share code
function generateNewShareCode() {
    const newCode = generateShareCode();
    localStorage.setItem('healthShareCode', newCode);
    document.getElementById('share-code').textContent = newCode;
   
    // Save data with new code
    saveDataForSharing();
   
    // Show notification
    showNotification('New share code generated!');
}

// Save data for sharing
function saveDataForSharing() {
    const shareCode = localStorage.getItem('healthShareCode');
    if (!shareCode) return;
   
    // Get user data and personal info
    const userData = JSON.parse(localStorage.getItem('healthDashboardUser')) || {};
    const personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {};
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    const analysisData = JSON.parse(localStorage.getItem('analysisData')) || {};
   
    // Combine all data
    const sharedData = {
        userData,
        personalInfo,
        uploadedFiles,
        analysisData,
        timestamp: new Date().toISOString()
    };
   
    // Save with share code as key
    localStorage.setItem(`sharedData_${shareCode}`, JSON.stringify(sharedData));
}

// Copy share code to clipboard
function copyShareCode() {
    const shareCode = document.getElementById('share-code').textContent;
   
    // Create a temporary input element to copy to clipboard
    const tempInput = document.createElement('input');
    tempInput.value = shareCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
   
    // Show success message
    const copySuccess = document.getElementById('copy-success');
    copySuccess.style.display = 'block';
   
    // Hide after 3 seconds
    setTimeout(() => {
        copySuccess.style.display = 'none';
    }, 3000);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
   
    // Add to body
    document.body.appendChild(notification);
   
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show calculator
function showCalculator(type) {
    const modal = document.getElementById('calculator-modal');
    const title = document.getElementById('calculator-title');
    const content = document.getElementById('calculator-content');
   
    // Clear previous content
    content.innerHTML = '';
   
    // Set title based on calculator type
    switch(type) {
        case 'age':
            title.textContent = 'Age Calculator';
            content.innerHTML = getAgeCalculatorHTML();
            setupAgeCalculator();
            break;
        case 'bmi':
            title.textContent = 'BMI Calculator';
            content.innerHTML = getBMICalculatorHTML();
            setupBMICalculator();
            break;
        case 'heart-rate':
            title.textContent = 'Heart Rate Checker';
            content.innerHTML = getHeartRateCheckerHTML();
            setupHeartRateChecker();
            break;
        case 'temperature':
            title.textContent = 'Body Temperature Checker';
            content.innerHTML = getTemperatureCheckerHTML();
            setupTemperatureChecker();
            break;
        case 'sleep':
            title.textContent = 'Sleep Time Calculator';
            content.innerHTML = getSleepCalculatorHTML();
            setupSleepCalculator();
            break;
        case 'water':
            title.textContent = 'Water Intake Calculator';
            content.innerHTML = getWaterIntakeCalculatorHTML();
            setupWaterIntakeCalculator();
            break;
    }
   
    // Show modal
    modal.classList.add('active');
}

// Age Calculator HTML
function getAgeCalculatorHTML() {
    return `
        <div class="form-group">
            <label for="birth-date">Date of Birth</label>
            <input type="date" id="birth-date">
        </div>
        <button id="calculate-age-btn" class="btn">Calculate Age</button>
        <div id="age-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup Age Calculator
function setupAgeCalculator() {
    document.getElementById('calculate-age-btn').addEventListener('click', function() {
        const birthDate = document.getElementById('birth-date').value;
       
        if (birthDate) {
            const birth = new Date(birthDate);
            const today = new Date();
           
            let years = today.getFullYear() - birth.getFullYear();
            let months = today.getMonth() - birth.getMonth();
            let days = today.getDate() - birth.getDate();
           
            if (days < 0) {
                months--;
                const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += lastMonth.getDate();
            }
           
            if (months < 0) {
                years--;
                months += 12;
            }
           
            const result = `You are ${years} years, ${months} months, and ${days} days old.`;
            document.getElementById('age-result').textContent = result;
            document.getElementById('age-result').style.display = 'block';
           
            // Save to personal info
            saveToPersonalInfo('dob', birthDate);
        } else {
            alert('Please enter your date of birth.');
        }
    });
}

// BMI Calculator HTML
function getBMICalculatorHTML() {
    return `
        <div class="form-group">
            <label for="weight">Weight (kg)</label>
            <input type="number" id="weight" placeholder="Enter your weight" min="1" step="0.1">
        </div>
        <div class="form-group">
            <label for="height">Height (cm)</label>
            <input type="number" id="height" placeholder="Enter your height" min="1" step="0.1">
        </div>
        <button id="calculate-bmi-btn" class="btn">Calculate BMI</button>
        <div id="bmi-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup BMI Calculator
function setupBMICalculator() {
    document.getElementById('calculate-bmi-btn').addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
       
        if (weight > 0 && height > 0) {
            const bmi = weight / (height * height);
            let category = '';
           
            if (bmi < 18.5) {
                category = 'Underweight';
            } else if (bmi < 25) {
                category = 'Normal weight';
            } else if (bmi < 30) {
                category = 'Overweight';
            } else {
                category = 'Obese';
            }
           
            const result = `Your BMI is ${bmi.toFixed(1)} (${category})`;
            document.getElementById('bmi-result').textContent = result;
            document.getElementById('bmi-result').style.display = 'block';
           
            // Save to personal info if available
            saveToPersonalInfo('weight', `${weight} kg`);
            saveToPersonalInfo('height', `${height * 100} cm`);
        } else {
            alert('Please enter valid weight and height values.');
        }
    });
}

// Heart Rate Checker HTML
function getHeartRateCheckerHTML() {
    return `
        <div class="form-group">
            <label for="heart-rate">Heart Rate (bpm)</label>
            <input type="number" id="heart-rate" placeholder="Enter your heart rate" min="1">
        </div>
        <button id="check-heart-rate-btn" class="btn">Check Heart Rate</button>
        <div id="heart-rate-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup Heart Rate Checker
function setupHeartRateChecker() {
    document.getElementById('check-heart-rate-btn').addEventListener('click', function() {
        const heartRate = parseInt(document.getElementById('heart-rate').value);
       
        if (heartRate > 0) {
            let status = '';
           
            if (heartRate < 60) {
                status = 'Low (Bradycardia)';
            } else if (heartRate <= 100) {
                status = 'Normal';
            } else {
                status = 'High (Tachycardia)';
            }
           
            const result = `Your heart rate is ${heartRate} bpm (${status})`;
            document.getElementById('heart-rate-result').textContent = result;
            document.getElementById('heart-rate-result').style.display = 'block';
           
            // Update report analysis
            updateReportAnalysis('heart-rate', heartRate);
        } else {
            alert('Please enter a valid heart rate value.');
        }
    });
}

// Temperature Checker HTML
function getTemperatureCheckerHTML() {
    return `
        <div class="form-group">
            <label for="temperature">Body Temperature (°C)</label>
            <input type="number" id="temperature" placeholder="Enter your temperature" min="35" max="42" step="0.1">
        </div>
        <button id="check-temperature-btn" class="btn">Check Temperature</button>
        <div id="temperature-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup Temperature Checker
function setupTemperatureChecker() {
    document.getElementById('check-temperature-btn').addEventListener('click', function() {
        const temperature = parseFloat(document.getElementById('temperature').value);
       
        if (temperature >= 35 && temperature <= 42) {
            let status = '';
           
            if (temperature < 36.1) {
                status = 'Low (Hypothermia)';
            } else if (temperature <= 37.2) {
                status = 'Normal';
            } else if (temperature <= 38.0) {
                status = 'Low-grade fever';
            } else if (temperature <= 39.0) {
                status = 'Fever';
            } else {
                status = 'High fever';
            }
           
            const result = `Your body temperature is ${temperature}°C (${status})`;
            document.getElementById('temperature-result').textContent = result;
            document.getElementById('temperature-result').style.display = 'block';
        } else {
            alert('Please enter a valid temperature value between 35°C and 42°C.');
        }
    });
}

// Sleep Calculator HTML
function getSleepCalculatorHTML() {
    return `
        <div class="form-group">
            <label for="wake-time">Wake Up Time</label>
            <input type="time" id="wake-time">
        </div>
        <div class="form-group">
            <label for="sleep-cycles">Sleep Cycles (90 minutes each)</label>
            <select id="sleep-cycles">
                <option value="3">4.5 hours (3 cycles)</option>
                <option value="4">6 hours (4 cycles)</option>
                <option value="5" selected>7.5 hours (5 cycles)</option>
                <option value="6">9 hours (6 cycles)</option>
            </select>
        </div>
        <button id="calculate-sleep-btn" class="btn">Calculate Bedtime</button>
        <div id="sleep-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup Sleep Calculator
function setupSleepCalculator() {
    document.getElementById('calculate-sleep-btn').addEventListener('click', function() {
        const wakeTime = document.getElementById('wake-time').value;
        const sleepCycles = parseInt(document.getElementById('sleep-cycles').value);
       
        if (wakeTime) {
            const [hours, minutes] = wakeTime.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes;
            const sleepMinutes = sleepCycles * 90;
            const bedtimeMinutes = (totalMinutes - sleepMinutes + 1440) % 1440;
           
            const bedtimeHours = Math.floor(bedtimeMinutes / 60);
            const bedtimeMins = bedtimeMinutes % 60;
           
            const bedtime = `${bedtimeHours.toString().padStart(2, '0')}:${bedtimeMins.toString().padStart(2, '0')}`;
            const result = `You should go to bed at ${bedtime} to get ${sleepCycles} sleep cycles (${sleepCycles * 1.5} hours).`;
           
            document.getElementById('sleep-result').textContent = result;
            document.getElementById('sleep-result').style.display = 'block';
        } else {
            alert('Please enter your wake up time.');
        }
    });
}

// Water Intake Calculator HTML
function getWaterIntakeCalculatorHTML() {
    return `
        <div class="form-group">
            <label for="water-weight">Weight (kg)</label>
            <input type="number" id="water-weight" placeholder="Enter your weight" min="1" step="0.1">
        </div>
        <div class="form-group">
            <label for="activity-level">Activity Level</label>
            <select id="activity-level">
                <option value="1">Sedentary (little or no exercise)</option>
                <option value="1.2">Lightly active (light exercise/sports 1-3 days/week)</option>
                <option value="1.5">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                <option value="1.7">Very active (hard exercise/sports 6-7 days a week)</option>
                <option value="2">Extra active (very hard exercise/physical job & exercise)</option>
            </select>
        </div>
        <button id="calculate-water-btn" class="btn">Calculate Water Intake</button>
        <div id="water-result" class="calculator-result" style="display: none;"></div>
    `;
}

// Setup Water Intake Calculator
function setupWaterIntakeCalculator() {
    document.getElementById('calculate-water-btn').addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('water-weight').value);
        const activityLevel = parseFloat(document.getElementById('activity-level').value);
       
        if (weight > 0) {
            // Base calculation: 35ml per kg of body weight
            let waterIntake = weight * 35;
           
            // Adjust for activity level
            waterIntake *= activityLevel;
           
            // Convert to liters
            const waterIntakeLiters = waterIntake / 1000;
           
            // Convert to glasses (assuming 250ml per glass)
            const waterIntakeGlasses = Math.round(waterIntake / 250);
           
            const result = `Your recommended daily water intake is ${waterIntakeLiters.toFixed(1)} liters (approximately ${waterIntakeGlasses} glasses of 250ml each).`;
           
            document.getElementById('water-result').textContent = result;
            document.getElementById('water-result').style.display = 'block';
        } else {
            alert('Please enter your weight.');
        }
    });
}

// Save data to personal info
function saveToPersonalInfo(field, value) {
    let personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {};
    personalInfo[field] = value;
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
}

// Update report analysis
function updateReportAnalysis(type, value) {
    let analysisData = JSON.parse(localStorage.getItem('analysisData')) || {};
   
    switch(type) {
        case 'heart-rate':
            analysisData.heartRate = value;
            let hrStatus = 'Normal';
            if (value < 60) hrStatus = 'Low';
            else if (value > 100) hrStatus = 'High';
           
            document.getElementById('hr-value').textContent = `${value} bpm`;
            document.getElementById('hr-status').textContent = hrStatus;
            document.getElementById('hr-status').className = `analysis-status status-${hrStatus.toLowerCase()}`;
            break;
    }
   
    localStorage.setItem('analysisData', JSON.stringify(analysisData));
}

// Load motivational quote
function loadMotivationalQuote() {
    const quotes = [
        { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
        { text: "Health is a state of complete harmony of the body, mind and spirit.", author: "B.K.S. Iyengar" },
        { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
        { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
        { text: "Your body hears everything your mind says. Stay positive.", author: "Unknown" },
        { text: "Health is not about the weight you lose, but about the life you gain.", author: "Dr. Josh Axe" },
        { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
        { text: "A fit body, a calm mind, a house full of love. These things cannot be bought – they must be earned.", author: "Naval Ravikant" }
    ];
   
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
   
    // Update quote display
    document.getElementById('motivational-quote').textContent = quote.text;
    document.getElementById('quote-author').textContent = `— ${quote.author}`;
}

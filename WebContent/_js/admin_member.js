/**
 * Member Management Page JavaScript
 * HonestPick Admin System
 */

// ===== 전역 변수 =====
var isEditMode = false;

// ===== 작업 버튼 함수들 (stores.js와 동일한 패턴) =====

// 회원 상세 보기 (기존 함수 활용)
function viewMemberDetail(memberNo) {
    console.log('회원 상세 보기:', memberNo);
    
    if (!memberNo) {
        console.error('Member number is missing');
        showNotification('회원 번호가 없습니다.', 'error');
        return;
    }
    
    // 테이블에서 해당 회원의 링크를 찾아 클릭
    var memberLink = document.querySelector('[data-memberno="' + memberNo + '"]');
    console.log('Found member link:', memberLink);
    
    if (memberLink) {
        // 직접 함수 호출
        openMemberDetailFromData(memberLink);
    } else {
        console.error('Member link not found for memberNo:', memberNo);
        showNotification('회원 정보를 찾을 수 없습니다.', 'error');
    }
}

// 회원 정보 수정 (상세 보기 후 편집 모드 활성화)
function editMemberInfo(memberNo) {
    console.log('회원 정보 수정:', memberNo);
    viewMemberDetail(memberNo);
    // 모달이 열린 후 편집 모드 활성화
    setTimeout(function() {
        enableEdit();
    }, 100);
}

// 회원 삭제 확인
function deleteMemberConfirm(memberNo, memberName) {
    console.log('회원 삭제 확인:', memberNo, memberName);
    
    if (confirm('정말로 \'' + memberName + '\' 회원을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        deleteMemberById(memberNo);
    }
}

// 회원 삭제 실행
function deleteMemberById(memberNo) {
    console.log('회원 삭제 실행:', memberNo);
    showLoading();
    
    // 삭제 폼 생성 및 전송
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = path + '/Mypage_servlet/changeInfoRemove.do';
    
    var memberNoInput = document.createElement('input');
    memberNoInput.type = 'hidden';
    memberNoInput.name = 'MemberNo';
    memberNoInput.value = memberNo;
    
    form.appendChild(memberNoInput);
    document.body.appendChild(form);
    form.submit();
}

// 모달에서 회원 삭제 (기존 deleteMember 함수 개선)
function deleteMemberFromModal() {
    var memberName = getElementValue('modalUserName');
    var memberNo = getElementValue('memberNoHidden');
    
    if (!memberNo) {
        showNotification('회원 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    deleteMemberConfirm(memberNo, memberName);
}

// ===== 기존 함수들 =====

// Open member detail modal from data attributes
function openMemberDetailFromData(element) {
    console.log('Opening member detail...', element);
    
    if (!element) {
        console.error('Element is null or undefined');
        showNotification('회원 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    // DTO 필드명과 동일하게 변수명 통일
    var memberNo = element.getAttribute('data-memberno') || '';
    var memberName = element.getAttribute('data-membername') || '';
    var memberEmail = element.getAttribute('data-memberemail') || '';
    var phoneNumber = element.getAttribute('data-phonenumber') || '';
    var admin = element.getAttribute('data-admin') || '';
    var memberRegidate = element.getAttribute('data-memberregidate') || '';
    var memberId = element.getAttribute('data-memberid') || '';
    var memberNickname = element.getAttribute('data-membernickname') || '';
    var memberPostalCode = element.getAttribute('data-memberpostalcode') || '';
    var memberAddr = element.getAttribute('data-memberaddr') || '';
    var memberStreetAddr = element.getAttribute('data-memberstreetaddr') || '';
    var memberAdditionalInfo = element.getAttribute('data-memberadditionalinfo') || '';
    var memberImage = element.getAttribute('data-memberimage') || '';
    
    console.log('Data extracted:', { 
        memberNo: memberNo,
        memberName: memberName, 
        memberEmail: memberEmail, 
        phoneNumber: phoneNumber, 
        admin: admin 
    });
    
    if (!memberNo) {
        console.error('Member number is missing');
        showNotification('회원 번호를 찾을 수 없습니다.', 'error');
        return;
    }
    
    openMemberDetail(memberNo, memberName, memberEmail, phoneNumber, admin, memberRegidate, 
                    memberId, memberNickname, memberPostalCode, memberAddr, 
                    memberStreetAddr, memberAdditionalInfo, memberImage);
}

// Open member detail modal
function openMemberDetail(memberNo, memberName, memberEmail, phoneNumber, admin, memberRegidate, 
                         memberId, memberNickname, memberPostalCode, memberAddr, 
                         memberStreetAddr, memberAdditionalInfo, memberImage) {
    console.log('Opening modal with data:', {
        memberNo: memberNo,
        memberName: memberName,
        memberEmail: memberEmail,
        phoneNumber: phoneNumber,
        admin: admin
    });
    
    // Check if modal exists
    var modal = document.getElementById('memberModal');
    if (!modal) {
        console.error('Modal not found!');
        showNotification('모달 요소를 찾을 수 없습니다.', 'error');
        return;
    }
    
    console.log('Modal found:', modal);
    
    // Fill modal fields with data
    var setFieldValue = function(id, value) {
        var field = document.getElementById(id);
        if (field) {
            field.value = value || '';
            console.log('Set field', id, '=', value);
        } else {
            console.warn('Field not found: ' + id);
        }
    };
    
    try {
        // 모든 필드 값 설정 (Hidden fields 포함)
        setFieldValue('memberNoHidden', memberNo);
        setFieldValue('hiddenMemberId', memberId);
        
        // 표시용 필드들
        setFieldValue('modalUserName', memberName);
        setFieldValue('modalUserEmail', memberEmail);
        setFieldValue('modalUserPhone', phoneNumber);
        setFieldValue('modalJoinDate', memberRegidate);
        setFieldValue('modalUserId', memberId);
        setFieldValue('modalUserNickname', memberNickname);
        setFieldValue('modalPostcode', memberPostalCode);
        setFieldValue('modalAddress', memberAddr);
        setFieldValue('modalDetailAddress', memberStreetAddr);
        setFieldValue('modalExtraAddress', memberAdditionalInfo);
        
        // Set profile image
        var profilePreview = document.getElementById('modalProfilePreview');
        if (profilePreview) {
            var profileImageSrc = (memberImage && memberImage !== 'null' && memberImage !== '') 
                ? memberImage 
                : (typeof path !== 'undefined' ? path + '/_images/default-profile.png' : '../_images/default-profile.png');
            profilePreview.src = profileImageSrc;
            console.log('Profile image set to:', profileImageSrc);
        }
        
        // Set user type radio buttons
        var userType1 = document.getElementById('modalUserType1');
        var userType2 = document.getElementById('modalUserType2');
        
        if (userType1 && userType2) {
            userType1.checked = false;
            userType2.checked = false;
            
            if (admin === '0') {
                userType1.checked = true;
            } else if (admin === '1') {
                userType2.checked = true;
            }
            console.log('User type set:', admin, 'Type1 checked:', userType1.checked, 'Type2 checked:', userType2.checked);
        }
        
        // Initialize all input fields to read-only
        resetFormToReadOnly();
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('Modal opened successfully');
        showNotification('회원 상세 정보를 불러왔습니다.', 'success');
        
    } catch (error) {
        console.error('Error opening modal:', error);
        showNotification('모달을 여는 중 오류가 발생했습니다.', 'error');
    }
}

// Reset form to read-only mode
function resetFormToReadOnly() {
    isEditMode = false;
    
    var inputs = document.querySelectorAll('#memberDetailForm input');
    var radios = document.querySelectorAll('#memberDetailForm input[type="radio"]');
    
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type !== 'hidden') {
            inputs[i].readOnly = true;
            inputs[i].style.backgroundColor = 'var(--admin-bg-light)';
            inputs[i].style.cursor = 'not-allowed';
        }
    }
    
    for (var j = 0; j < radios.length; j++) {
        radios[j].disabled = true;
        radios[j].style.cursor = 'not-allowed';
    }
    
    // Reset edit button
    var editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> 정보 수정';
        editBtn.onclick = function() { enableEdit(); };
    }
}

// Close modal
function closeModal() {
    var modal = document.getElementById('memberModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
    
    // Reset form
    var form = document.getElementById('memberDetailForm');
    if (form) {
        form.reset();
    }
    resetFormToReadOnly();
    
    hideLoading();
}

// Enable edit mode
function enableEdit() {
    isEditMode = true;
    
    var inputs = document.querySelectorAll('#memberDetailForm input');
    var radios = document.querySelectorAll('#memberDetailForm input[type="radio"]');
    
    for (var i = 0; i < inputs.length; i++) {
        // 수정 불가 필드들 제외 (아이디, 이름, 가입일, 회원상태, hidden 필드)
        if (inputs[i].id !== 'modalUserId' && 
            inputs[i].id !== 'modalUserName' &&  // 이름 필드 수정 불가 추가
            inputs[i].id !== 'modalJoinDate' && 
            inputs[i].id !== 'modalMemberStatus' &&
            inputs[i].type !== 'hidden') {
            inputs[i].readOnly = false;
            inputs[i].style.backgroundColor = 'var(--admin-bg-white)';
            inputs[i].style.cursor = 'text';
        }
    }
    
    for (var j = 0; j < radios.length; j++) {
        radios[j].disabled = false;
        radios[j].style.cursor = 'pointer';
    }
    
    // Change button text
    var editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-save"></i> 저장';
        editBtn.onclick = function() { saveMemberInfo(); };
    }
    
    showNotification('정보 수정 모드가 활성화되었습니다. (이름은 수정할 수 없습니다)', 'info');
}

// Save member information - 실제 폼 전송
function saveMemberInfo() {
    if (!validateMemberForm()) {
        return;
    }
    
    if (confirm('회원 정보를 저장하시겠습니까?')) {
        // 실제 폼 전송
        var form = document.getElementById('memberDetailForm');
        if (form) {
            console.log('Submitting form to:', form.action);
            
            // 폼 데이터 확인 (디버깅용)
            var formData = new FormData(form);
            console.log('Form data being sent:');
            for (var pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            showLoading();
            // 실제 폼 전송
            form.submit();
        } else {
            console.error('Form not found!');
            showNotification('폼을 찾을 수 없습니다.', 'error');
        }
    }
}

// 폼 유효성 검사
function validateMemberForm() {
    var memberName = getElementValue('modalUserName').trim();
    var memberEmail = getElementValue('modalUserEmail').trim();
    var phoneNumber = getElementValue('modalUserPhone').trim();
    var memberNickname = getElementValue('modalUserNickname').trim();
    
    if (!memberName) {
        showNotification('이름을 입력해주세요.', 'error');
        focusElement('modalUserName');
        return false;
    }
    
    if (memberName.length < 2 || memberName.length > 10) {
        showNotification('이름은 2-10자 이내로 입력해주세요.', 'error');
        focusElement('modalUserName');
        return false;
    }
    
    if (!memberEmail) {
        showNotification('이메일을 입력해주세요.', 'error');
        focusElement('modalUserEmail');
        return false;
    }
    
    // 이메일 형식 검사
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(memberEmail)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        focusElement('modalUserEmail');
        return false;
    }
    
    if (!phoneNumber) {
        showNotification('전화번호를 입력해주세요.', 'error');
        focusElement('modalUserPhone');
        return false;
    }
    
    // 전화번호 형식 검사
    if (!isValidPhoneFormat(phoneNumber)) {
        showNotification('올바른 전화번호 형식이 아닙니다.', 'error');
        focusElement('modalUserPhone');
        return false;
    }
    
    if (!memberNickname) {
        showNotification('닉네임을 입력해주세요.', 'error');
        focusElement('modalUserNickname');
        return false;
    }
    
    if (memberNickname.length < 2 || memberNickname.length > 10) {
        showNotification('닉네임은 2-10자 이내로 입력해주세요.', 'error');
        focusElement('modalUserNickname');
        return false;
    }
    
    return true;
}

// Delete member (기존 함수 개선)
function deleteMember() {
    var memberName = getElementValue('modalUserName');
    var memberNo = getElementValue('memberNoHidden');
    
    if (!memberNo) {
        showNotification('회원 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    deleteMemberConfirm(memberNo, memberName);
}

// ===== 전화번호 포맷팅 함수 (stores.js에서 가져옴) =====
function formatPhoneNumber(input) {
    // 숫자만 추출
    var numbers = input.value.replace(/\D/g, '');
    var formattedNumber = '';
    
    if (numbers.length === 0) {
        input.value = '';
        return;
    }
    
    // 010으로 시작하는 휴대폰 번호 포맷팅
    if (numbers.startsWith('01')) {
        if (numbers.length <= 3) {
            formattedNumber = numbers;
        } else if (numbers.length <= 7) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3);
        } else if (numbers.length <= 11) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        } else {
            numbers = numbers.slice(0, 11);
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        }
    }
    // 02로 시작하는 서울 지역번호
    else if (numbers.startsWith('02')) {
        if (numbers.length <= 2) {
            formattedNumber = numbers;
        } else if (numbers.length <= 5) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2);
        } else if (numbers.length <= 9) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 5) + '-' + numbers.slice(5);
        } else if (numbers.length <= 10) {
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6);
        } else {
            numbers = numbers.slice(0, 10);
            formattedNumber = numbers.slice(0, 2) + '-' + numbers.slice(2, 6) + '-' + numbers.slice(6);
        }
    }
    // 기타 지역번호
    else if (numbers.startsWith('0') && numbers.length >= 3) {
        if (numbers.length <= 3) {
            formattedNumber = numbers;
        } else if (numbers.length <= 6) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3);
        } else if (numbers.length <= 10) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 6) + '-' + numbers.slice(6);
        } else if (numbers.length <= 11) {
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        } else {
            numbers = numbers.slice(0, 11);
            formattedNumber = numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7);
        }
    } else {
        formattedNumber = numbers;
    }
    
    input.value = formattedNumber;
    
    // 포맷팅 상태에 따라 스타일 적용
    if (isValidPhoneFormat(formattedNumber)) {
        input.style.color = 'var(--success-color)';
    } else {
        input.style.color = 'var(--admin-text-dark)';
    }
}

// 전화번호 유효성 검사
function isValidPhoneFormat(phoneNumber) {
    var mobilePattern = /^01[0-9]-\d{4}-\d{4}$/;
    var seoulPattern = /^02-\d{3,4}-\d{4}$/;
    var localPattern = /^0\d{2}-\d{3,4}-\d{4}$/;
    
    return mobilePattern.test(phoneNumber) || seoulPattern.test(phoneNumber) || localPattern.test(phoneNumber);
}

// ===== 포맷팅 이벤트 설정 =====
function setupFormattingEvents() {
    // 전화번호 포맷팅
    var phoneInput = document.getElementById('modalUserPhone');
    if (phoneInput) {
        phoneInput.removeEventListener('input', handlePhoneInput);
        phoneInput.removeEventListener('keydown', handlePhoneKeydown);
        
        phoneInput.addEventListener('input', handlePhoneInput);
        phoneInput.addEventListener('keydown', handlePhoneKeydown);
    }
}

function handlePhoneInput(e) {
    formatPhoneNumber(e.target);
}

function handlePhoneKeydown(e) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        return;
    }
    
    if (!/[0-9]/.test(e.key) && !['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
    }
}

// ===== 체크박스 관련 함수들 =====
function toggleMemberSelection(memberNo) {
    var checkbox = document.querySelector('input[value="' + memberNo + '"]');
    if (checkbox) {
        console.log('Member ' + memberNo + ' selection toggled:', checkbox.checked);
    }
}

function toggleAllMembers() {
    var masterCheckbox = document.querySelector('thead input[type="checkbox"]');
    var memberCheckboxes = document.querySelectorAll('.member-checkbox');
    
    memberCheckboxes.forEach(function(checkbox) {
        checkbox.checked = masterCheckbox.checked;
    });
}

// ===== 유틸리티 함수들 =====
function getElementValue(id) {
    var element = document.getElementById(id);
    return element ? element.value : '';
}

function focusElement(id) {
    var element = document.getElementById(id);
    if (element) {
        element.focus();
    }
}

function showLoading() {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideLoading() {
    var spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Show notification function
function showNotification(message, type) {
    // Remove existing notification
    var existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = 
        '<div class="notification-content">' +
            '<i class="fas fa-' + getNotificationIcon(type) + '"></i>' +
            '<span>' + escapeHtml(message) + '</span>' +
        '</div>' +
        '<button class="notification-close" onclick="this.parentElement.remove()">' +
            '<i class="fas fa-times"></i>' +
        '</button>';

    // Apply styles
    notification.style.cssText = 
        'position: fixed;' +
        'top: 90px;' +
        'right: 20px;' +
        'background: var(--admin-bg-white);' +
        'border: 1px solid var(--admin-border-color);' +
        'border-left: 4px solid ' + getNotificationColor(type) + ';' +
        'border-radius: 8px;' +
        'padding: 15px 20px;' +
        'box-shadow: var(--admin-shadow-hover);' +
        'z-index: 10000;' +
        'max-width: 400px;' +
        'animation: slideInRight 0.3s ease;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: space-between;' +
        'gap: 15px;';

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(function() {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() { 
                if (notification.parentElement) {
                    notification.remove(); 
                }
            }, 300);
        }
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    var iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return iconMap[type] || 'info-circle';
}

// Get notification color
function getNotificationColor(type) {
    var colorMap = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colorMap[type] || '#17a2b8';
}

// HTML escape
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('memberModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        var modal = document.getElementById('memberModal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Member JavaScript loaded successfully');
    
    // Set initial modal state
    resetFormToReadOnly();
    
    // Add master checkbox functionality
    var masterCheckbox = document.querySelector('thead input[type="checkbox"]');
    if (masterCheckbox) {
        masterCheckbox.addEventListener('change', toggleAllMembers);
    }
    
    // Add notification animation CSS
    var style = document.createElement('style');
    style.textContent = 
        '@keyframes slideInRight {' +
            'from { transform: translateX(100%); opacity: 0; }' +
            'to { transform: translateX(0); opacity: 1; }' +
        '}' +
        '@keyframes slideOutRight {' +
            'from { transform: translateX(0); opacity: 1; }' +
            'to { transform: translateX(100%); opacity: 0; }' +
        '}' +
        '.notification-content {' +
            'display: flex; align-items: center; gap: 10px; flex: 1;' +
        '}' +
        '.notification-close {' +
            'background: none; border: none; cursor: pointer;' +
            'color: var(--admin-text-light); padding: 5px; border-radius: 4px;' +
            'transition: var(--transition);' +
        '}' +
        '.notification-close:hover {' +
            'background-color: var(--admin-bg-light); color: var(--admin-text-dark);' +
        '}' +
        '.member-name-link {' +
            'color: var(--admin-primary-color);' +
            'text-decoration: none;' +
            'font-weight: 500;' +
            'transition: var(--transition);' +
        '}' +
        '.member-name-link:hover {' +
            'color: var(--admin-primary-dark);' +
            'text-decoration: underline;' +
        '}' +
        '.table-row:hover {' +
            'background-color: var(--admin-bg-light);' +
            'transition: background-color 0.2s ease;' +
        '}' +
        '.action-buttons {' +
            'display: flex;' +
            'gap: 5px;' +
            'justify-content: center;' +
        '}' +
        '.action-btn {' +
            'background: none;' +
            'border: 1px solid transparent;' +
            'padding: 6px 8px;' +
            'border-radius: 4px;' +
            'cursor: pointer;' +
            'font-size: 0.85rem;' +
            'transition: all 0.2s ease;' +
            'display: inline-flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'min-width: 28px;' +
            'height: 28px;' +
        '}' +
        '.action-btn.view {' +
            'color: #17a2b8;' +
        '}' +
        '.action-btn.view:hover {' +
            'background-color: #17a2b8;' +
            'color: white;' +
        '}' +
        '.action-btn.edit {' +
            'color: #28a745;' +
        '}' +
        '.action-btn.edit:hover {' +
            'background-color: #28a745;' +
            'color: white;' +
        '}' +
        '.action-btn.delete {' +
            'color: #dc3545;' +
        '}' +
        '.action-btn.delete:hover {' +
            'background-color: #dc3545;' +
            'color: white;' +
        '}' +
        '.action-col {' +
            'text-align: center;' +
            'white-space: nowrap;' +
        '}';
    document.head.appendChild(style);
    
    // 편집 모드에서 전화번호 포맷팅 이벤트 설정
    var phoneInput = document.getElementById('modalUserPhone');
    if (phoneInput) {
        setupFormattingEvents();
    }
    
    // Export functions to global scope
    window.openMemberDetailFromData = openMemberDetailFromData;
    window.openMemberDetail = openMemberDetail;
    window.closeModal = closeModal;
    window.enableEdit = enableEdit;
    window.saveMemberInfo = saveMemberInfo;
    window.deleteMember = deleteMember;
    window.deleteMemberFromModal = deleteMemberFromModal;
    window.toggleMemberSelection = toggleMemberSelection;
    window.toggleAllMembers = toggleAllMembers;
    window.viewMemberDetail = viewMemberDetail;
    window.editMemberInfo = editMemberInfo;
    window.deleteMemberConfirm = deleteMemberConfirm;
    window.deleteMemberById = deleteMemberById;
    
    console.log('Functions exported to global scope');
    console.log('Member management system initialized successfully');
});
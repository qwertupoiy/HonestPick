<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="path" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 광고 추가</title>
    <link rel="stylesheet" href="${path}/_css/admin_ads_add.css">
    <style>
        .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            font-family: 'Noto Sans KR', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            resize: vertical;
            min-height: 120px;
            transition: border-color 0.3s ease;
        }

        .form-textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-textarea::placeholder {
            color: #adb5bd;
        }

        .form-group.error .form-textarea {
            border-color: #dc3545;
        }

        .char-count {
            font-size: 12px;
            color: #6c757d;
            font-weight: 500;
            margin-right: 10px;
        }

        .form-help {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 8px;
        }

        /* 날짜 입력 필드 스타일 */
        .form-input[type="date"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid var(--admin-border-color);
            border-radius: 8px;
            font-size: 0.95rem;
            transition: var(--transition);
            background: var(--admin-bg-white);
            font-family: inherit;
            color: var(--admin-text-dark);
        }

        .form-input[type="date"]:focus {
            outline: none;
            border-color: var(--admin-primary-color);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-input[type="date"]::-webkit-calendar-picker-indicator {
            color: var(--admin-primary-color);
            cursor: pointer;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- 관리자 헤더 -->
    <%@ include file="../_include/admin_header.jsp" %>

    <div class="admin-container">
        <main class="admin-main">
            <!-- 페이지 헤더 -->
            <div class="page-header">
                <div class="header-content">
                    <div class="header-left">
                        <div class="breadcrumb">
                            <a href="${path}/Admin_servlet/admin_ads.do" class="breadcrumb-link">
                                <i class="fas fa-ad"></i>
                                광고 관리
                            </a>
                            <i class="fas fa-chevron-right"></i>
                            <span class="breadcrumb-current">광고 추가</span>
                        </div>
                        <h1 class="page-title">
                            <i class="fas fa-plus-circle"></i>
                            새 광고 추가
                        </h1>
                        <p class="page-subtitle">새로운 광고를 등록하고 기간을 설정할 수 있습니다.</p>
                    </div>
                    <div class="header-actions">
                        <a href="${path}/Admin_servlet/admin_ads.do" class="btn btn-outline">
                            <i class="fas fa-arrow-left"></i>
                            <span>목록으로</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 광고 추가 폼 -->
            <div class="form-container">
                <div class="form-card">
                    <div class="form-header">
                        <h3>광고 정보 입력</h3>
                        <p>모든 필수 항목을 입력해주세요.</p>
                    </div>
                    
                    <form id="addAdForm" action="${path}/Admin_servlet/admin_ads_addProc.do" method="post" enctype="multipart/form-data">
                        <div class="form-body">
                            <!-- 광고 제목 -->
                            <div class="form-group">
                                <label for="adTitle" class="form-label">
                                    <i class="fas fa-heading"></i>
                                    광고 제목 
                                    <span class="required">*</span>
                                </label>
                                <input type="text" id="adTitle" name="adTitle" class="form-input" 
                                       placeholder="광고 제목을 입력하세요" required maxlength="100">
                                <div class="form-help">최대 100자까지 입력 가능합니다.</div>
                                <div class="error-message">광고 제목을 입력해주세요.</div>
                            </div>
                            
                            <!-- 광고 이미지 -->
                            <div class="form-group">
                                <label for="adImage" class="form-label">
                                    <i class="fas fa-image"></i>
                                    광고 이미지 
                                    <span class="required">*</span>
                                </label>
                                <div class="file-upload-area">
                                    <div class="file-input-wrapper">
                                        <input type="file" id="adImage" name="adImage" class="file-input" 
                                               accept="image/*" required>
                                        <label for="adImage" class="file-input-label">
                                            <div class="upload-icon">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                            </div>
                                            <div class="upload-text">
                                                <span class="upload-main">이미지를 선택하거나 드래그하세요</span>
                                                <span class="upload-sub">JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="file-preview" id="filePreview" style="display: none;"></div>
                                </div>
                                <div class="error-message">광고 이미지를 선택해주세요.</div>
                            </div>
                            
                            <!-- 광고 설명 -->
                            <div class="form-group">
                                <label for="description" class="form-label">
                                    <i class="fas fa-align-left"></i>
                                    광고 설명 
                                    <span class="required">*</span>
                                </label>
                                <textarea id="description" name="description" class="form-textarea" 
                                          placeholder="광고에 대한 상세한 설명을 입력하세요" required maxlength="500" rows="5"></textarea>
                                <div class="form-help">
                                    <span class="char-count">
                                        <span id="charCount">0</span>/500자
                                    </span>
                                    광고의 목적, 타겟 고객, 특징 등을 포함해주세요.
                                </div>
                                <div class="error-message">광고 설명을 입력해주세요.</div>
                            </div>
                            
                            <!-- 광고 시작일 -->
                            <div class="form-group">
                                <label for="adStartDate" class="form-label">
                                    <i class="fas fa-calendar-day"></i>
                                    광고 시작일 
                                    <span class="required">*</span>
                                </label>
                                <input type="date" id="adStartDate" name="adStartDate" class="form-input" required>
                                <div class="form-help">광고가 시작될 날짜를 선택해주세요. 오늘 이후 날짜만 선택 가능합니다.</div>
                                <div class="error-message">광고 시작일을 선택해주세요.</div>
                            </div>
                            
                            <!-- 광고 기간 선택 -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-calendar-alt"></i>
                                    광고 기간 선택 
                                    <span class="required">*</span>
                                </label>
                                <div class="period-selection">
                                    <div class="period-grid">
                                        <div class="period-option">
                                            <input type="radio" id="period7" name="adPeriod" value="1" required>
                                            <label for="period7" class="period-card">
                                                <div class="period-header">
                                                    <div class="period-duration">7일</div>
                                                    <div class="period-badge">단기</div>
                                                </div>
                                                <div class="period-price">₩50,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-check"></i> 빠른 홍보 효과
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period30" name="adPeriod" value="2" required>
                                            <label for="period30" class="period-card">
                                                <div class="period-header">
                                                    <div class="period-duration">30일</div>
                                                    <div class="period-badge popular">인기</div>
                                                </div>
                                                <div class="period-price">₩180,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-check"></i> 최적의 노출 기간
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period90" name="adPeriod" value="3" required>
                                            <label for="period90" class="period-card">
                                                <div class="period-header">
                                                    <div class="period-duration">90일</div>
                                                    <div class="period-badge">장기</div>
                                                </div>
                                                <div class="period-price">₩480,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-check"></i> 안정적인 브랜딩
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period365" name="adPeriod" value="4" required>
                                            <label for="period365" class="period-card">
                                                <div class="period-header">
                                                    <div class="period-duration">365일</div>
                                                    <div class="period-badge premium">프리미엄</div>
                                                </div>
                                                <div class="period-price">₩1,680,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-check"></i> 연간 마케팅 솔루션
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="error-message">광고 기간을 선택해주세요.</div>
                            </div>
                        </div>
                        
                        <div class="form-footer">
                            <div class="form-actions">
                                <a href="${path}/Admin_servlet/admin_ads.do" class="btn btn-outline btn-large">
                                    <i class="fas fa-times"></i>
                                    취소
                                </a>
                                <button type="submit" class="btn btn-primary btn-large">
                                    <i class="fas fa-plus"></i> 
                                    광고 등록
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <!-- 로딩 스피너 -->
    <div id="loadingSpinner" class="loading-spinner" style="display: none;">
        <div class="spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>광고를 등록하는 중...</p>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initializeForm();
            setMinStartDate();
        });

        function initializeForm() {
            setupFileUpload();
            setupTextareaCounter();
            setupFormValidation();
            setupFormSubmission();
        }

        function setMinStartDate() {
            var startDateInput = document.getElementById('adStartDate');
            if (startDateInput) {
                var today = new Date();
                var tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                var minDate = tomorrow.toISOString().split('T')[0];
                startDateInput.setAttribute('min', minDate);
                
                // 기본값을 내일로 설정
                startDateInput.value = minDate;
            }
        }

        function setupFileUpload() {
            var fileInput = document.getElementById('adImage');
            var filePreview = document.getElementById('filePreview');
            var fileLabel = document.querySelector('.file-input-label');
            
            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    handleFileSelect(e);
                });
            }
        }

        function setupTextareaCounter() {
            var textarea = document.getElementById('description');
            var charCount = document.getElementById('charCount');
            
            if (textarea && charCount) {
                textarea.addEventListener('input', function() {
                    var currentLength = this.value.length;
                    charCount.textContent = currentLength;
                    
                    // 글자 수가 한계에 가까워지면 색상 변경
                    var charCountSpan = charCount.parentElement;
                    if (currentLength > 450) {
                        charCountSpan.style.color = '#dc3545';
                    } else if (currentLength > 400) {
                        charCountSpan.style.color = '#ffc107';
                    } else {
                        charCountSpan.style.color = '#6c757d';
                    }
                });
            }
        }

        function handleFileSelect(event) {
            var file = event.target.files[0];
            var filePreview = document.getElementById('filePreview');
            var uploadText = document.querySelector('.upload-main');
            
            if (file) {
                // 파일 크기 체크 (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('파일 크기는 5MB 이하만 업로드 가능합니다.', 'error');
                    event.target.value = '';
                    return;
                }
                
                // 파일 타입 체크
                if (!file.type.startsWith('image/')) {
                    showNotification('이미지 파일만 업로드 가능합니다.', 'error');
                    event.target.value = '';
                    return;
                }
                
                // 미리보기 생성
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (filePreview) {
                        filePreview.innerHTML = 
                            '<div class="preview-container">' +
                                '<img src="' + e.target.result + '" alt="미리보기" class="preview-image">' +
                                '<div class="preview-info">' +
                                    '<div class="preview-name">' + file.name + '</div>' +
                                    '<div class="preview-size">' + formatFileSize(file.size) + '</div>' +
                                '</div>' +
                                '<button type="button" class="preview-remove" onclick="removeFile()">' +
                                    '<i class="fas fa-times"></i>' +
                                '</button>' +
                            '</div>';
                        filePreview.style.display = 'block';
                    }
                    
                    if (uploadText) {
                        uploadText.textContent = '다른 이미지 선택';
                    }
                };
                reader.readAsDataURL(file);
                
                // 에러 상태 제거
                var formGroup = event.target.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('error');
                }
            }
        }

        function removeFile() {
            var fileInput = document.getElementById('adImage');
            var filePreview = document.getElementById('filePreview');
            var uploadText = document.querySelector('.upload-main');
            
            if (fileInput) fileInput.value = '';
            if (filePreview) filePreview.style.display = 'none';
            if (uploadText) uploadText.textContent = '이미지를 선택하거나 드래그하세요';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function setupFormValidation() {
            var form = document.getElementById('addAdForm');
            if (form) {
                var inputs = form.querySelectorAll('input[required], textarea[required]');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].addEventListener('blur', validateField);
                    inputs[i].addEventListener('input', clearError);
                }
            }
        }

        function validateField(event) {
            var field = event.target;
            var formGroup = field.closest('.form-group');
            
            if (!formGroup) return;
            
            if (field.type === 'file') {
                if (!field.files[0]) {
                    formGroup.classList.add('error');
                } else {
                    formGroup.classList.remove('error');
                }
            } else if (field.type === 'radio') {
                var radioGroup = document.querySelectorAll('input[name="' + field.name + '"]');
                var isChecked = false;
                for (var i = 0; i < radioGroup.length; i++) {
                    if (radioGroup[i].checked) {
                        isChecked = true;
                        break;
                    }
                }
                if (!isChecked) {
                    formGroup.classList.add('error');
                } else {
                    formGroup.classList.remove('error');
                }
            } else if (field.type === 'date') {
                if (!field.value) {
                    formGroup.classList.add('error');
                } else {
                    var selectedDate = new Date(field.value);
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    if (selectedDate < tomorrow) {
                        formGroup.classList.add('error');
                        showNotification('광고 시작일은 내일 이후 날짜를 선택해주세요.', 'warning');
                    } else {
                        formGroup.classList.remove('error');
                    }
                }
            } else {
                if (!field.value.trim()) {
                    formGroup.classList.add('error');
                } else {
                    formGroup.classList.remove('error');
                }
            }
        }

        function clearError(event) {
            var field = event.target;
            var formGroup = field.closest('.form-group');
            
            if (formGroup && field.value.trim()) {
                formGroup.classList.remove('error');
            }
        }

        function setupFormSubmission() {
            var form = document.getElementById('addAdForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    if (!validateForm()) {
                        e.preventDefault();
                        return false;
                    }
                    
                    // 폼이 유효하면 로딩 표시
                    showLoading();
                    
                    var submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        var originalText = submitBtn.innerHTML;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 등록 중...';
                        submitBtn.disabled = true;
                    }
                });
            }
        }

        function validateForm() {
            var isValid = true;
            var form = document.getElementById('addAdForm');
            
            if (!form) return false;
            
            // 제목 검증
            var titleInput = form.adTitle;
            if (titleInput) {
                var titleGroup = titleInput.closest('.form-group');
                if (!titleInput.value.trim()) {
                    if (titleGroup) titleGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (titleGroup) titleGroup.classList.remove('error');
                }
            }
            
            // 이미지 검증
            var imageInput = form.adImage;
            if (imageInput) {
                var imageGroup = imageInput.closest('.form-group');
                if (!imageInput.files[0]) {
                    if (imageGroup) imageGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (imageGroup) imageGroup.classList.remove('error');
                }
            }
            
            // 설명 검증
            var descriptionInput = form.description;
            if (descriptionInput) {
                var descriptionGroup = descriptionInput.closest('.form-group');
                if (!descriptionInput.value.trim()) {
                    if (descriptionGroup) descriptionGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (descriptionGroup) descriptionGroup.classList.remove('error');
                }
            }
            
            // 시작일 검증
            var startDateInput = form.adStartDate;
            if (startDateInput) {
                var startDateGroup = startDateInput.closest('.form-group');
                if (!startDateInput.value) {
                    if (startDateGroup) startDateGroup.classList.add('error');
                    isValid = false;
                } else {
                    var selectedDate = new Date(startDateInput.value);
                    var tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    if (selectedDate < tomorrow) {
                        if (startDateGroup) startDateGroup.classList.add('error');
                        showNotification('광고 시작일은 내일 이후 날짜를 선택해주세요.', 'warning');
                        isValid = false;
                    } else {
                        if (startDateGroup) startDateGroup.classList.remove('error');
                    }
                }
            }
            
            // 기간 검증
            var periodInputs = form.querySelectorAll('input[name="adPeriod"]');
            if (periodInputs.length > 0) {
                var periodGroup = periodInputs[0].closest('.form-group');
                var periodSelected = false;
                
                for (var i = 0; i < periodInputs.length; i++) {
                    if (periodInputs[i].checked) {
                        periodSelected = true;
                        break;
                    }
                }
                
                if (!periodSelected) {
                    if (periodGroup) periodGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (periodGroup) periodGroup.classList.remove('error');
                }
            }
            
            if (!isValid) {
                showNotification('모든 필수 항목을 입력해주세요.', 'warning');
                // 첫 번째 에러 필드로 스크롤
                var firstError = document.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            
            return isValid;
        }

        function showLoading() {
            var spinner = document.getElementById('loadingSpinner');
            if (spinner) {
                spinner.style.display = 'flex';
            }
        }

        function showNotification(message, type) {
            type = type || 'info';
            
            // 기존 알림 제거
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

            notification.style.cssText = 
                'position: fixed;' +
                'top: 90px;' +
                'right: 20px;' +
                'background: white;' +
                'border: 1px solid #dee2e6;' +
                'border-left: 4px solid ' + getNotificationColor(type) + ';' +
                'border-radius: 8px;' +
                'padding: 15px 20px;' +
                'box-shadow: 0 4px 8px rgba(0,0,0,0.15);' +
                'z-index: 10000;' +
                'max-width: 400px;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: space-between;' +
                'gap: 15px;';

            document.body.appendChild(notification);

            setTimeout(function() {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 4000);
        }

        function getNotificationIcon(type) {
            switch(type) {
                case 'success': return 'check-circle';
                case 'error': return 'exclamation-circle';
                case 'warning': return 'exclamation-triangle';
                default: return 'info-circle';
            }
        }

        function getNotificationColor(type) {
            switch(type) {
                case 'success': return '#28a745';
                case 'error': return '#dc3545';
                case 'warning': return '#ffc107';
                default: return '#17a2b8';
            }
        }

        function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
    </script>

</body>
</html>
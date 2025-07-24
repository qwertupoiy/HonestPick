<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="path" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 광고 수정</title>
<%--     <link rel="stylesheet" href="${path}/_css/admin_ads_add.css"> --%>
    <link rel="stylesheet" href="${path}/_css/admin_ads_edit.css">
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
                            <a href="${path}/Admin_servlet/admin_ad_view.do?adNo=${ad.adNo}" class="breadcrumb-link">
                                광고 상세보기
                            </a>
                            <i class="fas fa-chevron-right"></i>
                            <span class="breadcrumb-current">광고 수정</span>
                        </div>
                        <h1 class="page-title">
                            <i class="fas fa-edit"></i>
                            광고 수정
                        </h1>
                        <p class="page-subtitle">광고 정보를 수정할 수 있습니다.</p>
                    </div>
                    <div class="header-actions">
                        <a href="${path}/Admin_servlet/admin_ad_view.do?adNo=${ad.adNo}" class="btn btn-outline">
                            <i class="fas fa-arrow-left"></i>
                            <span>상세보기로</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 광고 수정 폼 -->
            <div class="form-container">
                <div class="form-card">
                    <div class="form-header">
                        <h3>광고 정보 수정</h3>
                        <p>수정할 항목을 변경해주세요.</p>
                    </div>
                    
                    <form id="editAdForm" action="${path}/Admin_servlet/admin_ads_editProc.do" method="post" enctype="multipart/form-data">
                        <input type="hidden" name="adNo" value="${ad.adNo}">
                        <input type="hidden" name="adEndDate" value="${ad.adEndDate }">
                        
                        <div class="form-body">
                            <!-- 광고 제목 -->
                            <div class="form-group">
                                <label for="adTitle" class="form-label">
                                    <i class="fas fa-heading"></i>
                                    광고 제목 
                                    <span class="required">*</span>
                                </label>
                                <input type="text" id="adTitle" name="adTitle" class="form-input" 
                                       placeholder="광고 제목을 입력하세요" required maxlength="100"
                                       value="${ad.adTitle}">
                                <div class="form-help">최대 100자까지 입력 가능합니다.</div>
                                <div class="error-message">광고 제목을 입력해주세요.</div>
                            </div>
                            
                            <!-- 현재 이미지 표시 -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-image"></i>
                                    현재 이미지
                                </label>
                                <div class="current-image-section">
                                    <c:choose>
                                        <c:when test="${not empty ad.adImage}">
                                            <img src="${path}/attach/${ad.adImage}" 
                                                 alt="${ad.adImage}" 
                                                 class="current-ad-image">
                                        </c:when>
                                        <c:otherwise>
                                            <img src="${path}/assets/default-ad.png" 
                                                 alt="기본 광고 이미지" 
                                                 class="current-ad-image">
                                        </c:otherwise>
                                    </c:choose>
                                    <div class="current-image-info">
                                        <p class="image-name">현재 업로드된 이미지</p>
                                        <p class="image-help">새 이미지를 선택하면 현재 이미지가 교체됩니다.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 새 이미지 업로드 -->
                            <div class="form-group">
                                <label for="adImage" class="form-label">
                                    <i class="fas fa-upload"></i>
                                    새 이미지 업로드
                                    <span class="optional">(선택사항)</span>
                                </label>
                                <div class="file-upload-area">
                                    <div class="file-input-wrapper">
                                        <input type="file" id="adImage" name="adImage" value="${ad.adImage }" class="file-input" 
                                               accept="image/*">
                                        <label for="adImage" class="file-input-label">
                                            <div class="upload-icon">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                            </div>
                                            <div class="upload-text">
                                                <span class="upload-main">새 이미지를 선택하세요</span>
                                                <span class="upload-sub">JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)</span>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="file-preview" id="filePreview" style="display: none;"></div>
                                </div>
                                <div class="error-message">올바른 이미지 파일을 선택해주세요.</div>
                            </div>
                            
                            <!-- 광고 설명 -->
                            <div class="form-group">
                                <label for="description" class="form-label">
                                    <i class="fas fa-align-left"></i>
                                    광고 설명 
                                    <span class="required">*</span>
                                </label>
                                <textarea id="description" name="description" class="form-textarea" 
                                          placeholder="광고에 대한 상세한 설명을 입력하세요" required maxlength="500" rows="5">${ad.description}</textarea>
                                <div class="form-help">
                                    <span class="char-count">
                                        <span id="charCount">${fn:length(ad.description)}</span>/500자
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
                                <input type="date" id="adStartDate" name="adStartDate" class="form-input" required
                                       value="${ad.adStartDate}">
                                <div class="form-help">광고가 시작될 날짜를 선택해주세요. (오늘 이후 날짜만 가능)</div>
                                <div class="error-message">올바른 광고 시작일을 선택해주세요.</div>
                            </div>
                            
                            <!-- 광고 기간 선택/연장 -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-calendar-plus"></i>
                                    광고 기간 선택
                                    <span class="optional">(기간 연장 선택사항)</span>
                                </label>
                                <div class="period-info-section">
                                    <div class="current-period-info">
                                        <div class="period-item">
                                            <span class="period-label">현재 종료일:</span>
                                            <span class="period-value">${ad.adEndDate}</span>
                                        </div>
                                        <div class="period-item">
                                            <span class="period-label">남은 기간:</span>
                                            <span class="period-value remaining-period" data-end-date="${ad.adEndDate}">
                                                ${ad.remaining_days}일 남음
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="period-selection">
                                    <div class="period-grid">
                                        <div class="period-option">
                                            <input type="radio" id="period7" name="adPeriod" value="1"
                                                   ${ad.period eq 1 ? 'checked' : ''}>
                                            <label for="period7" class="period-card extend-card">
                                                <div class="period-header">
                                                    <div class="period-duration">+7일</div>
                                                    <div class="period-badge extend">연장</div>
                                                </div>
                                                <div class="period-price">₩25,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-plus"></i> 단기 연장
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period30" name="adPeriod" value="2"
                                                   ${ad.period eq 2 ? 'checked' : ''}>
                                            <label for="period30" class="period-card extend-card">
                                                <div class="period-header">
                                                    <div class="period-duration">+30일</div>
                                                    <div class="period-badge extend popular">인기</div>
                                                </div>
                                                <div class="period-price">₩90,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-plus"></i> 표준 연장
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period90" name="adPeriod" value="3"
                                                   ${ad.period eq 3 ? 'checked' : ''}>
                                            <label for="period90" class="period-card extend-card">
                                                <div class="period-header">
                                                    <div class="period-duration">+90일</div>
                                                    <div class="period-badge extend">장기</div>
                                                </div>
                                                <div class="period-price">₩240,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-plus"></i> 장기 연장
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="period365" name="adPeriod" value="4" 
                                                   ${ad.period eq 4 ? 'checked' : ''}>
                                            <label for="period365" class="period-card extend-card">
                                                <div class="period-header">
                                                    <div class="period-duration">+365일</div>
                                                    <div class="period-badge extend premium">프리미엄</div>
                                                </div>
                                                <div class="period-price">₩840,000</div>
                                                <div class="period-description">
                                                    <i class="fas fa-plus"></i> 연간 연장
                                                </div>
                                            </label>
                                        </div>
                                        
                                        <div class="period-option">
                                            <input type="radio" id="periodNone" name="adPeriod" value="0" 
                                                   ${empty ad.period or ad.period eq 0 ? 'checked' : ''}>
                                            <label for="periodNone" class="period-card no-extend-card">
                                                <div class="period-header">
                                                    <div class="period-duration">연장 안함</div>
                                                    <div class="period-badge no-extend">현재 유지</div>
                                                </div>
                                                <div class="period-price">₩0</div>
                                                <div class="period-description">
                                                    <i class="fas fa-check"></i> 기간 변경 없음
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
                                <a href="${path}/Admin_servlet/admin_ad_view.do?adNo=${ad.adNo}" class="btn btn-outline btn-large">
                                    <i class="fas fa-times"></i>
                                    취소
                                </a>
                                <button type="submit" class="btn btn-primary btn-large">
                                    <i class="fas fa-save"></i> 
                                    수정 완료
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 오늘 날짜와 내일 날짜 설정
            var today = new Date();
            var tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            
            var todayStr = today.toISOString().split('T')[0];
            var tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            // 광고 시작일 필드 설정
            var adStartDateInput = document.getElementById('adStartDate');
            if (adStartDateInput) {
                // 최소 날짜를 오늘로 설정
                adStartDateInput.min = todayStr;
                
                // 만약 현재 값이 없거나 과거 날짜면 내일로 설정
                var currentValue = adStartDateInput.value;
                if (!currentValue || currentValue < todayStr) {
                    adStartDateInput.value = tomorrowStr;
                }
            }

            // 글자 수 카운터
            var textarea = document.getElementById('description');
            var charCount = document.getElementById('charCount');
            if (textarea && charCount) {
                textarea.addEventListener('input', function() {
                    charCount.textContent = this.value.length;
                });
            }

            // 파일 업로드
            var fileInput = document.getElementById('adImage');
            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    var file = e.target.files[0];
                    var filePreview = document.getElementById('filePreview');
                    
                    if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                            alert('파일 크기는 5MB 이하만 업로드 가능합니다.');
                            e.target.value = '';
                            return;
                        }
                        
                        if (!file.type.startsWith('image/')) {
                            alert('이미지 파일만 업로드 가능합니다.');
                            e.target.value = '';
                            return;
                        }
                        
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            filePreview.innerHTML = 
                                '<div class="preview-container">' +
                                    '<img src="' + e.target.result + '" alt="새 이미지 미리보기" class="preview-image">' +
                                    '<div class="preview-info">' +
                                        '<div class="preview-name">새 이미지: ' + file.name + '</div>' +
                                        '<div class="preview-size">' + formatFileSize(file.size) + '</div>' +
                                    '</div>' +
                                    '<button type="button" class="preview-remove" onclick="removeFile()">' +
                                        '<i class="fas fa-times"></i>' +
                                    '</button>' +
                                '</div>';
                            filePreview.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // 폼 유효성 검사
            var form = document.getElementById('editAdForm');
            if (form) {
                form.addEventListener('submit', function(e) {
                    var isValid = true;
                    
                    // 에러 상태 초기화
                    var formGroups = document.querySelectorAll('.form-group');
                    formGroups.forEach(function(group) {
                        group.classList.remove('error');
                    });
                    
                    // 제목 검사
                    var adTitle = document.getElementById('adTitle');
                    if (adTitle && adTitle.value.trim() === '') {
                        adTitle.closest('.form-group').classList.add('error');
                        isValid = false;
                    }
                    
                    // 설명 검사
                    var description = document.getElementById('description');
                    if (description && description.value.trim() === '') {
                        description.closest('.form-group').classList.add('error');
                        isValid = false;
                    }
                    
                    // 시작일 검사 - 오늘 이후 날짜만 허용
                    var adStartDate = document.getElementById('adStartDate');
                    if (adStartDate) {
                        var selectedDate = adStartDate.value;
                        if (!selectedDate) {
                            adStartDate.closest('.form-group').classList.add('error');
                            isValid = false;
                        } else if (selectedDate < todayStr) {
                            adStartDate.closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                    }
                    
                    if (!isValid) {
                        e.preventDefault();
                        // 첫 번째 에러 필드로 스크롤
                        var firstError = document.querySelector('.form-group.error');
                        if (firstError) {
                            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                });
            }

            // 실시간 유효성 검사 - 입력 시 에러 상태 제거
            var inputs = document.querySelectorAll('.form-input, .form-textarea');
            inputs.forEach(function(input) {
                // input 이벤트 - 텍스트 입력 시
                input.addEventListener('input', function() {
                    if (this.type === 'date') {
                        // 날짜 필드는 change 이벤트에서 처리
                        return;
                    }
                    if (this.value.trim() !== '') {
                        this.closest('.form-group').classList.remove('error');
                    }
                });
                
                // change 이벤트 - 날짜 선택 시
                input.addEventListener('change', function() {
                    if (this.type === 'date') {
                        var selectedDate = this.value;
                        if (selectedDate && selectedDate >= todayStr) {
                            this.closest('.form-group').classList.remove('error');
                        }
                    } else if (this.value.trim() !== '') {
                        this.closest('.form-group').classList.remove('error');
                    }
                });
                
                // blur 이벤트 - 포커스 잃을 때
                input.addEventListener('blur', function() {
                    if (this.value.trim() !== '') {
                        this.closest('.form-group').classList.remove('error');
                    }
                });
            });

            // 라디오 버튼 변경 시 에러 상태 제거
            var radioInputs = document.querySelectorAll('input[type="radio"][name="adPeriod"]');
            radioInputs.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    var periodGroup = document.querySelector('.form-group:has(input[name="adPeriod"])');
                    if (periodGroup) {
                        periodGroup.classList.remove('error');
                    }
                });
            });
        });

        function removeFile() {
            var fileInput = document.getElementById('adImage');
            var filePreview = document.getElementById('filePreview');
            
            if (fileInput) fileInput.value = '';
            if (filePreview) filePreview.style.display = 'none';
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            var k = 1024;
            var sizes = ['Bytes', 'KB', 'MB', 'GB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    </script>
</body>
</html>
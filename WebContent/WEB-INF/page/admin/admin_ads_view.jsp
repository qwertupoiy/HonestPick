<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="path" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HonestPick - 광고 상세보기</title>
    <link rel="stylesheet" href="${path}/_css/admin_ads_view.css">
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
                        <nav class="breadcrumb">
                            <a href="${path}/Admin_servlet/admin_ads.do" class="breadcrumb-link">
                                <i class="fas fa-ad"></i>
                                광고 관리
                            </a>
                            <i class="fas fa-chevron-right"></i>
                            <span class="breadcrumb-current">상세보기</span>
                        </nav>
                        <h1 class="page-title">
                            <i class="fas fa-eye"></i>
                            광고 상세보기
                        </h1>
                        <p class="page-subtitle">광고의 상세 정보를 확인할 수 있습니다.</p>
                    </div>
                    <div class="header-actions">
                        <a href="${path}/Admin_servlet/admin_ads.do" class="btn btn-outline">
                            <i class="fas fa-arrow-left"></i>
                            <span>목록으로</span>
                        </a>
                        <a href="${path}/Admin_servlet/admin_ads_edit.do?adNo=${ad.adNo}" class="btn btn-primary">
                            <i class="fas fa-edit"></i>
                            <span>편집</span>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 상세 정보 컨테이너 -->
            <div class="detail-container">
                <!-- 기본 정보 카드 -->
                <div class="basic-info-card">
                    <div class="basic-info-header">
                        <h2 class="basic-info-title">
                            <i class="fas fa-ad"></i>
                            광고 기본 정보
                        </h2>
                        <div class="basic-info-id">#${ad.adNo}</div>
                    </div>
                    <div class="basic-info-content">
                        <div class="basic-info-grid">
                            <!-- 이미지 섹션 -->
                            <div class="image-section">
                                <c:choose>
                                    <c:when test="${not empty ad.adImage}">
                                        <img src="${path}/attach/${ad.adImage}" 
                                             alt="${ad.adTitle}" 
                                             class="ad-image">
                                    </c:when>
                                    <c:otherwise>
                                        <div class="no-image">
                                            <i class="fas fa-image"></i>
                                            <p>등록된 이미지가 없습니다</p>
                                        </div>
                                    </c:otherwise>
                                </c:choose>
                                <div class="image-caption">광고 이미지</div>
                            </div>

                            <!-- 정보 섹션 -->
                            <div class="info-section">
                                <h3 class="ad-title">${ad.adTitle}</h3>
                                <div class="info-list">
                                    <!-- 광고 시작일 -->
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <i class="fas fa-calendar-plus"></i>
                                        </div>
                                        <div class="info-content">
                                            <div class="info-label">광고 시작일</div>
                                            <div class="info-value">
                                                <c:choose>
                                                    <c:when test="${not empty ad.adStartDate}">
                                                        ${ad.adStartDate}
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span style="color: var(--admin-text-muted);">정보 없음</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 광고 종료일 -->
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <i class="fas fa-calendar-times"></i>
                                        </div>
                                        <div class="info-content">
                                            <div class="info-label">광고 종료일</div>
                                            <div class="info-value">
                                                <c:choose>
                                                    <c:when test="${not empty ad.adEndDate}">
                                                        ${ad.adEndDate}
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span style="color: var(--admin-text-muted);">정보 없음</span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 현재 상태 -->
                                    <div class="info-item">
                                        <div class="info-icon">
                                            <i class="fas fa-info-circle"></i>
                                        </div>
                                        <div class="info-content">
                                            <div class="info-label">현재 상태</div>
                                            <div class="info-value">
                                                <c:choose>
                                                    <c:when test="${not empty ad.adEndDate}">
                                                        <c:set var="remainingDays" value="${ad.remaining_days}" />
                                                        <c:choose>
                                                            <c:when test="${remainingDays < 0}">
                                                                <span class="status-badge status-expired">
                                                                    <i class="fas fa-stop-circle"></i>
                                                                    만료됨
                                                                </span>
                                                            </c:when>
                                                            <c:when test="${remainingDays == 0}">
                                                                <span class="status-badge status-ending">
                                                                    <i class="fas fa-exclamation-triangle"></i>
                                                                    오늘 만료
                                                                </span>
                                                            </c:when>
                                                            <c:when test="${remainingDays <= 7}">
                                                                <span class="status-badge status-ending">
                                                                    <i class="fas fa-clock"></i>
                                                                    종료 임박
                                                                </span>
                                                            </c:when>
                                                            <c:otherwise>
                                                                <span class="status-badge status-active">
                                                                    <i class="fas fa-play-circle"></i>
                                                                    진행중
                                                                </span>
                                                            </c:otherwise>
                                                        </c:choose>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <span class="status-badge status-unknown">
                                                            <i class="fas fa-question-circle"></i>
                                                            상태 불명
                                                        </span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- 광고 설명 (다른 정보들과 동일한 스타일) -->
                                    <c:if test="${not empty ad.description}">
                                        <div class="info-item">
                                            <div class="info-icon">
                                                <i class="fas fa-align-left"></i>
                                            </div>
                                            <div class="info-content">
                                                <div class="info-label">광고 설명</div>
                                                <div class="info-value info-description">
                                                    ${ad.description}
                                                </div>
                                            </div>
                                        </div>
                                    </c:if>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 하단 카드들 -->
                <div class="detail-cards">
                    <!-- 기간 정보 카드 -->
                    <div class="period-card">
                        <div class="period-header">
                            <i class="fas fa-calendar-alt"></i>
                            <h3>기간 정보</h3>
                        </div>
                        <div class="period-content">
                            <div class="period-item">
                                <div class="period-label">
                                    <i class="fas fa-calendar-plus"></i>
                                    등록일
                                </div>
                                <div class="period-value">
                                    <c:choose>
                                        <c:when test="${not empty ad.adRegidate}">
                                            ${ad.adRegidate}
                                        </c:when>
                                        <c:otherwise>
                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                            <div class="period-item">
                                <div class="period-label">
                                    <i class="fas fa-calendar-day"></i>
                                    시작일
                                </div>
                                <div class="period-value">
                                    <c:choose>
                                        <c:when test="${not empty ad.adStartDate}">
                                            ${ad.adStartDate}
                                        </c:when>
                                        <c:otherwise>
                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                            <div class="period-item">
                                <div class="period-label">
                                    <i class="fas fa-calendar-times"></i>
                                    종료일
                                </div>
                                <div class="period-value">
                                    <c:choose>
                                        <c:when test="${not empty ad.adEndDate}">
                                            ${ad.adEndDate}
                                        </c:when>
                                        <c:otherwise>
                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                            <div class="period-item">
                                <div class="period-label">
                                    <i class="fas fa-hourglass-half"></i>
                                    남은 기간
                                </div>
                                <div class="period-value">
                                    <c:set var="remainingDays" value="${ad.remaining_days}" />
                                    <c:choose>
                                        <c:when test="${remainingDays < 0}">
                                            <span style="color: var(--danger-color);">
                                                ${Math.abs(remainingDays)}일 전 만료
                                            </span>
                                        </c:when>
                                        <c:when test="${remainingDays == 0}">
                                            <span style="color: var(--danger-color);">오늘 만료</span>
                                        </c:when>
                                        <c:when test="${remainingDays <= 7}">
                                            <span style="color: var(--warning-color);">
                                                ${remainingDays}일 남음
                                            </span>
                                        </c:when>
                                        <c:when test="${remainingDays > 0}">
                                            <span style="color: var(--success-color);">
                                                ${remainingDays}일 남음
                                            </span>
                                        </c:when>
                                        <c:otherwise>
                                            <span style="color: var(--admin-text-muted);">정보 없음</span>
                                        </c:otherwise>
                                    </c:choose>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 관리 작업 카드 -->
                    <div class="action-card">
                        <div class="action-header">
                            <i class="fas fa-cogs"></i>
                            <h3>관리 작업</h3>
                        </div>
                        <div class="action-content">
                            <div class="action-buttons">
                                <a href="${path}/Admin_servlet/admin_ads_edit.do?adNo=${ad.adNo}" 
                                   class="action-button action-edit">
                                    <i class="fas fa-edit"></i>
                                    편집하기
                                </a>
                                
                                <button class="action-button action-delete" 
                                        onclick="deleteAd(${ad.adNo})">
                                    <i class="fas fa-trash"></i>
                                    삭제하기
                                </button>
                                
                                <a href="${path}/Admin_servlet/admin_ads.do" 
                                   class="action-button action-back">
                                    <i class="fas fa-arrow-left"></i>
                                    목록으로
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- 로딩 스피너 -->
    <div id="loadingSpinner" class="loading-spinner" style="display: none;">
        <div class="spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>처리 중...</p>
    </div>

    <script>
        console.log('admin_ads_view.js 로드 완료');

        /**
         * 광고 삭제
         */
        function deleteAd(adId) {
            if (confirm('정말로 이 광고를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
                showLoadingSpinner();
                // 실제 삭제 요청
                window.location.href = '${path}/Admin_servlet/admin_ads_delete.do?adNo=' + adId;
            }
        }

        /**
         * 로딩 스피너 표시
         */
        function showLoadingSpinner() {
            var spinner = document.getElementById('loadingSpinner');
            if (spinner) {
                spinner.style.display = 'flex';
            }
        }

        /**
         * 로딩 스피너 숨김
         */
        function hideLoadingSpinner() {
            var spinner = document.getElementById('loadingSpinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        }

        /**
         * 알림 표시
         */
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
                'animation: slideInRight 0.3s ease;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: space-between;' +
                'gap: 15px;';

            document.body.appendChild(notification);

            // 3초 후 자동 제거
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

        /**
         * 알림 아이콘 반환
         */
        function getNotificationIcon(type) {
            switch(type) {
                case 'success': return 'check-circle';
                case 'error': return 'exclamation-circle';
                case 'warning': return 'exclamation-triangle';
                default: return 'info-circle';
            }
        }

        /**
         * 알림 색상 반환
         */
        function getNotificationColor(type) {
            switch(type) {
                case 'success': return '#28a745';
                case 'error': return '#dc3545';
                case 'warning': return '#ffc107';
                default: return '#17a2b8';
            }
        }

        /**
         * HTML 이스케이프
         */
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

        // 페이지 로드 시 초기화
        document.addEventListener('DOMContentLoaded', function() {
            console.log('광고 상세보기 페이지 초기화 완료');
            
            // 이미지 로드 에러 처리
            var adImage = document.querySelector('.ad-image');
            if (adImage) {
                adImage.addEventListener('load', function() {
                    console.log('광고 이미지 로드 완료');
                });
                
                adImage.addEventListener('error', function() {
                    console.log('광고 이미지 로드 실패');
                    this.style.display = 'none';
                    var noImageDiv = this.nextElementSibling;
                    if (noImageDiv && noImageDiv.classList.contains('no-image')) {
                        noImageDiv.style.display = 'flex';
                    }
                });
            }
        });

        // 브라우저 뒤로가기 버튼 처리
        window.addEventListener('beforeunload', function() {
            hideLoadingSpinner();
        });
    </script>
</body>
</html>
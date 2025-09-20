<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>멤버십 구매 - HonestPick</title>
    <link rel="stylesheet" href="../_css/my_memberShip.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="../_js/my_memberShip.js" defer></script>
    
    <!-- 토스페이먼츠 SDK 추가 -->
    <script src="https://js.tosspayments.com/v1/payment"></script>
</head>
<body>
    <!-- Header 영역 -->
    <%@ include file="../_include/header.jsp" %>

    <!-- Main Content 영역 -->
    <main class="membership-main">
        <div class="container">
            <!-- 페이지 헤더 -->
            <div class="page-header">
                <h1><i class="fas fa-crown"></i> 프리미엄 멤버십</h1>
                <p class="page-subtitle">멤버십 구매로 매장을 상위 노출시키고 더 많은 고객을 만나보세요!</p>
            </div>

            <!-- 멤버십 혜택 안내 -->
            <section class="benefits-section">
                <div class="section-header">
                    <h2><i class="fas fa-star"></i> 멤버십 혜택</h2>
                </div>
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <h3>상위 노출</h3>
                        <p>검색 결과에서 우선적으로 노출되어 더 많은 고객의 눈에 띌 수 있습니다.</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>고객 유입 증가</h3>
                        <p>상위 노출로 인한 클릭률 향상으로 더 많은 고객이 매장을 방문합니다.</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>매출 향상</h3>
                        <p>증가된 노출과 방문으로 매장 매출 상승 효과를 기대할 수 있습니다.</p>
                    </div>
                </div>
            </section>

            <!-- 멤버십 구매 폼 - action 제거, onsubmit으로 결제 처리 -->
            <form id="membership-form" onsubmit="return false;">
                <!-- 기본 정보 (숨겨진 필드) -->
                <input type="hidden" name="MemberNo" value="${sessionScope.MemberNo}">
                <input type="hidden" name="StoreNo" value="${StoreNo}">
                <input type="hidden" name="State" value="${State}">
                
                <div class="membership-content">
                    <!-- 왼쪽 플랜 선택 영역 -->
                    <div class="membership-left">
                        <section class="membership-section">
                            <div class="section-header">
                                <h2><i class="fas fa-calendar-alt"></i> 멤버십 플랜 선택</h2>
                            </div>
                            <div class="section-content">
                                <div class="plans-grid">
                                    <!-- 1개월 플랜 -->
                                    <div class="plan-card" data-plan="1month" data-price="29000">
                                        <input type="radio" id="plan1month" name="membershipPlan" value="1개월" data-months="1">
                                        <label for="plan1month" class="plan-label">
                                            <div class="plan-header">
                                                <h3>1개월</h3>
                                                <div class="plan-badge">체험용</div>
                                            </div>
                                            <div class="plan-price">
                                                <span class="price">29,000</span>
                                                <span class="currency">원</span>
                                            </div>
                                            <div class="plan-period">월 29,000원</div>
                                            <ul class="plan-features">
                                                <li><i class="fas fa-check"></i> 상위 노출 30일</li>
                                                <li><i class="fas fa-check"></i> 프리미엄 배지</li>
                                                <li><i class="fas fa-check"></i> 우선 검색 노출</li>
                                            </ul>
                                        </label>
                                    </div>

                                    <!-- 3개월 플랜 -->
                                    <div class="plan-card" data-plan="3months" data-price="79000">
                                        <input type="radio" id="plan3months" name="membershipPlan" value="3개월" data-months="3">
                                        <label for="plan3months" class="plan-label">
                                            <div class="plan-header">
                                                <h3>3개월</h3>
                                                <div class="plan-badge popular">인기</div>
                                            </div>
                                            <div class="plan-price">
                                                <span class="original-price">87,000원</span>
                                                <span class="price">79,000</span>
                                                <span class="currency">원</span>
                                            </div>
                                            <div class="plan-period">월 26,333원 <span class="discount">9% 할인</span></div>
                                            <ul class="plan-features">
                                                <li><i class="fas fa-check"></i> 상위 노출 90일</li>
                                                <li><i class="fas fa-check"></i> 프리미엄 배지</li>
                                                <li><i class="fas fa-check"></i> 우선 검색 노출</li>
                                                <li><i class="fas fa-check"></i> 통계 리포트 제공</li>
                                            </ul>
                                        </label>
                                    </div>

                                    <!-- 6개월 플랜 -->
                                    <div class="plan-card" data-plan="6months" data-price="149000">
                                        <input type="radio" id="plan6months" name="membershipPlan" value="6개월" data-months="6">
                                        <label for="plan6months" class="plan-label">
                                            <div class="plan-header">
                                                <h3>6개월</h3>
                                                <div class="plan-badge recommended">추천</div>
                                            </div>
                                            <div class="plan-price">
                                                <span class="original-price">174,000원</span>
                                                <span class="price">149,000</span>
                                                <span class="currency">원</span>
                                            </div>
                                            <div class="plan-period">월 24,833원 <span class="discount">14% 할인</span></div>
                                            <ul class="plan-features">
                                                <li><i class="fas fa-check"></i> 상위 노출 180일</li>
                                                <li><i class="fas fa-check"></i> 프리미엄 배지</li>
                                                <li><i class="fas fa-check"></i> 우선 검색 노출</li>
                                                <li><i class="fas fa-check"></i> 통계 리포트 제공</li>
                                                <li><i class="fas fa-check"></i> 마케팅 지원</li>
                                            </ul>
                                        </label>
                                    </div>

                                    <!-- 1년 플랜 -->
                                    <div class="plan-card" data-plan="1year" data-price="279000">
                                        <input type="radio" id="plan1year" name="membershipPlan" value="1년" data-months="12">
                                        <label for="plan1year" class="plan-label">
                                            <div class="plan-header">
                                                <h3>1년</h3>
                                                <div class="plan-badge best">최고가치</div>
                                            </div>
                                            <div class="plan-price">
                                                <span class="original-price">348,000원</span>
                                                <span class="price">279,000</span>
                                                <span class="currency">원</span>
                                            </div>
                                            <div class="plan-period">월 23,250원 <span class="discount">20% 할인</span></div>
                                            <ul class="plan-features">
                                                <li><i class="fas fa-check"></i> 상위 노출 365일</li>
                                                <li><i class="fas fa-check"></i> 프리미엄 배지</li>
                                                <li><i class="fas fa-check"></i> 우선 검색 노출</li>
                                                <li><i class="fas fa-check"></i> 월간 통계 리포트</li>
                                                <li><i class="fas fa-check"></i> 전담 마케팅 지원</li>
                                                <li><i class="fas fa-check"></i> 이벤트 우선 참여</li>
                                            </ul>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <!-- 오른쪽 결제 정보 영역 -->
                    <div class="membership-right">
                        <!-- 선택된 플랜 요약 -->
                        <section class="membership-section">
                            <div class="section-header">
                                <h2><i class="fas fa-receipt"></i> 주문 요약</h2>
                            </div>
                            <div class="section-content">
                                <div class="order-summary">
                                    <div class="selected-plan">
                                        <h3 id="selected-plan-name">플랜을 선택해주세요</h3>
                                        <div id="selected-plan-details" class="plan-details" style="display: none;">
                                            <p class="plan-duration">기간: <span id="plan-duration-text"></span></p>
                                            <p class="plan-benefits">혜택: 상위 노출, 프리미엄 배지</p>
                                        </div>
                                    </div>
                                    
                                    <div class="price-breakdown">
                                        <div class="price-row">
                                            <span>기본 가격</span>
                                            <span id="original-price-display">-</span>
                                        </div>
                                        <div class="price-row discount-row" id="discount-row" style="display: none;">
                                            <span>할인 금액</span>
                                            <span id="discount-amount" class="discount-text">-</span>
                                        </div>
                                        <div class="price-row total-row">
                                            <span>최종 결제 금액</span>
                                            <span id="final-price-display" class="final-price">0원</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- 결제 방법 선택 -->
                        <section class="membership-section">
                            <div class="section-header">
                                <h2><i class="fas fa-credit-card"></i> 결제 방법</h2>
                            </div>
                            <div class="section-content">
                                <div class="payment-methods">
                                    <div class="payment-option">
                                        <input type="radio" id="card" name="paymentMethod" value="카드결제" checked>
                                        <label for="card" class="payment-label">
                                            <div class="payment-icon">
                                                <i class="fas fa-credit-card"></i>
                                            </div>
                                            <div class="payment-info">
                                                <h4>신용/체크카드</h4>
                                                <p>모든 카드사 이용 가능</p>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div class="payment-option">
                                        <input type="radio" id="bank" name="paymentMethod" value="계좌이체">
                                        <label for="bank" class="payment-label">
                                            <div class="payment-icon">
                                                <i class="fas fa-university"></i>
                                            </div>
                                            <div class="payment-info">
                                                <h4>계좌이체</h4>
                                                <p>실시간 계좌이체</p>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div class="payment-option">
                                        <input type="radio" id="kakao" name="paymentMethod" value="카카오페이">
                                        <label for="kakao" class="payment-label">
                                            <div class="payment-icon">
                                                <i class="fas fa-mobile-alt"></i>
                                            </div>
                                            <div class="payment-info">
                                                <h4>카카오페이</h4>
                                                <p>간편결제 서비스</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- 이용약관 동의 -->
                        <section class="membership-section">
                            <div class="section-header">
                                <h2><i class="fas fa-file-contract"></i> 약관 동의</h2>
                            </div>
                            <div class="section-content">
                                <div class="agreement-list">
                                    <div class="agreement-item">
                                        <input type="checkbox" id="terms-service" required>
                                        <label for="terms-service">
                                            <span class="required">[필수]</span> 서비스 이용약관 동의
                                            <a href="#" class="terms-link">약관 보기</a>
                                        </label>
                                    </div>
                                    
                                    <div class="agreement-item">
                                        <input type="checkbox" id="terms-payment" required>
                                        <label for="terms-payment">
                                            <span class="required">[필수]</span> 결제 및 환불약관 동의
                                            <a href="#" class="terms-link">약관 보기</a>
                                        </label>
                                    </div>
                                    
                                    <div class="agreement-item">
                                        <input type="checkbox" id="terms-privacy" required>
                                        <label for="terms-privacy">
                                            <span class="required">[필수]</span> 개인정보 처리방침 동의
                                            <a href="#" class="terms-link">약관 보기</a>
                                        </label>
                                    </div>
                                    
                                    <div class="agreement-item">
                                        <input type="checkbox" id="terms-marketing">
                                        <label for="terms-marketing">
                                            <span class="optional">[선택]</span> 마케팅 정보 수신 동의
                                            <a href="#" class="terms-link">약관 보기</a>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="agreement-all">
                                    <input type="checkbox" id="agree-all">
                                    <label for="agree-all" class="agree-all-label">
                                        <strong>전체 약관에 동의합니다.</strong>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <!-- 액션 버튼 -->
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="history.back()">취소</button>
                    <button type="button" id="purchase-btn" class="btn-primary" disabled onclick="handlePurchase()">
                        <i class="fas fa-crown"></i> 멤버십 구매하기
                    </button>
                </div>

                <!-- 숨겨진 필드 -->
                <input type="hidden" name="selectedPrice" id="selectedPrice" value="">
                <input type="hidden" name="selectedMonths" id="selectedMonths" value="">
            </form>
        </div>
    </main>

    <!-- 로딩 모달 -->
    <div id="loading-modal" class="loading-modal" style="display: none;">
        <div class="loading-content">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>결제 페이지로 이동 중...</p>
        </div>
    </div>

    <!-- Footer 영역 -->
    <%@ include file="../_include/footer.jsp" %>
</body>
</html>
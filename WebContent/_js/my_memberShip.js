// 멤버십 페이지 JavaScript (결제 연동 버전 - 수정됨)

// 토스페이먼츠 클라이언트 키 (실제 키로 교체 필요)
const TOSS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'; // 테스트 키

document.addEventListener('DOMContentLoaded', function() {
    initializeMembershipPage();
});

function initializeMembershipPage() {
    setupPlanSelection();
    setupPaymentMethods();
    setupAgreements();
    setupFormValidation();
    updatePurchaseButton();
    addLoadingModal();
}

// 플랜 선택 기능
function setupPlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    const planInputs = document.querySelectorAll('input[name="membershipPlan"]');
    
    planCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const input = card.querySelector('input[type="radio"]');
            if (input) {
                // 애니메이션 효과
                card.classList.add('selecting');
                setTimeout(() => {
                    card.classList.remove('selecting');
                }, 400);
                
                // 플랜 선택
                input.checked = true;
                updateSelectedPlan(card, input);
                updatePurchaseButton();
            }
        });
    });
    
    planInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                const card = this.closest('.plan-card');
                updateSelectedPlan(card, this);
                updatePurchaseButton();
            }
        });
    });
}

// 선택된 플랜 업데이트
function updateSelectedPlan(selectedCard, selectedInput) {
    // 모든 카드에서 selected 클래스 제거
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 선택된 카드에 selected 클래스 추가
    selectedCard.classList.add('selected');
    
    // 주문 요약 업데이트
    const planName = selectedInput.value;
    const planData = selectedCard.dataset;
    const price = parseInt(planData.price);
    const months = parseInt(selectedInput.dataset.months);
    
    updateOrderSummary(planName, price, months);
    
    // 숨겨진 필드 업데이트
    document.getElementById('selectedPrice').value = price;
    document.getElementById('selectedMonths').value = months;
}

// 주문 요약 업데이트
function updateOrderSummary(planName, price, months) {
    // 플랜 이름 업데이트
    document.getElementById('selected-plan-name').textContent = `${planName} 플랜`;
    
    // 플랜 상세 정보 표시
    const planDetails = document.getElementById('selected-plan-details');
    const planDurationText = document.getElementById('plan-duration-text');
    
    planDurationText.textContent = planName;
    planDetails.style.display = 'block';
    
    // 가격 계산
    const originalPrice = months * 29000; // 기본 월 가격
    const discount = originalPrice - price;
    
    // 가격 표시 업데이트
    document.getElementById('original-price-display').textContent = `${originalPrice.toLocaleString()}원`;
    
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('discount-amount');
    
    if (discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-${discount.toLocaleString()}원`;
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('final-price-display').textContent = `${price.toLocaleString()}원`;
}

// 결제 방법 선택 기능
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const input = option.querySelector('input[type="radio"]');
            if (input) {
                input.checked = true;
                updatePurchaseButton();
            }
        });
    });
    
    // 라디오 버튼 변경 이벤트
    const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');
    paymentInputs.forEach(input => {
        input.addEventListener('change', updatePurchaseButton);
    });
}

// 약관 동의 기능
function setupAgreements() {
    const agreeAllCheckbox = document.getElementById('agree-all');
    const individualCheckboxes = document.querySelectorAll('.agreement-item input[type="checkbox"]');
    const requiredCheckboxes = document.querySelectorAll('.agreement-item input[type="checkbox"][required]');
    
    // 전체 동의 체크박스 이벤트
    agreeAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        individualCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updatePurchaseButton();
    });
    
    // 개별 체크박스 이벤트
    individualCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 전체 동의 체크박스 상태 업데이트
            const allChecked = Array.from(individualCheckboxes).every(cb => cb.checked);
            agreeAllCheckbox.checked = allChecked;
            
            updatePurchaseButton();
        });
    });
}

// 폼 유효성 검사
function setupFormValidation() {
    const form = document.getElementById('membership-form');
    
    // 기존 submit 이벤트는 제거하고 버튼 클릭으로만 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // 항상 기본 제출 방지
        return false;
    });
}

// 구매 버튼 클릭 처리
function handlePurchase() {
    if (!validateForm()) {
        return;
    }
    
    if (confirmPurchase()) {
        requestTossPayment();
    }
}

// 폼 유효성 검사 함수
function validateForm() {
    const selectedPlan = document.querySelector('input[name="membershipPlan"]:checked');
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const requiredAgreements = document.querySelectorAll('.agreement-item input[type="checkbox"][required]');
    
    // 플랜 선택 확인
    if (!selectedPlan) {
        alert('멤버십 플랜을 선택해주세요.');
        return false;
    }
    
    // 결제 방법 선택 확인
    if (!selectedPayment) {
        alert('결제 방법을 선택해주세요.');
        return false;
    }
    
    // 필수 약관 동의 확인
    for (let checkbox of requiredAgreements) {
        if (!checkbox.checked) {
            alert('필수 약관에 모두 동의해주세요.');
            return false;
        }
    }
    
    return true;
}

// 구매 확인 다이얼로그
function confirmPurchase() {
    const selectedPlan = document.querySelector('input[name="membershipPlan"]:checked');
    const finalPrice = document.getElementById('final-price-display').textContent;
    
    const message = `${selectedPlan.value} 멤버십을 ${finalPrice}에 구매하시겠습니까?\n\n구매 후에는 취소가 제한될 수 있습니다.`;
    
    return confirm(message);
}

// 토스페이먼츠 결제 요청 (수정된 버전)
function requestTossPayment() {
    try {
        // 로딩 모달 표시
        showLoadingModal();
        
        // 토스페이먼츠 객체 생성
        const payment = TossPayments(TOSS_CLIENT_KEY);
        
        // 폼 데이터 수집
        const memberNo = document.querySelector('input[name="MemberNo"]').value;
        const storeNo = document.querySelector('input[name="StoreNo"]').value;
        const state = document.querySelector('input[name="State"]').value;
        const selectedPlan = document.querySelector('input[name="membershipPlan"]:checked');
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        const price = parseInt(document.getElementById('selectedPrice').value);
        const months = parseInt(document.getElementById('selectedMonths').value);
        
        // 주문 ID 생성
        const orderId = generateOrderId();
        
        // 현재 도메인과 컨텍스트 패스 가져오기
        const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf('/',1)) || '';
        
        // 성공 URL - 결제 서블릿으로 이동 (모든 데이터 포함)
        const successUrl = `${window.location.origin}${contextPath}/payment/success?` +
            `memberNo=${encodeURIComponent(memberNo)}&` +
            `storeNo=${encodeURIComponent(storeNo)}&` +
            `state=${encodeURIComponent(state)}&` +
            `membershipPlan=${encodeURIComponent(selectedPlan.value)}&` +
            `paymentMethod=${encodeURIComponent(selectedPayment.value)}&` +
            `selectedPrice=${price}&` +
            `selectedMonths=${months}&` +
            `orderId=${encodeURIComponent(orderId)}`;
        
        // 실패 URL
        const failUrl = `${window.location.origin}${contextPath}/payment/fail`;
        
        // 결제 방법에 따른 처리
        const paymentMethodMap = {
            '카드결제': '카드',
            '계좌이체': '계좌이체',
            '카카오페이': '카카오페이'
        };
        
        const tossPaymentMethod = paymentMethodMap[selectedPayment.value] || '카드';
        
        // 개발 모드에서 디버깅 정보 출력
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('=== 결제 요청 정보 ===');
            console.log('주문 ID:', orderId);
            console.log('결제 금액:', price);
            console.log('성공 URL:', successUrl);
            console.log('실패 URL:', failUrl);
            console.log('====================');
        }
        
        // 결제 요청
        payment.requestPayment(tossPaymentMethod, {
            amount: price,
            orderId: orderId,
            orderName: `${selectedPlan.value} 멤버십`,
            customerName: '구매자명', // 실제로는 세션에서 가져와야 함
            customerEmail: 'customer@example.com', // 실제로는 세션에서 가져와야 함
            successUrl: successUrl,
            failUrl: failUrl,
        }).catch(function(error) {
            // 결제 창 호출 실패 시
            hideLoadingModal();
            console.error('결제 창 호출 실패:', error);
            handlePaymentError(error);
        });
        
    } catch (error) {
        hideLoadingModal();
        console.error('결제 요청 중 오류:', error);
        alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 주문 ID 생성 함수
function generateOrderId() {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substr(2, 9);
    return `ORDER_${timestamp}_${randomString}`;
}

// 구매 버튼 상태 업데이트
function updatePurchaseButton() {
    const purchaseBtn = document.getElementById('purchase-btn');
    const selectedPlan = document.querySelector('input[name="membershipPlan"]:checked');
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const requiredAgreements = document.querySelectorAll('.agreement-item input[type="checkbox"][required]');
    
    // 모든 필수 조건 확인
    const planSelected = !!selectedPlan;
    const paymentSelected = !!selectedPayment;
    const agreementsChecked = Array.from(requiredAgreements).every(cb => cb.checked);
    
    const allValid = planSelected && paymentSelected && agreementsChecked;
    
    purchaseBtn.disabled = !allValid;
    
    // 버튼 텍스트 업데이트
    if (allValid && selectedPlan) {
        const finalPrice = document.getElementById('final-price-display').textContent;
        purchaseBtn.innerHTML = `<i class="fas fa-crown"></i> ${finalPrice} 결제하기`;
    } else {
        purchaseBtn.innerHTML = `<i class="fas fa-crown"></i> 멤버십 구매하기`;
    }
}

// 로딩 모달 관련 함수들
function addLoadingModal() {
    // 로딩 모달 CSS 추가
    if (!document.getElementById('loading-modal-style')) {
        const style = document.createElement('style');
        style.id = 'loading-modal-style';
        style.textContent = `
            .loading-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            
            .loading-content {
                background: white;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                max-width: 300px;
                width: 90%;
            }
            
            .loading-spinner {
                font-size: 2rem;
                color: var(--primary-color, #4a90e2);
                margin-bottom: 20px;
            }
            
            .loading-content p {
                margin: 0;
                font-size: 1rem;
                color: #333;
            }
        `;
        document.head.appendChild(style);
    }
}

function showLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 에러 처리 함수 (개선된 버전)
function handlePaymentError(error) {
    console.error('결제 오류:', error);
    
    let errorMessage = '결제 중 오류가 발생했습니다.';
    
    if (error.code) {
        switch (error.code) {
            case 'USER_CANCEL':
                errorMessage = '결제가 취소되었습니다.';
                break;
            case 'INVALID_CARD':
                errorMessage = '유효하지 않은 카드입니다.';
                break;
            case 'INSUFFICIENT_FUNDS':
                errorMessage = '잔액이 부족합니다.';
                break;
            case 'EXPIRED_CARD':
                errorMessage = '만료된 카드입니다.';
                break;
            case 'INVALID_PARAMETER':
                errorMessage = '잘못된 결제 정보입니다.';
                break;
            case 'NETWORK_ERROR':
                errorMessage = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                break;
            default:
                errorMessage = error.message || '결제 중 오류가 발생했습니다.';
        }
    }
    
    alert(errorMessage + '\n다시 시도해주세요.');
}

// 플랜 카드 호버 효과 개선
function enhancePlanCardEffects() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// 스크롤 애니메이션 효과
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.membership-section, .benefit-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 실시간 가격 계산기
function setupPriceCalculator() {
    const planInputs = document.querySelectorAll('input[name="membershipPlan"]');
    
    planInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                const months = parseInt(this.dataset.months);
                const basePrice = 29000;
                const totalBasePrice = basePrice * months;
                const actualPrice = parseInt(this.closest('.plan-card').dataset.price);
                const discount = totalBasePrice - actualPrice;
                const discountRate = Math.round((discount / totalBasePrice) * 100);
                
                // 할인율 표시 업데이트
                const planCard = this.closest('.plan-card');
                const discountElement = planCard.querySelector('.discount');
                
                if (discountElement && discount > 0) {
                    discountElement.textContent = `${discountRate}% 할인`;
                }
            }
        });
    });
}

// 약관 모달 기능 (추후 구현을 위한 준비)
function setupTermsModals() {
    const termsLinks = document.querySelectorAll('.terms-link');
    
    termsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // 추후 약관 모달 창 구현
            console.log('약관 모달 열기:', this.textContent);
            alert('약관 내용을 확인하는 기능은 추후 구현 예정입니다.');
        });
    });
}

// 디버깅을 위한 로그 함수
function logPaymentInfo() {
    const selectedPlan = document.querySelector('input[name="membershipPlan"]:checked');
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const price = document.getElementById('selectedPrice').value;
    const months = document.getElementById('selectedMonths').value;
    
    console.log('=== 결제 정보 ===');
    console.log('선택된 플랜:', selectedPlan ? selectedPlan.value : 'None');
    console.log('결제 방법:', selectedPayment ? selectedPayment.value : 'None');
    console.log('가격:', price);
    console.log('개월 수:', months);
    console.log('================');
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    hideLoadingModal();
});

// 페이지 로드 완료 후 추가 기능 초기화
function logDevelopmentInfo() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('멤버십 페이지 로드 완료');
        console.log('토스페이먼츠 클라이언트 키:', TOSS_CLIENT_KEY);

        const memberInput = document.querySelector('input[name="MemberNo"]');
        const storeInput = document.querySelector('input[name="StoreNo"]');
        const stateInput = document.querySelector('input[name="State"]');

        const memberNo = memberInput ? memberInput.value : '';
        const storeNo = storeInput ? storeInput.value : '';
        const state = stateInput ? stateInput.value : '';

        console.log('폼 데이터:', { memberNo, storeNo, state });
    }
}
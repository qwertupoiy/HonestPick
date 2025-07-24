// 멤버십 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMembershipPage();
});

function initializeMembershipPage() {
    setupPlanSelection();
    setupPaymentMethods();
    setupAgreements();
    setupFormValidation();
    updatePurchaseButton();
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
    
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
        
        // 구매 확인 다이얼로그
        if (!confirmPurchase()) {
            e.preventDefault();
            return false;
        }
    });
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
        });
    });
}

// 결제 진행 중 로딩 효과
function showPaymentLoading() {
    const purchaseBtn = document.getElementById('purchase-btn');
    const originalText = purchaseBtn.innerHTML;
    
    purchaseBtn.disabled = true;
    purchaseBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 결제 진행 중...';
    
    // 실제 결제 처리 후 원래 상태로 복구
    setTimeout(() => {
        purchaseBtn.disabled = false;
        purchaseBtn.innerHTML = originalText;
    }, 3000);
}

// 페이지 로드 완료 후 추가 기능 초기화
window.addEventListener('load', function() {
    enhancePlanCardEffects();
    setupScrollAnimations();
    setupPriceCalculator();
    setupTermsModals();
});
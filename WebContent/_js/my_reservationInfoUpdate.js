// 인원수 카운터 기능
document.addEventListener('DOMContentLoaded', function() {
    const decreaseBtn = document.querySelector('.decrease-btn');
    const increaseBtn = document.querySelector('.increase-btn');
    const counterValue = document.querySelector('.counter-value');
    const peopleCountInput = document.querySelector('.people-count-input');
    
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(counterValue.textContent);
        if (currentValue > 1) {
            currentValue--;
            counterValue.textContent = currentValue;
            peopleCountInput.value = currentValue;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(counterValue.textContent);
        if (currentValue < 10) {
            currentValue++;
            counterValue.textContent = currentValue;
            peopleCountInput.value = currentValue;
        }
    });
    
    // 코멘트 글자 수 카운터
    const commentTextarea = document.querySelector('.reservation-comment');
    const currentLength = document.querySelector('.current-length');
    
    commentTextarea.addEventListener('input', function() {
        currentLength.textContent = this.value.length;
    });
    
    // 변경 사유 글자 수 카운터
    const reasonTextarea = document.querySelector('.change-reason');
    const reasonLength = document.querySelector('.reason-length');
    
    reasonTextarea.addEventListener('input', function() {
        reasonLength.textContent = this.value.length;
    });
    
    // 초기 글자 수 설정
    currentLength.textContent = commentTextarea.value.length;
    reasonLength.textContent = reasonTextarea.value.length;
});
// 페이지 로드 시 현재 페이지에 맞는 메뉴 활성화
document.addEventListener('DOMContentLoaded', function() {
    // 현재 URL에서 액션명 추출
    const currentUrl = window.location.href;
    let currentPage = '';
    
    // URL에서 .do 앞의 액션명 추출
    if (currentUrl.includes('changeInfo.do')) {
        currentPage = 'changeInfo';
    } else if (currentUrl.includes('storeList.do')) {
        currentPage = 'storeList';
    } else if (currentUrl.includes('reservationInfo.do')) {
        currentPage = 'reservationInfo';
    } else if (currentUrl.includes('wishList.do')) {
        currentPage = 'wishList';
    } else if (currentUrl.includes('reviewList.do')) {
        currentPage = 'reviewList';
    } else if (currentUrl.includes('visitList.do')) {
        currentPage = 'visitList';
    }
    
    // 모든 메뉴 링크에서 active 클래스 제거
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 현재 페이지에 해당하는 메뉴에 active 클래스 추가
    if (currentPage) {
        const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});
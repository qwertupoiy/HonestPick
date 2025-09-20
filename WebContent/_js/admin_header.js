/**
 * 관리자 헤더 JavaScript
 * 현재 페이지 활성화, 드롭다운 메뉴, 접근성 기능 관리
 */

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initActivePageDetection();
    initDropdownMenus();
    initSmoothTransitions();
});

/**
 * 현재 페이지에 따라 active 클래스 추가
 */
function initActivePageDetection() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    
    // 현재 경로와 매치되는 메뉴에 active 클래스 추가
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
    
    // 드롭다운 메뉴의 현재 페이지 체크
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href.split('?')[0])) {
            // 부모 드롭다운 토글에도 active 추가
            const parentDropdown = link.closest('.has-dropdown').querySelector('.dropdown-toggle');
            if (parentDropdown) {
                parentDropdown.classList.add('active');
            }
        }
    });
}

/**
 * 드롭다운 메뉴 기능 초기화
 */
function initDropdownMenus() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // 각 드롭다운 토글에 이벤트 리스너 추가
    dropdownToggles.forEach(toggle => {
        // 클릭 이벤트
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDropdown(this);
        });
        
        // 키보드 네비게이션 지원 (Enter, Space)
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(this);
            }
        });
    });
    
    // 외부 클릭 시 모든 드롭다운 닫기
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.has-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // ESC 키로 드롭다운 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

/**
 * 드롭다운 토글 함수
 * @param {Element} toggle - 드롭다운 토글 요소
 */
function toggleDropdown(toggle) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // 다른 모든 드롭다운 닫기
    closeAllDropdowns();
    
    // 현재 드롭다운 토글
    if (!isExpanded) {
        toggle.setAttribute('aria-expanded', 'true');
        
        // 드롭다운 메뉴에 포커스 관리
        const dropdownMenu = toggle.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
            const firstLink = dropdownMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    }
}

/**
 * 모든 드롭다운 닫기
 */
function closeAllDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
    });
}

/**
 * 부드러운 페이지 전환 효과 초기화
 */
function initSmoothTransitions() {
    const clickableElements = document.querySelectorAll('.nav-link, .logout-btn');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // '#' 링크가 아닌 경우에만 애니메이션 적용
            if (this.getAttribute('href') !== '#') {
                addClickEffect(this);
            }
        });
    });
}

/**
 * 클릭 효과 추가
 * @param {Element} element - 클릭된 요소
 */
function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        element.style.transform = '';
        element.style.transition = '';
    }, 100);
}

/**
 * 드롭다운 메뉴 키보드 네비게이션
 */
function initDropdownKeyboardNavigation() {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    dropdownMenus.forEach(menu => {
        const links = menu.querySelectorAll('a');
        
        links.forEach((link, index) => {
            link.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextLink = links[index + 1] || links[0];
                        nextLink.focus();
                        break;
                        
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevLink = links[index - 1] || links[links.length - 1];
                        prevLink.focus();
                        break;
                        
                    case 'Escape':
                        e.preventDefault();
                        const parentToggle = menu.closest('.has-dropdown').querySelector('.dropdown-toggle');
                        if (parentToggle) {
                            closeAllDropdowns();
                            parentToggle.focus();
                        }
                        break;
                }
            });
        });
    });
}

/**
 * 사용자 메뉴 호버 효과 개선
 */
function initUserMenuEffects() {
    const userInfo = document.querySelector('.user-info');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (userInfo) {
        userInfo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        userInfo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // 로그아웃 시 간단한 확인
        logoutBtn.addEventListener('click', function(e) {
            const confirmLogout = confirm('로그아웃 하시겠습니까?');
            if (!confirmLogout) {
                e.preventDefault();
            }
        });
    }
}

/**
 * 로딩 완료 후 추가 기능 초기화
 */
window.addEventListener('load', function() {
    initDropdownKeyboardNavigation();
    initUserMenuEffects();
});

/**
 * 디버깅용 함수 (개발 중에만 사용)
 */
function debugHeaderState() {
    console.log('Current path:', window.location.pathname);
    console.log('Active links:', document.querySelectorAll('.nav-link.active'));
    console.log('Dropdown states:', Array.from(document.querySelectorAll('.dropdown-toggle')).map(el => ({
        element: el,
        expanded: el.getAttribute('aria-expanded')
    })));
}

/**
 * 페이지 전환 애니메이션
 */
function addPageTransition() {
    const body = document.body;
    body.style.opacity = '0.95';
    body.style.transition = 'opacity 0.2s ease';
    
    setTimeout(() => {
        body.style.opacity = '1';
        body.style.transition = '';
    }, 200);
}

/**
 * 관리자 권한 확인 (선택사항)
 */
function checkAdminPermission() {
    // 실제 구현에서는 서버에서 권한을 확인해야 합니다
    const adminMenu = document.querySelector('.admin-nav-menu');
    if (adminMenu && !window.location.pathname.includes('admin')) {
        console.log('Admin menu detected on non-admin page');
    }
}

// 개발 환경에서만 디버깅 정보 출력
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Admin Header JavaScript loaded successfully');
        console.log('Main page button initialized');
        // debugHeaderState(); // 필요시 주석 해제
    });
}
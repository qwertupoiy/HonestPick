package home.Class;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.*;

@WebFilter(urlPatterns = {"/Admin_servlet/*", "/Mypage_servlet/*"})
public class LoginCheckFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        HttpSession session = req.getSession(false);

        boolean isLoggedIn = session != null && session.getAttribute("MemberNo") != null;

        String url = req.getRequestURL().toString();

        // 로그인 예외 URL (예: 로그인 페이지 자체, 로그인 처리 요청 등)
        boolean isLoginPage = url.contains("login.do") || url.contains("login.jsp");

        if (!isLoggedIn && !isLoginPage) {
            res.sendRedirect(req.getContextPath() + "/Member_servlet/login.do");
            return;
        }

        chain.doFilter(request, response); // 로그인 상태라면 계속 진행
    }
}
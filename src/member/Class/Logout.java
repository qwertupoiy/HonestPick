package member.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import member.dao.MemberDAO;

public class Logout {
	public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	HttpSession session = request.getSession(false);
        if (session != null) {
            // DB에서 자동 로그인 토큰 삭제
            Integer memberNo = (Integer) session.getAttribute("MemberNo");
            if (memberNo != null) {
                MemberDAO dao = new MemberDAO();
                dao.removeAutoLoginToken(memberNo); // 이 메서드도 구현해야 함
            }

            // 세션 무효화
            session.invalidate();
        }

        // 쿠키 삭제
        Cookie cookie = new Cookie("autoLogin", "");
        cookie.setMaxAge(0); // 즉시 삭제
        cookie.setPath("/");
        response.addCookie(cookie);
        
        response.sendRedirect(path + "/Member_servlet/logoutProc.do");
    }
	
	public void processProc(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		HttpSession session = request.getSession();
        session.setAttribute("alertMsg", "로그아웃 되었습니다.");
        response.sendRedirect(path + "/Home_servlet/home.do");
    }
}
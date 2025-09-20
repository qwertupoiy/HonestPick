package member.Class;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import member.dao.MemberDAO;
import member.dto.MemberDTO;

public class Login {
    public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/member/login.jsp");
        rd.forward(request, response);
    }

    public void processProc(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        String MemberId = request.getParameter("MemberId");
        String MemberPwd = request.getParameter("MemberPwd");
        String rememberMe = request.getParameter("rememberMeValue"); // 자동 로그인 여부 확인 ("Y" 또는 "N")

        // MemberDTO 객체 생성 및 값 설정
        MemberDTO dtoag = new MemberDTO();
        dtoag.setMemberId(MemberId);

        // DB에서 조회
        MemberDAO dao = new MemberDAO();
        MemberDTO dtoLogin = dao.getLogin(dtoag);

        // 로그인 실패 (존재하지 않는 계정)
        if (dtoLogin.getMemberNo() == 0) {
            response.sendRedirect(path + "/Member_servlet/login.do");
            return;
        }

        // 결과 처리
        if (dtoLogin.getMemberPwd().equals(MemberPwd)) {
            System.out.println("login success");

            // HttpSession 객체 선언 및 값 설정
            HttpSession session = request.getSession();
            session.setAttribute("MemberNo", dtoLogin.getMemberNo());
            session.setAttribute("MemberNickname", dtoLogin.getMemberNickname());
            session.setAttribute("Admin", dtoLogin.getAdmin());
            session.setMaxInactiveInterval(60 * 60); // 1시간
            
            // ===== 🔐 자동 로그인 처리 시작 =====
            if ("Y".equals(rememberMe)) {
                // 고유한 토큰 생성
            	String token = UUID.randomUUID().toString();
                dtoLogin.setToken(token);
                dtoLogin.setMemberNo(dtoLogin.getMemberNo());
                
                // DB에 토큰 저장 (자동 로그인 테이블 또는 Member 테이블에)
                dao.saveAutoLoginToken(dtoLogin);

                // 쿠키 생성 및 브라우저에 전달
                Cookie autoLoginCookie = new Cookie("autoLogin", token);
                autoLoginCookie.setMaxAge(60 * 60 * 24 * 7); // 7일 유지
                autoLoginCookie.setPath("/"); // 모든 경로에 적용
                autoLoginCookie.setHttpOnly(true); // JS 접근 방지 (보안)
                response.addCookie(autoLoginCookie);
            }
            // ===== 🔐 자동 로그인 처리 끝 =====

            // set.alertMsg
            session.setAttribute("alertMsg", "로그인 되었습니다.");
            
            response.sendRedirect(path + "/Home_servlet/home.do");

        } else {
            System.out.println("login fail");
            response.sendRedirect(path + "/Member_servlet/login.do");
        }
    }
}
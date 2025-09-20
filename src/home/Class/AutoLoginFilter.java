package home.Class;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.*;

import member.dao.MemberDAO;
import member.dto.MemberDTO;

@WebFilter("/*") // 모든 요청에 대해 필터 적용 (LoginCheckFilter보다 먼저 실행되도록)
public class AutoLoginFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // 이미 로그인 되어 있는 경우, 자동 로그인 필요 없음
        HttpSession session = req.getSession(false);
        boolean isLoggedIn = (session != null && session.getAttribute("MemberNo") != null);

        if (!isLoggedIn) {
            Cookie[] cookies = req.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("autoLogin".equals(cookie.getName())) {
                        String token = cookie.getValue();

                        // DB에서 해당 토큰으로 사용자 조회
                        MemberDAO dao = new MemberDAO();
                        MemberDTO dto = dao.getMemberByToken(token);
                        if (dto == null) {
                            System.out.println("[AutoLoginFilter] 자동 로그인 실패: 유효하지 않은 토큰");
                        } else {
                            System.out.println("[AutoLoginFilter] 자동 로그인 성공: " + dto.getMemberNickname());
                        }

                        if (dto != null) {
                            // 세션 새로 만들고 사용자 정보 설정
                            session = req.getSession();
                            session.setAttribute("MemberNo", dto.getMemberNo());
                            session.setAttribute("MemberNickname", dto.getMemberNickname());
                            session.setAttribute("Admin", dto.getAdmin());
                            session.setMaxInactiveInterval(60 * 60); // 1시간 유지
                        }

                        break; // 쿠키 찾았으니 반복 중단
                    }
                }
            }
        }

        // 다음 필터 또는 서블릿으로 계속 진행
        chain.doFilter(request, response);
    }
}

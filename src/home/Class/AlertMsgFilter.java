package home.Class;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.*;

@WebFilter("/*") // 모든 요청에 대해 필터 적용
public class AlertMsgFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {

    	HttpServletRequest httpReq = (HttpServletRequest) request;
    	HttpSession session = httpReq.getSession();
        String sessAlertMsg = (String) session.getAttribute("alertMsg");
        if (sessAlertMsg != null) {
        	String alertMsg = sessAlertMsg;
        	session.removeAttribute("alertMsg");
        	request.setAttribute("alertMsg", alertMsg);
        }

        // 다음 필터 또는 서블릿으로 계속 진행
        chain.doFilter(request, response);
    }
}

package member.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import member.Class.Join;
import member.Class.Login;
import member.Class.Logout;

@WebServlet("/Member_servlet/*")
public class MemberController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	request.setCharacterEncoding("UTF-8");
        
        String path = request.getContextPath();
        String url = request.getRequestURL().toString();
        
        request.setAttribute("path", path);
        
        // Member Register
        if (url.contains("join.do")) {
            Join join = new Join();
            join.process(request, response, path);
        } else if (url.contains("joinProc.do")) {
            Join join = new Join();
            join.processProc(request, response, path);
        
	    // id_check
        } else if (url.contains("idCheck.do")) {
            Join join = new Join();
            join.id_check(request, response, path);
            
        // nick_check
        } else if (url.contains("nickCheck.do")) {
            Join join = new Join();
            join.nick_check(request, response, path);
        
	    // login page
        } else if (url.contains("login.do")) {
            Login login = new Login();
            login.process(request, response, path);
	    } else if (url.contains("loginProc.do")) {
            Login login = new Login();
            login.processProc(request, response, path);
            
        // logout
	    } else if (url.contains("logout.do")) {
            Logout logout = new Logout();
            logout.process(request, response, path);
	    } else if (url.contains("logoutProc.do")) {
            Logout logout = new Logout();
            logout.processProc(request, response, path);
            
        // none
	    } else {
            System.out.println("== Member Controller Contains None ==");
            return;
	    }
	}

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}
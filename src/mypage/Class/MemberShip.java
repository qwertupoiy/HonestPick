package mypage.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mypage.controller.MypageCommand;

public class MemberShip implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		String State = request.getParameter("State");

		request.setAttribute("StoreNo", StoreNo);
		request.setAttribute("State", State);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/memberShip.jsp");
        rd.forward(request, response);
    }
}
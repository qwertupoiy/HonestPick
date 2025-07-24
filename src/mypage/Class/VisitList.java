package mypage.Class;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import store.dto.ReservationDTO;

public class VisitList implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		// MemberNo check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (sessMemberNo != MemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
		
		ReservationDTO dtoAg = new ReservationDTO();
		dtoAg.setMemberNo(MemberNo);
		dtoAg.setPage("visit");
        
        MypageDAO dao = new MypageDAO();
        List<ReservationDTO> listVisit = dao.getSelectAllRes(dtoAg);
        
        request.setAttribute("listVisit", listVisit);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/visitList.jsp");
        rd.forward(request, response);
    }
}
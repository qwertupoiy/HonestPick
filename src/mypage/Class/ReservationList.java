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

public class ReservationList implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String MemberNo_ = request.getParameter("MemberNo");
		int MemberNo = Integer.parseInt(MemberNo_);
		
		// MemberNo check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (sessMemberNo != MemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
    	
		ReservationDTO dtoAg = new ReservationDTO();
		dtoAg.setMemberNo(MemberNo);
		dtoAg.setPage("res");
        
        MypageDAO dao = new MypageDAO();
        List<ReservationDTO> listRes = dao.getSelectAllRes(dtoAg);

        request.setAttribute("listRes", listRes);
    	
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/reservationInfo.jsp");
        rd.forward(request, response);
    }
}
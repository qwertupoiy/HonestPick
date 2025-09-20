package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import store.dto.ReservationDTO;

public class ReservationRemove implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int resNo = Integer.parseInt(request.getParameter("resNo"));
    	HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		
    	ReservationDTO dtoRes = new ReservationDTO();
	    dtoRes.setResNo(resNo);
        
	    MypageDAO dao = new MypageDAO();
        int result = dao.setDelete(dtoRes);
        
        if (result > 0) {
            System.out.println("success");
            session.setAttribute("alertMsg", "예약 정보가 삭제되었습니다.");
            response.sendRedirect(path + "/Mypage_servlet/reservationInfo.do?MemberNo=" + sessMemberNo);
        } else {
            System.out.println("fail");
            session.setAttribute("alertMsg", "예약 정보삭제에 실패하였습니다.");
            response.sendRedirect(path + "/Mypage_servlet/reservationInfoupdate.do?resNo=" + resNo);
        }
    }
}
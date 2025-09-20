package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import store.dto.ReservationDTO;

public class ReservationEditProc implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int resNo = Integer.parseInt(request.getParameter("resNo"));
        String date = request.getParameter("date");
        String time = request.getParameter("time");
        String peopleCount = request.getParameter("peopleCount");
        String resComment = request.getParameter("resComment");
        String changeReason = request.getParameter("changeReason");
        
	    ReservationDTO dtoRes = new ReservationDTO();
	    dtoRes.setResNo(resNo);
	    dtoRes.setResDate(date);
	    dtoRes.setResTime(time);
	    dtoRes.setResPeople(peopleCount);
	    dtoRes.setResComment(resComment);
	    dtoRes.setChangeReason(changeReason);
        
	    HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
	    
        MypageDAO dao = new MypageDAO();
        int result = dao.setUpdate(dtoRes);

        // DB process result
        if (result > 0) {
            System.out.println("success");
            session.setAttribute("alertMsg", "예약이 수정되었습니다.");
            response.sendRedirect(path + "/Mypage_servlet/reservationInfo.do?MemberNo=" + sessMemberNo);
        } else {
            System.out.println("fail");
            session.setAttribute("alertMsg", "예약 수정에 실패하였습니다.");
            response.sendRedirect(path + "/Mypage_servlet/reservationInfoUpdate.do?resNo=" + resNo);
        }
    }
}
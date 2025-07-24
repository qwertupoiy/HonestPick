package mypage.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import store.dto.ReservationDTO;

public class ReservationEdit implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int ResNo = Integer.parseInt(request.getParameter("resNo"));
		
		ReservationDTO dtoAg = new ReservationDTO();
		dtoAg.setResNo(ResNo);
        
        MypageDAO dao = new MypageDAO();
        ReservationDTO dtoRes = dao.getSelectOne(dtoAg);
        
        request.setAttribute("dtoRes", dtoRes);	        
    	
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/reservationInfoUpdate.jsp");
        rd.forward(request, response);
    }
}
package store.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import store.dao.StoreDAO;
import store.dto.ReservationDTO;

public class Reservation {
    public void processProc(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
        int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
        int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
        String date = request.getParameter("date");
        String time = request.getParameter("time");
        String peopleCount = request.getParameter("peopleCount");
        String resComment = request.getParameter("resComment");
        
        ReservationDTO dtoRes = new ReservationDTO();
        dtoRes.setStoreNo(StoreNo);
        dtoRes.setMemberNo(MemberNo);
        dtoRes.setResDate(date);
        dtoRes.setResTime(time);
        dtoRes.setResPeople(peopleCount);
        dtoRes.setResComment(resComment);
      
        StoreDAO daoRes = new StoreDAO();
        int result = daoRes.setInsert(dtoRes);
      
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("Reservation success");
            session.setAttribute("alertMsg", "예약 완료되었습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("Reservation fail");
            session.setAttribute("alertMsg", "예약 실패하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        }
    }
}

package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.WishListDTO;

public class WishAdd implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		WishListDTO dtoAg = new WishListDTO();
		dtoAg.setStoreNo(StoreNo);
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		int result = dao.setInsert(dtoAg);
		
		// 결과 처리
		HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("WishAdd Success");
    		session.setAttribute("alertMsg", "위시리스트에 등록되었습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("WishAdd Fail");
    		session.setAttribute("alertMsg", "위시리스트에 등록에 실패하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        }
    }
}
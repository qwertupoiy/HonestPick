package mypage.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.WishListDTO;

public class WishRemove implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		String page = request.getParameter("page");
		
		WishListDTO dtoAg = new WishListDTO();
		dtoAg.setStoreNo(StoreNo);
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		int result = dao.setDelete(dtoAg);
		
		// 결과 처리
		HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("WishRemove Success");
            if (page.equals("store")) {
        		session.setAttribute("alertMsg", "위시리스트에서 삭제되었습니다.");
            	response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
            } else {
        		session.setAttribute("alertMsg", "위시리스트에서 삭제되었습니다.");
            	response.sendRedirect(path + "/Mypage_servlet/wishList.do?MemberNo=" + MemberNo);
            }
        } else {
            System.out.println("WishRemove Fail");
            if (page.equals("store")) {
        		session.setAttribute("alertMsg", "위시리스트 삭제에 실패하였습니다.");
                response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
            } else {
        		session.setAttribute("alertMsg", "위시리스트 삭제에 실패하였습니다.");
            	response.sendRedirect(path + "/Mypage_servlet/wishList.do?MemberNo=" + MemberNo);
            }
        }
    }
}
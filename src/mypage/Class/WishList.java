package mypage.Class;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import mypage.dto.WishListDTO;

public class WishList implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		WishListDTO dtoAg = new WishListDTO();
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		List<WishListDTO> listWish = dao.getSelectAllWish(dtoAg);
		
		List<String[]> Facilities = new ArrayList<>();
		for (int i = 0; i < listWish.size(); i++) {
			String fileName;
			if (listWish.get(i).getStore().getStoreImage().equals("-")) {
				fileName = "none.jpg";
				listWish.get(i).getStore().setStoreImage(fileName);
			} else {
				fileName = listWish.get(i).getStore().getStoreImage().split("[|]")[1];
				listWish.get(i).getStore().setStoreImage(fileName);
			}
			
			Facilities.add(listWish.get(i).getStore().getStoreFacilities().split(", "));
		}

		request.setAttribute("listWish", listWish);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/wishList.jsp");
        rd.forward(request, response);
    }
}
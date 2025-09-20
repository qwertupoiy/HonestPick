package mypage.Class;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mypage.controller.MypageCommand;
import mypage.dao.MypageDAO;
import store.dto.StoreDTO;

public class StoreList implements MypageCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));

		StoreDTO dtoAg = new StoreDTO();
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		List<StoreDTO> listStore = dao.getSelectOne(dtoAg);
		
		for (int i = 0; i < listStore.size(); i++) {
			String fileName;
			if (listStore.get(i).getStoreImage().equals("-")) {
				fileName = "none.jpg";
				listStore.get(i).setStoreImage(fileName);
			} else {
				fileName = listStore.get(i).getStoreImage().split("[|]")[1];
				listStore.get(i).setStoreImage(fileName);
			}
			
			// MemberShip
			if (listStore.get(i).getMemberShip() != null) {
			    Date membershipDate = listStore.get(i).getMemberShip();  // getMemberShip()이 반환하는 Date 값
			    Date currentDate = new Date();  // 현재 시간

			    // 비교: membershipDate가 현재 시간보다 이전인지 확인
			    if (membershipDate.after(currentDate)) {
			        // membershipDate가 현재 시간보다 이후라면
			    	listStore.get(i).setState("exist");
			    } else {
			        // membershipDate와 currentDate가 같거나 이전인 경우
			    	listStore.get(i).setState("none");
			    }
			} else {
			    System.out.println("Membership date is null.");
			}
		}
		
		request.setAttribute("listStore", listStore);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/storeList.jsp");
        rd.forward(request, response);
    }
}
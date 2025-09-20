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
import store.dto.ReviewDTO;

public class ReviewList implements MypageCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
		
		// MemberNo check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (sessMemberNo != MemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
    	
		ReviewDTO dtoAg = new ReviewDTO();
		dtoAg.setMemberNo(MemberNo);
		
		MypageDAO dao = new MypageDAO();
		List<ReviewDTO> listReview = dao.getSelectAllReview(dtoAg);
		
		for (int i = 0; i < listReview.size(); i++) {
			String ReviewfileName;
			if (listReview.get(i).getReviewImage().equals("-")) {
				ReviewfileName = "none.jpg";
				listReview.get(i).setReviewImage(ReviewfileName);
			} else {
				ReviewfileName = listReview.get(i).getReviewImage().split("[|]")[1];
				listReview.get(i).setReviewImage(ReviewfileName);
			}
			
			String StorefileName;
			if (listReview.get(i).getStore().getStoreImage().equals("-")) {
				StorefileName = "none.jpg";
				listReview.get(i).getStore().setStoreImage(StorefileName);
			} else {
				StorefileName = listReview.get(i).getStore().getStoreImage().split("[|]")[1];
				listReview.get(i).getStore().setStoreImage(StorefileName);
			}
		}
		
		request.setAttribute("listReview", listReview);
    	
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/myPage/reviewList.jsp");
        rd.forward(request, response);
    }
}
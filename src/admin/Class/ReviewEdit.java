package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class ReviewEdit implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int ReviewNo = Integer.parseInt(request.getParameter("ReviewNo"));
		
		ReviewDTO dtoAg = new ReviewDTO();
		dtoAg.setReviewNo(ReviewNo);
		
		StoreDAO dao = new StoreDAO();
		
		// Review owner check
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (dao.getSelectOne(dtoAg).getMemberNo() != sessMemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
		
		ReviewDTO dtoReview = dao.getSelectOne(dtoAg);
		
		String ReviewfileName;
		if (dtoReview.getReviewImage().equals("-")) {
			ReviewfileName = "none.jpg";
			dtoReview.setReviewImage(ReviewfileName);
		} else {
			ReviewfileName = dtoReview.getReviewImage().split("[|]")[1];
			dtoReview.setReviewImage(ReviewfileName);
		}

		request.setAttribute("dtoReview", dtoReview);
		
		// Store information
		StoreDTO dtoStore = new StoreDTO();
		dtoStore.setStoreNo(dtoReview.getStoreNo());
		
		dtoStore = dao.getSelectOne(dtoStore);
		String StorefileName;
		if (dtoStore.getStoreImage().equals("-")) {
			StorefileName = "none.jpg";
			dtoStore.setStoreImage(StorefileName);
		} else {
			StorefileName = dtoStore.getStoreImage().split("[|]")[1];
			dtoStore.setStoreImage(StorefileName);
		}
		
		request.setAttribute("dtoStore", dtoStore);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/reviewEdit.jsp");
        rd.forward(request, response);
    }
}

package home.Class;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;
import home.dao.HomeDAO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class Home {
	public void process(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		HomeDAO dao = new HomeDAO();
		
		// Recommendation
		List<StoreDTO> listRecommend = dao.getSelectRank();
		
		for (int i = 0; i < listRecommend.size(); i++) {
			String fileName;
			if (listRecommend.get(i).getStoreImage().equals("-")) {
				fileName = "none.jpg";
				listRecommend.get(i).setStoreImage(fileName);
			} else {
				fileName = listRecommend.get(i).getStoreImage().split("[|]")[1];
				listRecommend.get(i).setStoreImage(fileName);
			}
		}
		
		request.setAttribute("listRecommend", listRecommend);
		
		// Category
		List<StoreDTO> listCategory = dao.getSelectCategory();
		
		for (int i = 0; i < listCategory.size(); i++) {
			String fileName;
			if (listCategory.get(i).getStoreImage().equals("-")) {
				fileName = "none.jpg";
				listCategory.get(i).setStoreImage(fileName);
			} else {
				fileName = listCategory.get(i).getStoreImage().split("[|]")[1];
				listCategory.get(i).setStoreImage(fileName);
			}
		}
		
		request.setAttribute("listCategory", listCategory);
		
		// Review
		List<ReviewDTO> listReview = dao.getSelectReview();
		
		for (int i = 0; i < listReview.size(); i++) {
			String ReviewfileName;
			if (listReview.get(i).getReviewImage().equals("-")) {
				ReviewfileName = "none.jpg";
				listReview.get(i).setReviewImage(ReviewfileName);
			} else {
				ReviewfileName = listReview.get(i).getReviewImage().split("[|]")[1];
				listReview.get(i).setReviewImage(ReviewfileName);
			}
			
			String MemberfileName;
			if (listReview.get(i).getMember().getMemberImage().equals("-")) {
				MemberfileName = "member_none.jpg";
				listReview.get(i).getMember().setMemberImage(MemberfileName);
			} else {
				MemberfileName = listReview.get(i).getMember().getMemberImage().split("[|]")[1];
				listReview.get(i).getMember().setMemberImage(MemberfileName);
			}
		}
		
		request.setAttribute("listReview", listReview);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/home/home.jsp");
        rd.forward(request, response);
    }
}

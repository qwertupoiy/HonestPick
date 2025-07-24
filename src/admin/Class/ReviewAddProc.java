package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.ReviewDTO;

public class ReviewAddProc implements AdminCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		int max_upload = 10 * 1024 * 1024; // 10MB까지
		
		//multi 객체(경로) 생성
		MultipartRequest multi = new MultipartRequest(
			request,
			uploadPath,
			max_upload,
			"utf-8",
			new DefaultFileRenamePolicy()
		);
		
		String fileOrgName = multi.getOriginalFileName("ReviewImage");
		String fileName = multi.getFilesystemName("ReviewImage");
		String ReviewImage;
		if (fileOrgName == null || fileName == null) {
			ReviewImage = "-";
		} else {
			ReviewImage = fileOrgName + "|" + fileName;
		}
		
        int StoreNo = Integer.parseInt(multi.getParameter("StoreNo"));
        int MemberNo = Integer.parseInt(multi.getParameter("MemberNo"));
        String ReviewTitle = multi.getParameter("ReviewTitle");
        String ReviewContent = multi.getParameter("ReviewContent");
        int ReviewEstimation = Integer.parseInt(multi.getParameter("ReviewEstimation"));
        int ResNo = Integer.parseInt(multi.getParameter("ResNo"));
        
        ReviewDTO dtoReview = new ReviewDTO();
        dtoReview.setStoreNo(StoreNo);
        dtoReview.setMemberNo(MemberNo);
        dtoReview.setReviewImage(ReviewImage);
        dtoReview.setReviewTitle(ReviewTitle);
        dtoReview.setReviewContent(ReviewContent);
        dtoReview.setReviewEstimation(ReviewEstimation);
        dtoReview.setResNo(ResNo);
      
        StoreDAO dao = new StoreDAO();
        int result = dao.setInsert(dtoReview);
      
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("Review success");
            session.setAttribute("alertMsg", "리뷰가 등록되었습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("Review fail");
            session.setAttribute("alertMsg", "리뷰 등록에 실패하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        }
    }
}

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

public class ReviewEditProc implements AdminCommand {
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

		int ReviewNo = Integer.parseInt(multi.getParameter("ReviewNo"));
		int StoreNo = Integer.parseInt(multi.getParameter("StoreNo"));
        int MemberNo = Integer.parseInt(multi.getParameter("MemberNo"));
        String ReviewTitle = multi.getParameter("ReviewTitle");
        String ReviewContent = multi.getParameter("ReviewContent");
        int ReviewEstimation = Integer.parseInt(multi.getParameter("ReviewEstimation"));
        
        // null이거나 빈 값일 경우 에러 처리
        
        ReviewDTO dtoReview = new ReviewDTO();
        dtoReview.setReviewNo(ReviewNo);
        dtoReview.setStoreNo(StoreNo);
        dtoReview.setMemberNo(MemberNo);
        dtoReview.setReviewImage(ReviewImage);
        dtoReview.setReviewTitle(ReviewTitle);
        dtoReview.setReviewContent(ReviewContent);
        dtoReview.setReviewEstimation(ReviewEstimation);

        StoreDAO dao = new StoreDAO();
        
        // If before_attachInfo is not existed
        if (fileOrgName == null || fileName == null) {
        	dtoReview.setReviewImage(dao.getSelectOne(dtoReview).getReviewImage());
        } else if (dao.getSelectOne(dtoReview).getReviewImage().equals("-")) {
        	dtoReview.setReviewImage(ReviewImage);
        } else {
        	// 기존 이미지 파일 삭제
        	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoReview).getReviewImage().split("[|]")[1]);
        	if (deleteFile.exists()) {
        		deleteFile.delete();
        		System.out.println("FileDelete Success");
        		dtoReview.setReviewImage(ReviewImage);
        	} else {
        		System.out.println("FileDelete Fail");
        		return;
        	}
        }

        int result = dao.setUpdate(dtoReview);

        // 결과 처리
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("ReviewEdit success");
            session.setAttribute("alertMsg", "리뷰 수정에 성공하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("ReviewEdit fail");
            session.setAttribute("alertMsg", "리뷰 수정에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/reviewEdit.do?&ReviewNo" + ReviewNo);
        }
    }
}

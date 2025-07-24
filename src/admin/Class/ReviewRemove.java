package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.ReviewDTO;

public class ReviewRemove implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int ReviewNo = Integer.parseInt(request.getParameter("ReviewNo"));
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		int MemberNo = Integer.parseInt(request.getParameter("MemberNo"));
        
        // ReviewDTO 객체 생성 및 값 설정
        ReviewDTO dtoAg = new ReviewDTO();
        dtoAg.setReviewNo(ReviewNo);
        dtoAg.setStoreNo(StoreNo);
        dtoAg.setMemberNo(MemberNo);

        StoreDAO dao = new StoreDAO();
        
        // 기존 이미지 파일 삭제
        String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		if (!dao.getSelectOne(dtoAg).getReviewImage().equals("-")) {
	    	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getReviewImage().split("[|]")[1]);
	    	if (deleteFile.exists()) {
	    		deleteFile.delete();
	    		System.out.println("fileDelete Success");
	    	} else {
	    		System.out.println("fileDelete Fail");
	    		return;
	    	}
		}
        
        int result = dao.setDelete(dtoAg);

        // 결과 처리
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("ReviewRemove Success");
            session.setAttribute("alertMsg", "리뷰가 삭제에 성공하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("ReviewRemove Fail");
            session.setAttribute("alertMsg", "리뷰가 삭제에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/reviewEdit.do?ReviewNo=" + ReviewNo);
        }
    }
}
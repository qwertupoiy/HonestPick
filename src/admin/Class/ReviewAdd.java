package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import member.dto.MemberDTO;
import store.dao.StoreDAO;
import store.dto.ReviewDTO;
import store.dto.StoreDTO;

public class ReviewAdd implements AdminCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		
		StoreDTO dtoAg = new StoreDTO();
		dtoAg.setStoreNo(StoreNo);
		
		StoreDAO daoStore = new StoreDAO();
		StoreDTO dtoStore = daoStore.getSelectOne(dtoAg);
		
		String StorefileName;
		if (dtoStore.getStoreImage().equals("-")) {
			StorefileName = "none.jpg";
			dtoStore.setStoreImage(StorefileName);
		} else {
			StorefileName = dtoStore.getStoreImage().split("[|]")[1];
			dtoStore.setStoreImage(StorefileName);
		}
		
		MemberDTO dtoMember = new MemberDTO();
		dtoMember.setMemberNo(dtoStore.getMemberNo());

		request.setAttribute("dtoStore", dtoStore);
		
		// ResNo for Review
		String ResNo_ = request.getParameter("ResNo");
		int ResNo = 0;
		try {
			ResNo = Integer.parseInt(ResNo_);
		} catch (Exception e) {
			ResNo = 0;
		}
		
		request.setAttribute("ResNo", ResNo);
		
		// ReviewEstimation
		ReviewDTO ReviewInfo = daoStore.getReviewAvg(dtoAg);
		
		request.setAttribute("ReviewInfo", ReviewInfo);
		
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/reviewAdd.jsp");
        rd.forward(request, response);
    }
}

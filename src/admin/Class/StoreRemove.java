package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.StoreDTO;

public class StoreRemove implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
        
        // StoreDTO 객체 생성 및 값 설정
        StoreDTO dtoAg = new StoreDTO();
        dtoAg.setStoreNo(StoreNo);

        StoreDAO dao = new StoreDAO();
        
        // 기존 이미지 파일 삭제
        String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		if (!dao.getSelectOne(dtoAg).getStoreImage().equals("-")) {
	    	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getStoreImage().split("[|]")[1]);
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
        int sessAdmin = (int) session.getAttribute("Admin");
		if(sessAdmin == 2) {
			if (result > 0) {
	            System.out.println("Admin_StoreEdit_success");
	            session.setAttribute("alertMsg", "매장 삭제에 성공하였습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_stores.do");
	        } else {
	            System.out.println("Admin_StoreEdit_fail");
	            session.setAttribute("alertMsg", "매장 삭제에 실패하였습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_stores.do");
	        }
		} else if (sessAdmin < 2){
			if (result > 0) {
	            System.out.println("StoreRemove Success");
	            session.setAttribute("alertMsg", "매장 삭제에 성공하였습니다.");
	            response.sendRedirect(path + "/Store_servlet/storeList.do");
	        } else {
	            System.out.println("StroeRemove Fail");
	            session.setAttribute("alertMsg", "매장 삭제에 실패하였습니다.");
	            response.sendRedirect(path + "/Admin_servlet/storeRemove.do?StoreNo=" + StoreNo);
	        }
		}
    }
}
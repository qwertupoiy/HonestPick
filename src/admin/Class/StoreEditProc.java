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
import store.dto.StoreDTO;

public class StoreEditProc implements AdminCommand {
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
		
		String fileOrgName = multi.getOriginalFileName("StoreImage");
		String fileName = multi.getFilesystemName("StoreImage");
		String StoreImage;
		if (fileOrgName == null || fileName == null) {
			StoreImage = "-";
		} else {
			StoreImage = fileOrgName + "|" + fileName;
		}

		int StoreNo = Integer.parseInt(multi.getParameter("StoreNo"));
		String StoreCategory = multi.getParameter("StoreCategory");
		String StoreName = multi.getParameter("StoreName");
        String OfficeName = multi.getParameter("OfficeName");
        String StoreContact = multi.getParameter("StoreContact");
        String StorePostalCode = multi.getParameter("StorePostalCode");
        String StoreAddr = multi.getParameter("StoreAddr");
        String StoreStreetAddr = multi.getParameter("StoreStreetAddr");
        String StoreAdditionalInfo = multi.getParameter("StoreAdditionalInfo");
        String StoreBusinessNum = multi.getParameter("StoreBusinessNum");
        String StoreComment = multi.getParameter("StoreComment");
		String StoreFacilitiesString = multi.getParameter("StoreFacilitiesString");
        String StoreScheduleString = multi.getParameter("StoreScheduleString");
        
        // null이거나 빈 값일 경우 에러 처리
        
        // StoreDTO 객체 생성 및 값 설정
        StoreDTO dtoAg = new StoreDTO();
        dtoAg.setStoreNo(StoreNo);
        dtoAg.setStoreCategory(StoreCategory);
        dtoAg.setStoreName(StoreName);
        dtoAg.setOfficeName(OfficeName);
        dtoAg.setStoreContact(StoreContact);
        dtoAg.setStorePostalCode(StorePostalCode);
        dtoAg.setStoreAddr(StoreAddr);
        dtoAg.setStoreStreetAddr(StoreStreetAddr);
        dtoAg.setStoreAdditionalInfo(StoreAdditionalInfo);
        dtoAg.setStoreBusinessNum(StoreBusinessNum);
        dtoAg.setStoreSchedule(StoreScheduleString);
        dtoAg.setStoreComment(StoreComment);
        dtoAg.setStoreFacilities(StoreFacilitiesString);

        StoreDAO dao = new StoreDAO();
        
        // If before_attachInfo is not existed
        if (fileOrgName == null || fileName == null) {
        	dtoAg.setStoreImage(dao.getSelectOne(dtoAg).getStoreImage());
        } else if (dao.getSelectOne(dtoAg).getStoreImage().equals("-")) {
        	dtoAg.setStoreImage(StoreImage);
        } else {
        	// 기존 이미지 파일 삭제
        	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getStoreImage().split("[|]")[1]);
        	if (deleteFile.exists()) {
        		deleteFile.delete();
        		System.out.println("FileDelete Success");
        		dtoAg.setStoreImage(StoreImage);
        	} else {
        		System.out.println("FileDelete Fail");
        		return;
        	}
        }

        int result = dao.setUpdate(dtoAg);

        // 결과 처리
        HttpSession session = request.getSession();
        int sessAdmin = (int) session.getAttribute("Admin");
		if(sessAdmin == 2) {
			if (result > 0) {
	            System.out.println("Admin_StoreEdit_success");
	            session.setAttribute("alertMsg", "매장 정보수정이 완료되었습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_stores.do");
	        } else {
	            System.out.println("Admin_StoreEdit_fail");
	            session.setAttribute("alertMsg", "매장 정보수정에 실패하였습니다.");
	            response.sendRedirect(path + "/Admin_servlet/admin_stores.do");
	        }
		} else if (sessAdmin < 2){
			if (result > 0) {
	            System.out.println("StoreEdit_success");
	            session.setAttribute("alertMsg", "매장 정보수정이 완료되었습니다.");
	            response.sendRedirect(path + "/Store_servlet/storeList.do");
	        } else {
	            System.out.println("StoreEdit_fail");
	            session.setAttribute("alertMsg", "매장 정보수정에 실패하였습니다.");
	            response.sendRedirect(path + "/Store_servlet/storeEdit.do?StoreNo=" + StoreNo);
	        }
		}
    }
}

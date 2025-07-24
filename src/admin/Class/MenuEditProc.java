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
import store.dto.MenuDTO;

public class MenuEditProc implements AdminCommand {
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
		
		String fileOrgName = multi.getOriginalFileName("MenuImage");
		String fileName = multi.getFilesystemName("MenuImage");
		String MenuImage;
		if (fileOrgName == null || fileName == null) {
			MenuImage = "-";
		} else {
			MenuImage = fileOrgName + "|" + fileName;
		}

		int StoreNo = Integer.parseInt(multi.getParameter("StoreNo"));
		int MenuNo = Integer.parseInt(multi.getParameter("MenuNo"));
		String MenuName = multi.getParameter("MenuName");
		String MenuPrice = multi.getParameter("MenuPrice");
		String MenuDescription = multi.getParameter("MenuDescription");
        
        // null이거나 빈 값일 경우 에러 처리
        
        // MenuDTO 객체 생성 및 값 설정
        MenuDTO dtoAg = new MenuDTO();
        dtoAg.setStoreNo(StoreNo);
        dtoAg.setMenuNo(MenuNo);
        dtoAg.setMenuImage(MenuImage);
        dtoAg.setMenuName(MenuName);
        dtoAg.setMenuPrice(MenuPrice);
        dtoAg.setMenuDescription(MenuDescription);

        StoreDAO dao = new StoreDAO();
        
        // If before_attachInfo is not existed
        if (fileOrgName == null || fileName == null) {
        	dtoAg.setMenuImage(dao.getSelectOne(dtoAg).getMenuImage());
        } else if (dao.getSelectOne(dtoAg).getMenuImage().equals("-")) {
        	dtoAg.setMenuImage(MenuImage);
        } else {
        	// 기존 이미지 파일 삭제
        	java.io.File deleteFile = new java.io.File(uploadPath + "/" + dao.getSelectOne(dtoAg).getMenuImage().split("[|]")[1]);
        	if (deleteFile.exists()) {
        		deleteFile.delete();
        		System.out.println("FileDelete Success");
        		dtoAg.setMenuImage(MenuImage);
        	} else {
        		System.out.println("FileDelete Fail");
        		return;
        	}
        }

        int result = dao.setUpdate(dtoAg);

        // 결과 처리
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("MenuEdit success");
            session.setAttribute("alertMsg", "메뉴 정보수정에 성공하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("MenuEdit fail");
            session.setAttribute("alertMsg", "메뉴 정보수정에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/menuEdit.do?StoreNo=" + StoreNo + "&MenuNo" + MenuNo);
        }
    }
}

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

public class MenuAddProc implements AdminCommand {
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
		String MenuName = multi.getParameter("MenuName");
        String MenuPrice = multi.getParameter("MenuPrice");
        String MenuDescription = multi.getParameter("MenuDescription");
        
        // null이거나 빈 값일 경우 에러 처리
        
        // MenuDTO 객체 생성 및 값 설정
        MenuDTO dtoAg = new MenuDTO();
        dtoAg.setStoreNo(StoreNo);
        dtoAg.setMenuImage(MenuImage);
        dtoAg.setMenuName(MenuName);
        dtoAg.setMenuPrice(MenuPrice);
        dtoAg.setMenuDescription(MenuDescription);

        StoreDAO dao = new StoreDAO();
        int result = dao.setInsert(dtoAg);

        // 결과 처리
        HttpSession session = request.getSession();
        if (result > 0) {
            System.out.println("MenuAdd Success");
            session.setAttribute("alertMsg", "메뉴가 등록되었습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        } else {
            System.out.println("MenuAdd Fail");
            session.setAttribute("alertMsg", "메뉴 등록에 실패하였습니다.");
            response.sendRedirect(path + "/Store_servlet/restaurantDetail.do?StoreNo=" + StoreNo);
        }
    }
}

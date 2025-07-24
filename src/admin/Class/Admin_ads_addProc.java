package admin.Class;

import java.io.IOException;
import java.sql.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;

public class Admin_ads_addProc implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		/*
		HttpSession session = request.getSession();
		int sessAdmin = (int) session.getAttribute("Admin");
		*/
		
		String attachPath = "C:/hp/attach" + request.getContextPath();
		String uploadPath = attachPath + "/product";
		int max_upload = 10 * 1024 * 1024; // 10MB까지
			
		// multi_object(경로) 생성
		MultipartRequest multi = new MultipartRequest(
			request,
			uploadPath,
			max_upload,
			"utf-8",
			new DefaultFileRenamePolicy()
		);
		
		String fileOrgName = multi.getOriginalFileName("adImage");
		String fileName = multi.getFilesystemName("adImage");
		String MenuImage = "";
		if (fileOrgName == null || fileName == null || fileOrgName.isEmpty() || fileName.isEmpty()) {
			MenuImage = "none.jpg";
		} else {
			MenuImage = fileOrgName + "|" + fileName;
		}
				
		String adTitle = multi.getParameter("adTitle");
		String adStartDate_ = multi.getParameter("adStartDate");
		Date adStartDate = Date.valueOf(adStartDate_);
		String description = multi.getParameter("description");
		String how_long_ = multi.getParameter("adPeriod");
		int how_long = 0;
		try {
			if(how_long_ != null && !how_long_.isEmpty()) {
				how_long = Integer.parseInt(how_long_);
				
				switch (how_long) {
					case 1: how_long = 1; break;
					case 2: how_long = 7; break;
					case 3: how_long = 30; break;
					case 4: how_long = 365; break;
					default:
						System.out.println("You didn't choose your ad's periods");
						return;
				}
				System.out.println("ad_period : " + how_long + "days");
			}
		} catch(Exception e) {
			e.printStackTrace();
			System.out.println("period is not inserted");
		}
		
		AdvertisementDTO dto = new AdvertisementDTO();
		dto.setAdTitle(adTitle);
		dto.setAdImage(MenuImage);
		dto.setPeriod(how_long);
		dto.setAdStartDate(adStartDate);
		dto.setDescription(description);
		
		AdminDAO dao = new AdminDAO();
		int result = dao.setInsert(dto);
		
		HttpSession session = request.getSession();
		if (result > 0) {
            System.out.println("Ads Add Success");
            session.setAttribute("alertMsg", "광고가 등록되었습니다.");
            response.sendRedirect(path + "/Admin_servlet/admin_ads.do");
        } else {
            System.out.println("Ads Add Fail");
            session.setAttribute("alertMsg", "광고가 등록에 실패하였습니다.");
            response.sendRedirect(path + "/Admin_servlet/admin_ads.do");
        }
	}
}
